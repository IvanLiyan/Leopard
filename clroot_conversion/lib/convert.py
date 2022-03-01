#!/usr/bin/env python3
from __future__ import annotations

import logging
import ast
import json
import os
import re
import time
from string import Template

from lib.paths import CLROOT_HANDLERS_DIR, LEOPARD_PAGES_DIR, LEOPARD_PKG_DIR

_parseHandlerPath_packageName = None
_parseHandlerPath_initialQuery = None
_parseHandlerPath_handlerName = None


class HandlerPathError(Exception):
    def __init__(self, containerName, message):
        self.containerName = containerName
        self.message = message
        super().__init__(self.message)


class ParsingError(Exception):
    def __init__(self, containerName, handlerPath, message):
        self.containerName = containerName
        self.handlerPath = handlerPath
        self.message = message
        super().__init__(self.message)


def find_container_names(containerEntryPath):
    """
    Given the path to a index.ts file containing a list of containers,
    this function generates an array containing all the contained container
    names.
    """
    containerNames = []
    with open(containerEntryPath, "r") as f:
        for line in f.readlines():
            parsedLine = line.split(" ")
            if len(parsedLine) < 5:
                logging.warning(f"line [{line}] too short, skipping")
                continue

            containerName = parsedLine[4]
            containerNames.append(containerName)

    return containerNames


def find_handler_path(containerName, handlersRoot):
    """
    Given a container name and the path to the root of the clroot handlers
    directory, this function finds the path of the file contianing the handler
    for the given container.

    It throws an error if a unique path cannot be determined.
    """
    resp = os.popen(f"grep -rl '\"{containerName}\"' {handlersRoot}").readlines()
    resp = [line.strip("\n") for line in resp]
    if len(resp) > 1:
        raise HandlerPathError(
            containerName=containerName, message="MORE THAN ONE FILE IDENTIFIED"
        )
    if len(resp) < 1:
        raise HandlerPathError(
            containerName=containerName, message="NO FILES IDENTIFIED"
        )

    return resp[0]


def parse_handler_path(
    containerName: str, handlerPath: str
) -> annotations.Tuple[str, str, str]:
    """
    Given a container name and the path to that containers handler file, this
    function parses the python file and returns the container's package name and
    initial GQL query.
    """

    class Visitor(ast.NodeVisitor):
        def generic_visit(self, node):
            ast.NodeVisitor.generic_visit(self, node)

        def visit_Assign(self, node):
            if isinstance(node.value, ast.Call):
                isHandler = False
                # TODO [lliepert]: some handlers don't have package defined; parse from TS instead
                handlerName = None
                packageName = None
                packageNameError = False
                initialQuery = None
                initialQueryError = False
                for k in node.value.keywords:
                    if k.arg == "container" and k.value.value == containerName:
                        isHandler = True

                    elif k.arg == "package":
                        if isinstance(k.value, ast.Constant):
                            packageName = k.value.value
                        else:
                            packageNameError = True

                    if k.arg == "initial_query":
                        if isinstance(k.value, ast.Constant):
                            initialQuery = k.value.value
                        else:
                            initialQueryError = True

                if isHandler:
                    if len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
                        handlerName = node.targets[0].id
                    else:
                        raise ParsingError(
                            containerName=containerName,
                            handlerPath=handlerPath,
                            message="HANDLER NAME IMPROPERLY FORMATTED",
                        )

                    if packageNameError:
                        raise ParsingError(
                            containerName=containerName,
                            handlerPath=handlerPath,
                            message="PACKAGE NAME IMPROPERLY FORMATTED",
                        )
                    if initialQueryError:
                        raise ParsingError(
                            containerName=containerName,
                            handlerPath=handlerPath,
                            message="INITIAL QUERY IMPROPERLY FORMATTED",
                        )

                    global _parseHandlerPath_packageName
                    global _parseHandlerPath_initialQuery
                    global _parseHandlerPath_handlerName
                    _parseHandlerPath_packageName = packageName
                    _parseHandlerPath_initialQuery = initialQuery
                    _parseHandlerPath_handlerName = handlerName
            ast.NodeVisitor.generic_visit(self, node)

    with open(handlerPath, "r") as source:
        try:
            tree = ast.parse(source.read())
        except Exception as e:
            # TODO [lliepert]: this will skip files with handlers written in
            # python 2 syntax that doesn't parse in python 3
            raise ParsingError(
                containerName=containerName, handlerPath=handlerPath, message=e
            )

    visitor = Visitor()
    visitor.visit(tree)
    return (
        _parseHandlerPath_packageName,
        _parseHandlerPath_initialQuery,
        _parseHandlerPath_handlerName,
    )


def generate_container_file(packageName, containerName, initialQuery):
    """
    given a package name, container name, and initial query, this function
    generates the appropriate next.js page file, (from page-with-data.tsx.tmpl
    and page-with-data.tsx.tmpl located in the same lib directory as this
    file) and saves it to the leopard pages directory, using a sanitized
    version of the container name as the path

    TODO: we'll need to track the original URL when parsing the handlers file
    and use that here once we're ready for production, but at this time this
    method allows us to easily re-generate the page code while testing
    """
    logging.warning(
        "generating code for {containerName}".format(containerName=containerName)
    )
    fileDir = os.path.dirname(os.path.abspath(__file__))

    if initialQuery is None:
        with open("{dir}/page-without-data.tsx.tmpl".format(dir=fileDir), "r") as file:
            tsxTemplate = Template(file.read())
    else:
        with open("{dir}/page-with-data.tsx.tmpl".format(dir=fileDir), "r") as file:
            tsxTemplate = Template(file.read())

    renderedTsx = tsxTemplate.substitute(
        {
            "packageName": packageName,
            "containerName": containerName,
            "initialQuery": initialQuery,
        }
    )

    pathName = re.sub(r"(?<!^)(?=[A-Z])", "-", containerName).lower()
    with open(f"{LEOPARD_PAGES_DIR}/{pathName}.tsx", "w") as file:
        file.write(renderedTsx)


def build_next_structure():
    """
    Builds the next.js pages structure from the previous clroot structure.
    We search for containers from imported clroot code in Leopard, but go to
    the clroot directory when parsing Python code.

    (This allows us to selectively remove containers from Leopard that we
    don't want to build pages for.)
    """
    DATA = {}
    pagesGenerated = 0

    containerNames = find_container_names(
        "{dir}/merchant/container/index.ts".format(dir=LEOPARD_PKG_DIR)
    )

    for containerName in containerNames:
        try:
            handlerPath = find_handler_path(
                containerName=containerName,
                handlersRoot=CLROOT_HANDLERS_DIR,
            )
            packageName, initialQuery, handlerName = parse_handler_path(
                containerName=containerName, handlerPath=handlerPath
            )
            generate_container_file(
                packageName=packageName,
                containerName=containerName,
                initialQuery=initialQuery,
            )
            DATA[containerName] = {
                "handlerPath": handlerPath,
                "packageName": packageName,
                "initialQuery": initialQuery,
            }
            pagesGenerated += 1
        except HandlerPathError as e:
            logging.warning(f"{e.containerName}: {e.message}")
        except ParsingError as e:
            logging.warning(f"{e.containerName} ({e.handlerPath}): {e.message}")

    log_filename = "{dir}/logs/log_{uid}.json".format(
        dir=os.path.dirname(os.path.abspath(__file__)), uid=round(time.time())
    )
    with open(log_filename, "w") as f:
        f.write(json.dumps(DATA))

    logging.warning(f"\nTOTAL PAGES GENERATED: {pagesGenerated}/{len(containerNames)}")
