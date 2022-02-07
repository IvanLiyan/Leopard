#!/usr/bin/env python3
from __future__ import annotations

import os

CLROOT_DIR = os.getenv("CL_HOME")
CLROOT_PKG_DIR = "{dir}/sweeper/merchant_dashboard/static/js/pkg".format(dir=CLROOT_DIR)
CLROOT_HANDLERS_DIR = "{dir}/sweeper/merchant_dashboard/handlers".format(dir=CLROOT_DIR)
LEOPARD_DIR = os.getenv("LEOPARD_HOME")
LEOPARD_PKG_DIR = "{dir}/src/pkg".format(dir=LEOPARD_DIR)
LEOPARD_PAGES_DIR = "{dir}/src/pages/demo".format(dir=LEOPARD_DIR)
