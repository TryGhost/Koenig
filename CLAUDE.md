# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Koenig is Ghost's editor based on the Lexical framework. This is a Lerna-managed monorepo containing multiple packages for Ghost's content editing ecosystem.

## Package management

This project uses Yarn for package management.

## Key Commands

### Setup and Development
```bash
yarn setup              # Initial setup: install deps, link packages, build all
yarn dev                # Run koenig-lexical in standalone mode (localhost:5173)
yarn test               # Run tests across all packages (delegates to lerna run test)
yarn lint               # Run ESLint across all packages
yarn ship               # Publish packages to npm (Ghost team only)
```

### Package-specific Development
```bash
yarn workspace @tryghost/koenig-lexical dev    # Same as yarn dev
```

### Testing (from koenig-lexical package)
```bash
yarn test:unit          # Vitest unit tests
yarn test:e2e           # Playwright e2e tests
yarn test:e2e:headed    # E2E tests with browser UI (for debugging)
```

## Architecture

### Core Packages

- **[koenig-lexical](packages/koenig-lexical)**: Main editor package - React components built on Lexical
- **[kg-lexical-html-renderer](packages/kg-lexical-html-renderer)**: Converts serialized Lexical to HTML
- **[kg-html-to-lexical](packages/kg-html-to-lexical)**: Converts HTML to serialized Lexical
- **[kg-default-nodes](packages/kg-default-nodes)**: Lexical node definitions for content types
- **[kg-default-transforms](packages/kg-default-transforms)**: Content transformation utilities
- **[kg-converters](packages/kg-converters)**: Format conversion between Lexical/Mobiledoc

### Legacy Packages
- **[kg-mobiledoc-html-renderer](packages/kg-mobiledoc-html-renderer)**: Mobiledoc to HTML conversion
- **[html-to-mobiledoc](packages/html-to-mobiledoc)**: HTML to Mobiledoc conversion
- **[kg-default-cards](packages/kg-default-cards)**: Mobiledoc card definitions
- **[kg-parser-plugins](packages/kg-parser-plugins)**: Mobiledoc content parsing plugins
- **[kg-simplemde](packages/kg-simplemde)**: SimpleMDE markdown editor integration

### Utility Packages
- **[kg-utils](packages/kg-utils)**: Shared utilities
- **[kg-clean-basic-html](packages/kg-clean-basic-html)**: HTML sanitization
- **[kg-unsplash-selector](packages/kg-unsplash-selector)**: Unsplash image selection component

## Standalone Editor Development Workflow
Run `yarn dev` to develop the editor independently at <http://localhost:5173>

### Code Style
- Uses Tailwind CSS classes where possible
- All styles scoped under `.koenig-lexical` class
- SVGs imported as React components
- PostCSS nesting for style organization

### Testing
- **Unit tests**: Vitest framework in `test/unit/`
- **E2E tests**: Playwright in `test/e2e/`
- Demo app built before tests run
- Use `-t` flag to filter tests by keyword

## Package Dependencies

Packages have complex interdependencies. Key relationships:
- koenig-lexical depends on kg-default-nodes, kg-lexical-html-renderer, kg-html-to-lexical
- Transformation packages depend on kg-utils

## Special Configuration

### Environment Variables
- `VITE_TENOR_API_KEY`: Required for Gif card functionality
- `VITE_SENTRY_*`: Error tracking configuration

### External Dependencies
- Bookmark/Embed cards require CORS enabled for development
- Uses Lerna for monorepo management
- ESLint configuration via eslint-plugin-ghost
