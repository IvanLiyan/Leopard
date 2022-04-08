#!/usr/bin/env python3
from __future__ import annotations

import logging
import os
import shutil
import subprocess

from lib.paths import (
    CLROOT_DIR,
    CLROOT_PKG_DIR,
    LEOPARD_DIR,
    LEOPARD_PAGES_DIR,
    LEOPARD_PKG_DIR,
)
from lib.utils import removeIfExists

PACKAGES = ["assets", "merchant", "toolkit", "schema"]


class GitException(Exception):
    pass


class NPMException(Exception):
    pass


def refresh_clroot(no_master_check) -> None:
    """
    Confirms clroot is on the master branch and pulls the latest version.
    """
    prev_cwd = os.getcwd()

    try:
        logging.warning("changing directory to {dir}".format(dir=CLROOT_DIR))
        os.chdir(CLROOT_DIR)
        logging.warning("now in {dir}".format(dir=os.getcwd()))

        if not no_master_check:
            logging.warning("checking git is on master branch")
            try:
                output = subprocess.check_output(["git", "branch", "--show-current"])
                if not output == b"master\n":
                    raise GitException(
                        "clroot git is not on master branch. please visit clroot directory, stash or commit any changes, and change to the master branch."
                    )
            except subprocess.CalledProcessError as e:
                raise GitException(
                    "git checkout master failed with error {e}".format(e=e)
                )

        try:
            subprocess.check_call(["git", "pull"])
        except subprocess.CalledProcessError as e:
            raise GitException("git pull failed with error {e}".format(e=e))
    finally:
        os.chdir(prev_cwd)


def clean_leopard(dryrun=True) -> None:
    """
    Deletes existing packages from leopard in preperation for a clean copy.
    Currently we are copying in @assets, @merchant, @toolkit, and @schema.

    Also deletes the pages/demo directory to prepare for re-generating the
    next.js pages.
    """
    logging.warning("beginning clean (dryrun = {dryrun})".format(dryrun=dryrun))
    for dir in [
        "{dir}/{pkg}".format(dir=LEOPARD_PKG_DIR, pkg=pkg) for pkg in PACKAGES
    ] + [LEOPARD_PAGES_DIR]:
        removeIfExists(dir, dryrun=dryrun)


def prep_leopard(dryrun=True) -> None:
    """
    Deletes existing packages from leopard in preperation for a clean copy.
    Currently we are copying in @assets, @merchant, @toolkit, and @schema.

    Also deletes the pages/demo directory to prepare for re-generating the
    next.js pages and re-makes a blank /demo folder.
    """
    clean_leopard(dryrun=dryrun)

    logging.warning("creating {dir}".format(dir=LEOPARD_PAGES_DIR))
    if not dryrun:
        os.mkdir(LEOPARD_PAGES_DIR)


def copy2_with_logging(src, dst) -> None:
    """
    runs copy2, but first logs out what is being copied
    """
    logging.warning("copying {src} to {dst}".format(src=src, dst=dst))
    shutil.copy2(src, dst)


def copy_packages(dryrun=True, schema_only=False) -> None:
    """
    Copies the required packages from clroot into leopard.
    Currently we are copying in @assets, @merchant, @toolkit, and @schema.
    """
    logging.warning("beginning copy (dryrun = {dryrun})".format(dryrun=dryrun))
    for pkg in ["schema"] if schema_only else PACKAGES:
        clroot_dir = "{dir}/{pkg}".format(dir=CLROOT_PKG_DIR, pkg=pkg)
        leopard_dir = "{dir}/{pkg}".format(dir=LEOPARD_PKG_DIR, pkg=pkg)
        logging.warning(
            "copying {clroot_dir} to {leopard_dir}".format(
                clroot_dir=clroot_dir, leopard_dir=leopard_dir
            )
        )
        shutil.copytree(
            clroot_dir,
            leopard_dir,
            copy_function=lambda src, dst: print(
                "copying {src} to {dst}".format(src=src, dst=dst)
            )
            if dryrun
            else copy2_with_logging(src, dst),
        )


def update_npm_packages() -> None:
    """
    Runs the yarn commands required to update regularly updated @ContextLogic
    packages.
    """
    prev_cwd = os.getcwd()

    try:
        logging.warning("changing directory to {dir}".format(dir=LEOPARD_DIR))
        os.chdir(LEOPARD_DIR)
        logging.warning("now in {dir}".format(dir=os.getcwd()))

        for pkg in [
            "@ContextLogic/lego",
            "@ContextLogic/zeus",
            "@ContextLogic/merchantstrings",
        ]:
            logging.warning(f"updating {pkg}")
            try:
                subprocess.check_call(["yarn", "add", f"{pkg}@latest", "--exact"])
            except subprocess.CalledProcessError as e:
                raise NPMException(f"npm add {pkg}@latest failed with error {e}")
    finally:
        os.chdir(prev_cwd)
