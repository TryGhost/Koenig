# Koenig

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

## Run

- `yarn dev`

## Test

- `yarn lint` run just eslint
- `yarn test` run lint and tests

## Publish

- `yarn ship` is an alias for `lerna publish`
    - Publishes all packages which have changed
    - Also updates any packages which depend on changed packages


# Copyright & License

Copyright (c) 2013-2023 Ghost Foundation - Released under the [MIT license](LICENSE).
