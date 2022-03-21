/* npx jscodeshift -t leopardMods.ts testFile.input.ts --parser=tsx */
import {
  API,
  FileInfo,
  ImportDefaultSpecifier,
  Collection,
  JSCodeshift,
} from "jscodeshift";

import * as fsPromises from "fs/promises";
import { deleteFile } from "./runMods";

/*
  import EnvironmentStore, { useEnvironmentStore } from "@merchant/stores/EnvironmentStore";
  to
  import EnvironmentStore, { useEnvironmentStore } from "@stores/EnvironmentStore";
  */
const updateModuleStore = (store: string, j: JSCodeshift, root: Collection) => {
  root
    .find(j.ImportDeclaration, {
      source: { value: `@merchant/stores/${store}` },
    })
    .replaceWith(({ node }) => {
      node.source.value = `@stores/${store}`;
      return node;
    });
};

/*
  import EnvironmentStore, { useEnvironmentStore } from "./EnvironmentStore";
  to
  import EnvironmentStore, { useEnvironmentStore } from "@stores/EnvironmentStore";
  */
const updateRelativeStore = (
  store: string,
  j: JSCodeshift,
  root: Collection,
  path: string,
) => {
  if (
    !(
      path.includes(`${process.env.LEOPARD_HOME}/src/pkg/stores`) ||
      path.includes(`${process.env.LEOPARD_HOME}/src/pkg/merchant/stores`)
    )
  )
    return;

  root
    .find(j.ImportDeclaration, {
      source: { value: `./${store}` },
    })
    .replaceWith(({ node }) => {
      node.source.value = `@stores/${store}`;
      return node;
    });
};

/*
  delete files that use bucketForUser function
  */

const deleteBucketForUserCalls = async (
  j: JSCodeshift,
  root: Collection,
  curPath: string,
) => {
  const bucketForUserCalls = root.find(j.Identifier, {
    name: "bucketForUser",
  });

  if (bucketForUserCalls.length != 0) {
    await deleteFile(curPath);
  }

  return;
};

/*
  finds all files related to file that imports @toolkit/api
  adds these filenames to filenames.txt
  deletes this file if imports @toolkit/api
*/
const findToolkitAPIFiles = async (
  j: JSCodeshift,
  root: Collection,
  curPath: string,
) => {
  const toolkitApiImports = root.find(j.ImportDeclaration, {
    source: { value: "@toolkit/api" },
  });

  if (toolkitApiImports.size() != 0) {
    const formattedImport =
      "@" +
      curPath.substring(
        curPath.indexOf("pkg/") + "pkg/".length,
        curPath.indexOf("."),
      );

    await deleteFile(curPath);

    await fsPromises.appendFile(
      `${process.env.LEOPARD_HOME}/clroot_conversion/lib/codemods/filenames.txt`,
      formattedImport + "\n",
    );
  }

  return;
};

const leopardMods = (fileInfo: FileInfo, api: API): string => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  const imports = root.find(j.ImportDeclaration);

  void findToolkitAPIFiles(j, root, fileInfo.path);
  void deleteBucketForUserCalls(j, root, fileInfo.path);

  /*
    import { useQuery, useMutation } from "@apollo/react-hooks";
    to
    import { useQuery, useMutation } from "@apollo/client";
   */
  const apolloReactHooksExpressions = root.find(j.ImportDeclaration, {
    source: { value: "@apollo/react-hooks" },
  });

  apolloReactHooksExpressions.replaceWith(({ node }) => {
    node.source.value = "@apollo/client";
    return node;
  });

  /*
    import { useQuery, useMutation } from "@react-apollo";
    to
    import { useQuery, useMutation } from "@apollo/client";
   */
  const reactApolloExpressions = root.find(j.ImportDeclaration, {
    source: { value: "react-apollo" },
  });

  reactApolloExpressions.replaceWith(({ node }) => {
    node.source.value = "@apollo/client";
    return node;
  });

  /*
    import SomeName from "apollo-client";
    to
    import { ApolloClient as SomeName } from "@apollo/client";
   */
  const apolloClientExpressions = root.find(j.ImportDeclaration, {
    source: { value: "apollo-client" },
  });

  apolloClientExpressions.replaceWith(({ node }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const importedAs = (node.specifiers![0] as ImportDefaultSpecifier).local!
      .name;
    node.specifiers = [
      {
        type: "ImportSpecifier",
        imported: {
          type: "Identifier",
          name: "ApolloClient",
        },
        local:
          importedAs == "ApolloClient"
            ? undefined
            : {
                type: "Identifier",
                name: importedAs,
              },
      },
    ];
    node.source.value = "@apollo/client";
    return node;
  });

  /*
    <img alt="png image" src={illustrations.paypal} />
    to
    <Image alt="png image" src={illustrations.paypal} />
   */

  const imageTags = root.findJSXElements("img");

  imageTags.replaceWith(({ node }) => {
    node.openingElement.name = {
      type: "JSXIdentifier",
      name: "NextImage",
    };

    return node;
  });

  // import Image component
  if (imageTags.length != 0) {
    const imageImportStatement = root.find(j.ImportDeclaration, {
      source: { value: "next/image" },
    });
    if (imageImportStatement.length == 0) {
      // insert import after other imports
      j(imports.at(imports.length - 1).get()).insertAfter(
        `import NextImage from "next/image";`,
      );
    }
  }

  /*
    replaces import statement of Link from Lego with new import statement
    for the new Next Link in @next-toolkit/Link
   */
  imports.forEach((importDeclaration) => {
    const importSpecifiers = importDeclaration.node.specifiers;
    if (
      importSpecifiers == undefined ||
      importSpecifiers.length == undefined ||
      importSpecifiers.length == 0
    )
      return;

    // checks each of the specifiers in the import declaration
    // if there is only one import specifier (i.e. import { Link }), remove entire import
    // otherwise, (i.e. import { Link, Text }) just remove the specifier
    if (importSpecifiers.length == 1) {
      if (importSpecifiers[0].local?.name == "Link") {
        j(importDeclaration).remove();
        j(imports.at(imports.length - 1).get()).insertAfter(
          `import Link from "@next-toolkit/Link";`,
        );
        return;
      }
    } else {
      const multipleSpecifiers = root.find(j.ImportSpecifier);
      multipleSpecifiers.forEach((specifier) => {
        if (specifier.node.local?.name == "Link") {
          j(specifier).remove();
          j(imports.at(imports.length - 1).get()).insertAfter(
            `import Link from "@next-toolkit/Link";`,
          );
          return;
        }
      });
    }
  });

  // fix stores
  [
    "ApolloStore",
    "DeviceStore",
    "EnvironmentStore",
    "LocalizationStore",
    "NavigationStore",
    "PersistenceStore",
    "ThemeStore",
    "ToastStore",
    "UserStore",
  ].forEach((store) => {
    updateModuleStore(store, j, root);
    updateRelativeStore(store, j, root, fileInfo.path);
  });

  return root.toSource();
};

export default leopardMods;
