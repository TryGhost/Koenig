import React from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getNodeByKey} from 'lexical';
import {createPreprocessor, renderTemplate, scopeCss} from '@tryghost/kg-default-nodes';

// CSS reset to neutralise Tailwind preflight inside plugin cards.
// Tailwind's *, ::before, ::after { box-sizing: border-box } and
// block-level margin resets affect plugin-rendered HTML but not
// the published page. This reset restores browser defaults so the
// card renders identically in editor and preview.
const PREFLIGHT_RESET = `
    .{ns}, .{ns} *, .{ns} ::before, .{ns} ::after { box-sizing: content-box; white-space: normal; word-break: normal; overflow-wrap: normal; }
    .{ns} img, .{ns} svg, .{ns} video, .{ns} canvas, .{ns} audio, .{ns} iframe, .{ns} embed, .{ns} object { display: inline; vertical-align: baseline; }
    .{ns} blockquote, .{ns} dl, .{ns} dd, .{ns} h1, .{ns} h2, .{ns} h3, .{ns} h4, .{ns} h5, .{ns} h6, .{ns} hr, .{ns} figure, .{ns} p, .{ns} pre { margin: revert; }
    .{ns} ol, .{ns} ul { list-style: revert; margin: revert; padding: revert; }
    .{ns} a { color: revert; text-decoration: revert; }
    .{ns} table { border-collapse: separate; border-spacing: 0; }
    .{ns} th, .{ns} td { text-align: revert; font-weight: revert; }
    .{ns} strong, .{ns} b { font-weight: revert; }
    .{ns} em, .{ns} i { font-style: revert; }
    .{ns} button, .{ns} input, .{ns} select, .{ns} textarea { font-family: revert; font-size: revert; line-height: revert; }
    .{ns} ::placeholder { color: revert; opacity: revert; }
    .{ns} ::before, .{ns} ::after { border-width: 0; border-style: solid; border-color: currentColor; }
`;

// Inject CSS into <head> so the editor applies custom class styles
// Reference counting for shared stylesheets: multiple card instances
// of the same plugin share one <style> element. Only remove it when
// the last instance unmounts.
const _styleRefs = {};

function useInjectStyles(pluginName, css) {
    React.useEffect(() => {
        const namespace = `plugin-${pluginName}`;
        const reset = PREFLIGHT_RESET.replace(/\{ns\}/g, namespace);
        const scopedCss = scopeCss(css || '', namespace);
        const fullCss = reset + '\n' + scopedCss;
        const styleId = `plugin-card-css-${pluginName}`;
        let el = document.getElementById(styleId);
        if (!el) {
            el = document.createElement('style');
            el.id = styleId;
            document.head.appendChild(el);
        }
        el.textContent = fullCss;
        _styleRefs[styleId] = (_styleRefs[styleId] || 0) + 1;

        return () => {
            _styleRefs[styleId] = (_styleRefs[styleId] || 1) - 1;
            if (_styleRefs[styleId] <= 0) {
                delete _styleRefs[styleId];
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }
        };
    }, [pluginName, css]);
}

export const PluginCardNodeComponent = ({html: initialHtml, cardName, nodeKey, payload: initialPayload, pluginName}) => {
    const [editor] = useLexicalComposerContext();
    const [isEditing, setIsEditing] = React.useState(false);
    const [rawPayload, setRawPayload] = React.useState(() => {
        try {
            const p = initialPayload || '{}';
            return typeof p === 'object' ? p : JSON.parse(p);
        } catch {
            return {};
        }
    });
    const [cardDef, setCardDef] = React.useState(null);
    const [pluginCss, setPluginCss] = React.useState('');

    useInjectStyles(pluginName, pluginCss);

    React.useEffect(() => {
        fetch('/ghost/api/admin/plugins/cards/', {credentials: 'include'})
            .then(r => r.json())
            .then(data => {
                const cards = data.plugins?.flat() || [];
                const found = cards.find(c => c.plugin === pluginName && c.name === cardName);
                if (found) {
                    setCardDef(found);
                    if (found.css) {
                        setPluginCss(found.css);
                    }
                    // Sync template, CSS and preprocess from plugin loader
                    // so updates take effect without re-inserting the card
                    editor.update(() => {
                        const node = $getNodeByKey(nodeKey);
                        if (node) {
                            if (found.css !== undefined) {
                                node.css = found.css;
                            }
                            if (found.template !== undefined) {
                                node.template = found.template;
                            }
                            if (found.preprocess !== undefined) {
                                node.preprocess = found.preprocess;
                            }
                        }
                    });
                }
            }).catch((err) => {
                console.warn('[PluginCard] Failed to fetch plugin cards:', err);
            });
    }, [pluginName, cardName]);

    const handleSave = (newRawPayload) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (node) {
                node.payload = newRawPayload;
                node.pluginName = pluginName;
                node.cardName = cardName;
            }
        });
        setRawPayload(newRawPayload);
        setIsEditing(false);
    };

    const getFieldValue = (field) => {
        const val = rawPayload[field.key];
        return val !== undefined ? val : (field.default ?? '');
    };

    // View mode HTML — computed unconditionally to keep hook count stable
    const template = cardDef?.template || '';
    const preprocess = React.useMemo(() => {
        if (cardDef?.preprocess) {
            try {
                return createPreprocessor(cardDef.preprocess);
            } catch { return null; }
        }
        return null;
    }, [cardDef?.preprocess]);

    const renderedHtml = React.useMemo(() => {
        if (!template) return '<div class="review-card"><div class="p-4 text-sm text-grey-500">No template loaded</div></div>';
        try {
            const data = preprocess ? preprocess(rawPayload) : rawPayload;
            return renderTemplate(template, data);
        } catch (e) {
            return `<div class="review-card"><div class="p-4 text-sm text-red">Render error: ${e.message}</div></div>`;
        }
    }, [template, rawPayload, preprocess]);

    // Focus first field when entering edit mode
    const firstFieldRef = React.useRef(null);

    React.useEffect(() => {
        if (isEditing && firstFieldRef.current) {
            firstFieldRef.current.focus();
        }
    }, [isEditing]);

    // Edit mode
    if (isEditing) {
        if (!cardDef) {
            return <div className="p-4 text-sm text-grey-500">Loading...</div>;
        }
        return (
            <div className="rounded-lg border border-grey-300 bg-white p-4 dark:border-dark-600 dark:bg-dark-bg">
                <h3 className="mb-4 text-sm font-semibold">{cardDef.label}</h3>
                <div className="space-y-3">
                    {cardDef.fields.map((field, index) => (
                        <div key={field.key}>
                            <label className="mb-1 block text-xs font-medium text-grey-600 dark:text-grey-400">{field.title}</label>
                            {field.type === 'textarea' ? (
                                <textarea ref={index === 0 ? firstFieldRef : undefined} className="w-full rounded border border-grey-300 px-3 py-2 text-sm dark:border-dark-600 dark:bg-dark-200" rows={3}
                                    value={getFieldValue(field)}
                                    onChange={(e) => setRawPayload(prev => ({...prev, [field.key]: e.target.value}))} />
                            ) : field.type === 'number' ? (
                                <input ref={index === 0 ? firstFieldRef : undefined} className="w-full rounded border border-grey-300 px-3 py-2 text-sm dark:border-dark-600 dark:bg-dark-200"
                                    max={field.max} min={field.min} step={field.step} type="number"
                                    value={getFieldValue(field)}
                                    onChange={(e) => {
                                        const v = parseFloat(e.target.value);
                                        setRawPayload(prev => ({...prev, [field.key]: isNaN(v) ? 0 : v}));
                                    }} />
                            ) : (
                                <input ref={index === 0 ? firstFieldRef : undefined} className="w-full rounded border border-grey-300 px-3 py-2 text-sm dark:border-dark-600 dark:bg-dark-200"
                                    type="text" value={getFieldValue(field)}
                                    onChange={(e) => setRawPayload(prev => ({...prev, [field.key]: e.target.value}))} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <button className="rounded bg-grey-200 px-3 py-1.5 text-sm dark:bg-dark-200" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button className="rounded bg-green px-3 py-1.5 text-sm text-white" onClick={() => handleSave(rawPayload)}>Save</button>
                </div>
            </div>
        );
    }

    // View mode — rendered HTML inside a plugin-namespaced container.
    // A CSS preflight reset (injected via useInjectStyles) counters
    // Tailwind preflight so the card renders identically in editor and
    // published page. Combined with not-kg-prose for Koenig typography isolation.
    return (
        <div className="group relative cursor-pointer" onClick={() => setIsEditing(true)}>
            <div
                className={`plugin-${pluginName} not-kg-prose`}
                dangerouslySetInnerHTML={{__html: renderedHtml}}
            />
            <button className="absolute right-2 top-2 rounded bg-grey-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">Edit</button>
        </div>
    );
};
