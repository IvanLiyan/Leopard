# CLROOT -> Next.JS Conversion Process

<details>
<summary>V1</summary>
This directory contains the code required to convert clroot's React pages to Next.JS pages.

## Usage

0. Confirm you're running the correct version of Go.

   ```
    $ python3 --version
    Python 3.9.5
   ```

## Changes to pkg files

- Removed i` in single file for testing purposes
- Confirm no changes to pkg/legacy/core (was re-written)
- NavigationStore, toolkit/api, localization pipeline
- remove module from countries.ts
- rewrote stores
- created toolkit/navigation.ts
- rewrote toolkit/url.ts
- renamed wishURL to useWishURL
- legacy/core/url -> toolkit/url
- name-default-component codemod

## Conversion Steps

1. copy over pkg/assets, pkg/merchant, pkg/plus, pkg/schema, pkg/toolkit
2. run initial conversion

```
$ python3 convert.py A /Users/lucasliepert/ContextLogic/clroot/sweeper/merchant_dashboard/handlers
```

3. remove all files that require from `@legacy/view` recursively

```
$ python3 convert.py B
```

4. remove problematic files and their parents as they pop up

```
$ python3 convert.py C <path_to_problematic_file>
```

## TODO

- Handle case where no initial data query is provided but initialProps still requested (currently deleting)
  https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#traversing-the-ast-with-a-little-linter
- Fix illustrations file (currently @ts-nocheck'ing it)
- Convert gqltag, apollo/react-hooks, and react-apollo to apollo/client

## Main Debugging Pages:

- `http://localhost:8080/demo/all-products-container`
- `http://localhost:8080/demo/order-history-container`
</details>

---

## Setup

1. Clone clroot to `~/ContextLogic/clroot`.
2. Clone Leopard to `~/ContextLogic/leopard`.
3. **🔥🔥🔥 IMPORTANT 🔥🔥🔥** Confirm that you have no uncommitted changed in clroot.

   The script runs git commands in the clroot directory, so if this is not done you may lose work!

4. Confirm `$CL_HOME` and `$LEOPARD_HOME` are setup properly. They should look something like this:

   ```
   ~/ContextLogic/leopard on  update_readme! ⌚ 15:33:30
   $ echo $CL_HOME
   /Users/lucasliepert/ContextLogic/clroot

   ~/ContextLogic/leopard on  update_readme! ⌚ 15:34:15
   $ echo $LEOPARD_HOME
   /Users/lucasliepert/ContextLogic/leopard

   ~/ContextLogic/leopard on  update_readme! ⌚ 15:34:17
   $
   ```

## Usage

First run `./makeLeopard.py` from this directory. The script ends and logs out an npx command to run; this command is what performs the actual codemods. Copy it and run it.

```
$ ./makeLeopard.py
WARNING:root:changing directory to /Users/lucasliepert/ContextLogic/clroot
...


please run
npx jscodeshift -t /Users/lucasliepert/ContextLogic/leopard/clroot_conversion/lib/codemods/leopardMods.ts --parser=ts /Users/lucasliepert/ContextLogic/leopard/src/pkg/**/*.ts && npx jscodeshift -t /Users/lucasliepert/ContextLogic/leopard/clroot_conversion/lib/codemods/leopardMods.ts --parser=tsx /Users/lucasliepert/ContextLogic/leopard/src/pkg/**/*.tsx



~/ContextLogic/leopard/clroot_conversion on  update_readme! ⌚ 15:36:50
$ npx jscodeshift -t /Users/lucasliepert/ContextLogic/leopard/clroot_conversion/lib/codemods/leopardMods.ts --parser=ts /Users/lucasliepert/ContextLogic/leopard/src/pkg/**/*.ts && npx jscodeshift -t /Users/lucasliepert/ContextLogic/leopard/clroot_conversion/lib/codemods/leopardMods.ts --parser=tsx /Users/lucasliepert/ContextLogic/leopard/src/pkg/**/*.tsx
Processing 265 files...
...
All done.
Results:
0 errors
705 unmodified
0 skipped
781 ok
Time elapsed: 18.517seconds

~/ContextLogic/leopard/clroot_conversion on  update_readme! ⌚ 15:38:50
$
```

You can then run commands like `yarn dev`, `yarn tsc`, etc. from the Leopard home directory.

You can also run `./makeLeopard.py -h` to view the script's options and documentation.

### Helpful Shortcuts

`./makeLeopard -ds`: cleans out the imported files and copies in only the `@schema` package. This is useful when making a PR while there are still linting errors in the converted co d d
