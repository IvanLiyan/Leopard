#!/usr/bin/env python3
from __future__ import annotations
from typing import Callable

import logging
import os
import shutil


def removeIfExists(
    path: str, fn: Callable[[str], None] = shutil.rmtree, dryrun=False
) -> None:

    if not os.path.exists(path):
        logging.warning(f"skipping {path}, does not exist")
    else:
        logging.warning(f"removing {path}")
        if not dryrun:
            fn(path)
