/* eslint-disable no-console */
/* node --loader ts-node/esm $LEOPARD_HOME/clroot_conversion/lib/codemods/runMods.ts */

import * as fsPromises from "fs/promises";
import { exec } from "child_process";

export const deleteFile = async (path: string): Promise<void> => {
  try {
    await fsPromises.unlink(path);
  } catch (err) {
    console.log(err);
  }

  return;
};

// turns exec command into a Promise for async
const execPromise = (command: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise((resolve, _) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
};

// run leopardMods.ts for all 'ts' and 'tsx' files for 6 subdirectory levels
const executeSubdirCodemods = async (base: string) => {
  const extensionTs = "*.ts --parser=ts";
  const extensionTsx = "*.tsx --parser=tsx";
  let subDir = "**/";
  for (let i = 0; i < 6; i++) {
    await execPromise(base + subDir + extensionTs);
    await execPromise(base + subDir + extensionTsx);
    subDir = subDir + "**/";
  }
  return;
};

const runMods = async () => {
  const baseLeopard =
    "npx jscodeshift -t $LEOPARD_HOME/clroot_conversion/lib/codemods/leopardMods.ts $LEOPARD_HOME/src/pkg/";
  const baseRecursive =
    "npx jscodeshift -t $LEOPARD_HOME/clroot_conversion/lib/codemods/recursiveMods.ts $LEOPARD_HOME/src/pkg/";
  const filenames = `${process.env.LEOPARD_HOME}/clroot_conversion/lib/codemods/filenames.txt`;
  await fsPromises.open(filenames, "w");

  await executeSubdirCodemods(baseLeopard);

  let fileLength = (await fsPromises.readFile(filenames)).length;

  // executes while there are filenames in filename.txt
  while (fileLength > 0) {
    // insert partition in filenames.txt
    await fsPromises.appendFile(filenames, "---\n");

    await executeSubdirCodemods(baseRecursive);

    // delete all files before and including the ---\n
    const allFileContents = await fsPromises.readFile(filenames, "utf-8");
    const afterPartition = allFileContents.split("---\n").slice(1).join("");
    await fsPromises.writeFile(filenames, afterPartition);

    fileLength = (await fsPromises.readFile(filenames)).length;
  }

  return;
};

void runMods();
