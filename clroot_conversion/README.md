# CLROOT -> Next.JS Conversion Code

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
