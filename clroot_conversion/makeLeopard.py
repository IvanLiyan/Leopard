#!/usr/bin/env python3
from __future__ import annotations

from lib.setup import clean_leopard, refresh_clroot, copy_packages
from lib.convert import buildNextStructure


def main() -> int:
    refresh_clroot()
    clean_leopard(dryrun=False)
    copy_packages(dryrun=False)
    # buildNextStructure()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
