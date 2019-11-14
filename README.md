# terra

Command-line tool for generating and importing assets into Terraform.

## Running locally from project

Currently oclif has a number of hard codings that force you to recompile the cli
every time you want to test it end-to-end locally.

While this isn't a big deal if you're doing final stage manual testing, it can
be very slow and painful if you're doing tweaking, and so want to run the cli
multiple times to test out small changes.

To have `oclif` use the `src` files via `ts-node`, you must change the value of
`.oclif.commands` in `package.json` to the following:

    `./lib/src/commands`

This is because the root `tsconfig.json` has it's `rootDir` set to `.`, in order
to ensure native IDE support out of the box.

Meanwhile, `oclif` is hardcoded to look for a root level `tsconfig.json`, and
provides no way to point it at `tsconfig.build.json`.

In addition, it also hardcoded the `require`ing of `typescript`, providing no
way to have it use `ttypescript`, and so cannot use `ts-transformer-paths`.

As such, `tsconfig-paths` must be register for `paths` to be properly resolved:

     node -r tsconfig-paths/register bin/terra

For convenience this has been added as a `script` in `package.json`:

    npm run cli

## Layout

### Collectors

Collectors collect all the configuration details required to represent the
targeted infrastructure in Terraform.

They handle making the API calls required to get details, and mapping them to
the expected structure.
