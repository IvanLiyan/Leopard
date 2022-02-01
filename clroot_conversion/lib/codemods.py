#!/usr/bin/env python3
from __future__ import annotations

import logging
import os
import subprocess

from lib.paths import CLROOT_PKG_DIR, LEOPARD_DIR, LEOPARD_PKG_DIR
from lib.utils import removeIfExists


def run_codemod(codemod: str) -> None:
    logging.warning("changing directory to {dir}".format(dir=LEOPARD_PKG_DIR))
    os.chdir(LEOPARD_PKG_DIR)
    logging.warning("now in {dir}".format(dir=os.getcwd()))

    subprocess.check_call(
        [
            "npx",
            "jscodeshift",
            "-t",
            f"{LEOPARD_DIR}/clroot_conversion/lib/codemods/{codemod}.ts",
            "./**/*.ts",
            "--parser=tsx",
        ]
    )


def run_codemods() -> None:
    # remove infra for loadables
    removeIfExists(f"{LEOPARD_PKG_DIR}/toolkit/loadable")

    # remove deprecated stores
    for store in [
        "ApolloStore",
        "DeviceStore",
        "EnvironmentStore",
        "LocalizationStore",
        "NavigationStore",
        "PersistenceStore",
        "ThemeStore",
        "ToastStore",
        "UserStore",
    ]:
        path = f"{LEOPARD_PKG_DIR}/merchant/stores/{store}.ts"
        removeIfExists(path, fn=os.remove)

    # currently running codemods from python is not finding any files, will
    # investigate and debug later
    print(
        f"\n\nplease run\nnpx jscodeshift -t {LEOPARD_DIR}/clroot_conversion/lib/codemods/leopardMods.ts --parser=ts {LEOPARD_PKG_DIR}/**/*.ts && npx jscodeshift -t {LEOPARD_DIR}/clroot_conversion/lib/codemods/leopardMods.ts --parser=tsx {LEOPARD_PKG_DIR}/**/*.tsx\n\n"
    )
