# Koenig

Ghost editor, based on the Lexical framework.

## Get started

This is a mono repository, managed with [lerna](https://lerna.js.org/).

To get started in this repo:

1. `git clone` this repo & `cd` into it as usual
2. run `yarn setup` from the top-level:
   - installs all external dependencies
   - links all internal dependencies
   - runs an initial build of all projects

To add a new package to the repo:
   - install [Slimer](https://github.com/TryGhost/slimer)
   - run `slimer new <package name>`


## Development

`yarn dev` runs the `koenig-lexical` package in development mode, and builds its dependencies (`koenig-lexical-html-renderer` and `kg-default-nodes`). Please refer to the [README](packages/koenig-lexical/README.md) for more information.

## Test

- `yarn lint` run just eslint
- `yarn test` run lint and tests

## Deployment

### Pre-requisites

Create an `.env` file in `packages/koenig-lexical`, based on the existing `.env.local` file. This file contains environment variables for Sentry, so that we can track errors in the editor. There is also a copy of this file in 1password.


### Deploy a new version

1. run `yarn ship` in the top-level Koenig directory to publish to npm
2. bump the Koenig dependencies in Ghost
   - can be done manually (sometimes useful if only a single package has changed), but the preferred option…
   - wait for Renovate to create a bump PR ([example](https://github.com/TryGhost/Ghost/pull/21597)) and merge it

# Copyright & License

Copyright (c) 2013-2023 Ghost Foundation - Released under the [MIT license](LICENSE).
