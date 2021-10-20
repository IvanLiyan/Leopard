# run via: `python3 convert.py A /Users/lucasliepert/ContextLogic/clroot/sweeper/merchant_dashboard/handlers`

import ast
import json
import os
import re
import sys
import time
from string import Template

_parseHandlerPath_packageName = None
_parseHandlerPath_initialQuery = None


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


def findContainerNames(containerEntryPath):
    containerNames = []
    with open(containerEntryPath, "r") as f:
        for line in f.readlines():
            parsedLine = line.split(" ")
            if len(parsedLine) < 5:
                print(f"line [{line}] too short, skipping")
                continue

            containerName = parsedLine[4]
            containerNames.append(containerName)

    return containerNames


def findHandlerPath(containerName, handlersRoot):
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


def parseHandlerPath(containerName, handlerPath):
    class Visitor(ast.NodeVisitor):
        def generic_visit(self, node):
            ast.NodeVisitor.generic_visit(self, node)

        def visit_Call(self, node):
            isHandler = False
            # TODO [lliepert]: some handlers don't have package defined; parse from TS instead
            packageName = None
            packageNameError = False
            initialQuery = None
            initialQueryError = False
            for k in node.keywords:
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
                _parseHandlerPath_packageName = packageName
                _parseHandlerPath_initialQuery = initialQuery
            ast.NodeVisitor.generic_visit(self, node)

    with open(handlerPath, "r") as source:
        tree = ast.parse(source.read())

    visitor = Visitor()
    visitor.visit(tree)
    return _parseHandlerPath_packageName, _parseHandlerPath_initialQuery


def generateContainerFile(packageName, containerName, initialQuery):
    PAGES_PATH = "/Users/lucasliepert/ContextLogic/leopard/src/pages/demo"

    if initialQuery is None:
        with open("page-without-data.tsx.tmpl", "r") as file:
            tsxTemplate = Template(file.read())
    else:
        with open("page-with-data.tsx.tmpl", "r") as file:
            tsxTemplate = Template(file.read())

    renderedTsx = tsxTemplate.substitute(
        {
            "packageName": packageName,
            "containerName": containerName,
            "initialQuery": initialQuery,
        }
    )

    pathName = re.sub(r"(?<!^)(?=[A-Z])", "-", containerName).lower()
    with open(f"{PAGES_PATH}/{pathName}.tsx", "w") as file:
        file.write(renderedTsx)


def convert():
    handlersRoot = sys.argv[2]
    DATA = {}
    pagesGenerated = 0

    merchantContainerNames = findContainerNames(
        "/Users/lucasliepert/ContextLogic/leopard/src/pkg/merchant/container/index.ts"
    )
    plusContainerNames = findContainerNames(
        "/Users/lucasliepert/ContextLogic/leopard/src/pkg/plus/container/index.ts"
    )
    containerNames = merchantContainerNames + plusContainerNames

    for containerName in containerNames:
        try:
            handlerPath = findHandlerPath(
                containerName=containerName,
                handlersRoot=handlersRoot,
            )
            packageName, initialQuery = parseHandlerPath(
                containerName=containerName, handlerPath=handlerPath
            )
            generateContainerFile(
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
            print(f"{e.containerName}: {e.message}")
        except ParsingError as e:
            print(f"{e.containerName} ({e.handlerPath}): {e.message}")

    with open(f"log_{round(time.time())}.json", "w") as f:
        f.write(json.dumps(DATA))

    print(f"\nTOTAL PAGES GENERATED: {pagesGenerated}/{len(containerNames)}")


def removeParents(file):
    PKG_PATH = "/Users/lucasliepert/ContextLogic/leopard/src/pkg"

    removedFiles = []
    fileAsImport = file.replace(f"{PKG_PATH}/", "@").split(".")[0]

    print(f"FILE AS IMPORT {fileAsImport}")

    resp = os.popen(f'grep -rl "{fileAsImport}" {PKG_PATH}').readlines()
    for line in resp:
        newlyRemovedFiles = removeFileAndParents(line.strip("\n"))
        removedFiles = removedFiles + newlyRemovedFiles

    return removedFiles


def removeFileAndParents(file):
    if not os.path.exists(file):
        print(f"FILE {file} ALREADY REMOVED")
        return []

    print(f"REMOVING FILE {file}")
    os.remove(file)

    removedFiles = [file] + removeParents(file)

    return removedFiles


def removeLegacy():
    PKG_PATH = "/Users/lucasliepert/ContextLogic/leopard/src/pkg"
    removedFiles = []
    resp = os.popen(f'grep -rl "@legacy/view" {PKG_PATH}').readlines()
    for line in resp:
        newlyRemovedFiles = removeFileAndParents(line.strip("\n"))
        removedFiles = removedFiles + newlyRemovedFiles

    print(f"\nTOTAL FILES REMOVED: {len(removedFiles)}")
    print(
        f"\nTOTAL CONTAINERS REMOVED: {sum(map(lambda file: 'container' in file, removedFiles))}"
    )


def extras(withFile=True):
    file = sys.argv[2]
    removedFiles = removeFileAndParents(file) if withFile else removeParents(file)

    print(f"\nTOTAL FILES REMOVED: {len(removedFiles)}")
    print(
        f"\nTOTAL CONTAINERS REMOVED: {sum(map(lambda file: 'container' in file, removedFiles))}"
    )


if __name__ == "__main__":
    option = sys.argv[1]

    if option == "A":
        print("CONVERTING")
        convert()
    elif option == "B":
        print("REMOVING LEGACY")
        removeLegacy()
    elif option == "C":
        print("REMOVING EXTRA")
        extras()
    elif option == "D":
        print("REMOVING EXTRAS WITHOUT FILE")
        extras(withFile=False)
    else:
        print("ERROR: UNRECOGNIZED OPTION")
