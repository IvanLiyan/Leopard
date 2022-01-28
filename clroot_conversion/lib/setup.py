#!/usr/bin/env python3
from __future__ import annotations

import logging
import os
import shutil
import subprocess

from lib.paths import CLROOT_DIR, CLROOT_PKG_DIR, LEOPARD_PKG_DIR

PACKAGES = ["assets", "merchant", "toolkit", "schema"]


class GitException(Exception):
    pass


def refresh_clroot() -> None:
    """
    Confirms clroot is on the master branch and pulls the latest version.
    """
    prev_cwd = os.getcwd()

    try:
        logging.warning("changing directory to {dir}".format(dir=CLROOT_DIR))
        os.chdir(CLROOT_DIR)
        logging.warning("now in {dir}".format(dir=os.getcwd()))

        logging.warning("checking git is on master branch")
        try:
            output = subprocess.check_output(["git", "branch", "--show-current"])
            if not output == b"master\n":
                raise GitException(
                    "clroot git is not on master branch. please visit clroot directory, stash or commit any changes, and change to the master branch."
                )
        except subprocess.CalledProcessError as e:
            raise GitException("git checkout master failed with error {e}".format(e=e))
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
    """
    logging.warning("beginning clean (dryrun = {dryrun})".format(dryrun=dryrun))
    for pkg in PACKAGES:
        dir = "{dir}/{pkg}".format(dir=LEOPARD_PKG_DIR, pkg=pkg)
        if not os.path.exists(dir):
            logging.warning("skipping {dir}, does not exist".format(dir=dir))
            continue

        logging.warning("removing {dir}".format(dir=dir))
        if not dryrun:
            shutil.rmtree(dir)


def copy2WithLogging(src, dst) -> None:
    """
    runs copy2, but first logs out what is being copied
    """
    logging.warning("copying {src} to {dst}".format(src=src, dst=dst))
    shutil.copy2(src, dst)


def copy_packages(dryrun=True) -> None:
    """
    Copies the required packages from clroot into leopard.
    Currently we are copying in @assets, @merchant, @toolkit, and @schema.
    """
    logging.warning("beginning copy (dryrun = {dryrun})".format(dryrun=dryrun))
    for pkg in PACKAGES:
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
            else copy2WithLogging(src, dst),
        )
