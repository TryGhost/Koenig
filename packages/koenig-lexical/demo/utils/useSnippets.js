import {useState} from 'react';

function getSnippetsFromStorage() {
    const snippetsStr = localStorage.getItem('snippets');

    return snippetsStr ? JSON.parse(snippetsStr) : [{name: 'planes',value: '{"namespace":"KoenigEditor","nodes":[{"type":"image","version":1,"src":"https://images.unsplash.com/photo-1556388158-158ea5ccacbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDl8fGFpcmNyYWZ0fGVufDB8fHx8MTcxNTc1OTIxNXww&ixlib=rb-4.0.3&q=80&w=2000","width":5046,"height":3364,"title":"","alt":"white biplane","caption":"<span style=\\"white-space: pre-wrap;\\">Photo by </span><a href=\\"https://unsplash.com/@zhpix\\"><span style=\\"white-space: pre-wrap;\\">Pascal Meier</span></a><span style=\\"white-space: pre-wrap;\\"> / </span><a href=\\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\\"><span style=\\"white-space: pre-wrap;\\">Unsplash</span></a>","cardWidth":"regular","href":""},{"type":"image","version":1,"src":"https://images.unsplash.com/photo-1556388158-158ea5ccacbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDl8fGFpcmNyYWZ0fGVufDB8fHx8MTcxNTc1OTIxNXww&ixlib=rb-4.0.3&q=80&w=2000","width":5046,"height":3364,"title":"","alt":"white biplane","caption":"<span style=\\"white-space: pre-wrap;\\">Photo by </span><a href=\\"https://unsplash.com/@zhpix\\"><span style=\\"white-space: pre-wrap;\\">Pascal Meier</span></a><span style=\\"white-space: pre-wrap;\\"> / </span><a href=\\"https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit\\"><span style=\\"white-space: pre-wrap;\\">Unsplash</span></a>","cardWidth":"regular","href":""}]}'}];
}

function updateSnippetsInStorage(snippetsArr = []) {
    localStorage.setItem('snippets', JSON.stringify(snippetsArr));
}

export const useSnippets = () => {
    const [snippets, setSnippets] = useState(getSnippetsFromStorage());

    function createSnippet({name, value}) {
        const updatedSnippets = [...snippets];
        const snippetIndexForReplace = snippets.findIndex(item => item.name === name);
        if (snippetIndexForReplace === -1) {
            updatedSnippets.push({name, value});
        } else {
            updatedSnippets[snippetIndexForReplace].value = value;
        }

        setSnippets(updatedSnippets);
        updateSnippetsInStorage(updatedSnippets);
    }

    function deleteSnippet(snippet) {
        const updatedSnippets = snippets.filter(item => item.name !== snippet.name);
        setSnippets(updatedSnippets);
        updateSnippetsInStorage(updatedSnippets);
    }

    return {
        createSnippet,
        deleteSnippet,
        snippets
    };
};
