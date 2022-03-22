/* eslint-disable */
import { API, FileInfo } from "jscodeshift";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import { deleteFile } from "./runMods";

// recursiveMods checks if the current file contains any of the strings/imports in the filenames.txt
const recursiveMods = async (fileInfo: FileInfo, api: API) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  const curPath = fileInfo.path;
  const filenames = `${process.env.LEOPARD_HOME}/clroot_conversion/lib/codemods/filenames.txt`;

  // iterate through imports and check in filenames.txt
  const allFileContents = fs.readFileSync(filenames, "utf-8");
  root.find(j.ImportDeclaration).forEach(async (importDeclaration) => {
    let s = importDeclaration.value.source.value;

    if (typeof s == "string" && s.includes("./")) {
      s =
        curPath.substring(
          curPath.indexOf("pkg/") + "pkg/".length,
          curPath.lastIndexOf("/"),
        ) + s.substring(1);
    }

    if (typeof s == "string" && s !== "" && allFileContents.includes(s)) {
      const formattedImport =
        "@" +
        curPath.substring(
          curPath.indexOf("pkg/") + "pkg/".length,
          curPath.indexOf("."),
        );
      await deleteFile(curPath);
      await fsPromises.appendFile(filenames, formattedImport + "\n");
      return;
    }
  });

  return root.toSource();
};

export default recursiveMods;
