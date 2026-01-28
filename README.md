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

`yarn dev` runs the `koenig-lexical` package in development mode. Please refer to its [README](packages/koenig-lexical/README.md) for more information.

## Test

- `yarn lint` run just eslint
- `yarn test` run lint and tests

## Deployment

Ghost core team only.

### Deploy a new version

1. run `yarn ship` in the top-level Koenig directory — this runs tests, prompts for version bumps, and pushes the version commit to `main`
2. CI automatically publishes the updated packages to npm via the `publish.yml` workflow
3. bump the Koenig dependencies in Ghost. Either:
   - wait for Renovate to create a bump PR ([example](https://github.com/TryGhost/Ghost/pull/21606)) and merge it (recommended option)
   - or, do it manually, by adding the new Koenig package versions to the `package.json` files in `Ghost/core` and `Ghost/admin`

# Copyright & License

Copyright (c) 2013-2026 Ghost Foundation - Released under the [MIT license](LICENSE).
