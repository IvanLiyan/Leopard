/* eslint-disable */
/* npx jscodeshift -t leopardMods.ts testFile.input.ts --parser=tsx */
import {
  API,
  FileInfo,
  ImportDefaultSpecifier,
  Collection,
  JSCodeshift,
} from "jscodeshift";

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

const leopardMods = (fileInfo: FileInfo, api: API) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

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

  /**
   * <img alt="png image" src={illustrations.paypal} />
   * to
   * <Image alt="png image" src={illustrations.paypal} />
   */

  const imageTags = root.findJSXElements("img");

  imageTags.replaceWith(({ node }) => {
    node.openingElement.name = {
      type: "JSXIdentifier",
      name: "Image",
    };

    return node;
  });

  // import Image component
  if (imageTags.length != 0) {
    const imageImportStatement = root.find(j.ImportDeclaration, {
      source: { value: `next/image` },
    });
    if (imageImportStatement.length == 0) {
      // insert import after other imports
      const imports = root.find(j.ImportDeclaration);
      j(imports.at(imports.length - 1).get()).insertAfter(
        `import Image from "next/image";`,
      );
    }
  }

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
