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

    ./lib/src/commands

This is because the root `tsconfig.json` has it's `rootDir` set to `.`, in order
to ensure native IDE support out of the box.

Alternatively, you can create a symlink named `lib` to `src`:

    ln -s src lib

Meanwhile, `oclif` is hardcoded to look for a root level `tsconfig.json`, and
provides no way to point it at `tsconfig.build.json`.

In addition, it also hardcoded the `require`ing of `typescript`, providing no
way to have it use `ttypescript`, and so cannot use `ts-transformer-paths`.

As such, `tsconfig-paths` must be register for `paths` to be properly resolved:

     node -r tsconfig-paths/register bin/terra

For convenience this has been added as a `script` in `package.json`:

    npm run cli

## Layout

### Commands

Commands are named functions that the CLI can perform.

They handle parsing the user input, and performing actions based on that input.

Typically, the Terraform porting commands defer to the appropriate 'nado, and
then print the resulting AST to file.

### 'nados

'nados (from Tornado) are a form of orchestration that is easier to spell.
They're called 'nados because they "sweep up" whole slices of infrastructure.

They handle orchestrating the collecting of details, and having those details
built into Terraform AST that can then be printed & written to disk as a valid
Terraform file.

The actual logic of these steps is implemented in specific functions, detailed
below. 'nados return a collection of complete Terraform top-level blocks.

Since typically the infrastructure being ported into Terraform via Terra is
either top- or middle- level, most 'nados support a `greedy` argument that when
`true` has them look for related supporting infrastructure.

For example, the 'nado for AWS Route53 Hosted Zones will also sweep in the
records of that zone when `greedy` is `true`.

### Collectors

Collectors collect all the configuration details required to represent the
targeted infrastructure in Terraform.

They handle making the API calls required to get details, and mapping them to
the expected structure.

### Builders

Builders use the collected configuration details to build AST nodes that
represent how to structure the infrastructure in Terraform.

They handle shaping the infrastructure details where required by performing
actions such as:

- wrapping native strings in double quotes
- sanitising names so they're Terraform safe,
- normalising values so they're consistent

### Printers

Printers convert Terraform AST nodes into valid Terraform code as raw multiline
string literals.
