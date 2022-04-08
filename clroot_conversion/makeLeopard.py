#!/usr/bin/env python3
from __future__ import annotations

import argparse

from lib.setup import (
    clean_leopard,
    prep_leopard,
    refresh_clroot,
    copy_packages,
    update_npm_packages,
)
from lib.convert import build_next_structure
from lib.codemods import run_codemods


def main(
    skip_refresh,
    prep_dryrun,
    copy_dryrun,
    clean_only,
    codemods_only,
    schema_only,
    skip_npm_refresh,
    no_master_check,
) -> int:
    if clean_only:
        clean_leopard(dryrun=False)
        if schema_only:
            copy_packages(dryrun=False, schema_only=True)
        return 0

    if schema_only:
        copy_packages(dryrun=False, schema_only=True)
        return 0

    if codemods_only:
        run_codemods()
        return 0

    if not skip_refresh:
        refresh_clroot(no_master_check=no_master_check)

    prep_leopard(dryrun=prep_dryrun)
    if prep_dryrun:
        return 0

    copy_packages(dryrun=copy_dryrun)
    if copy_dryrun:
        return 0

    if not skip_npm_refresh:
        update_npm_packages()

    build_next_structure()

    run_codemods()

    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Builds the Leopard Next.JS codebase from clroot. Please view README.md for more information, including required setup steps."
    )
    parser.add_argument(
        "-r",
        "--skip-refresh",
        help="skip pulling the latest version of the clroot master branch",
        action="store_true",
    )
    parser.add_argument(
        "-p",
        "--prep-dryrun",
        help="run a dry-run for prep leopard and skip the rest of the script",
        action="store_true",
    )
    parser.add_argument(
        "-c",
        "--copy-dryrun",
        help="prep leopard, run a dry-run of the clroot copy, and skip the rest of the script",
        action="store_true",
    )
    parser.add_argument(
        "-d",
        "--clean-only",
        help="only delete directories that contain copied and generated code",
        action="store_true",
    )
    parser.add_argument(
        "-m", "--codemods-only", help="only run the js codemods", action="store_true"
    )
    parser.add_argument(
        "-s",
        "--schema-only",
        help="only copy in the schema. useful when creating a PR that needs to pass CI, since files in @stores reference @schema. (can be run alongside --clean-only)",
        action="store_true",
    )
    parser.add_argument(
        "-n",
        "--skip-npm-refresh",
        help="skip refreshing @ContextLogic npm packages. This process takes a bit of time and only needs to be run daily, so skipping it is useful when repeatedly running the script for development purposes",
        action="store_true",
    )
    parser.add_argument(
        "-g",
        "--no-master-check",
        help="skip the check that clroot is on the master branch",
        action="store_true",
    )
    args = parser.parse_args()
    raise SystemExit(main(**vars(args)))
