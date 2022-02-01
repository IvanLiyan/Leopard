/* eslint-disable */
/* npx jscodeshift -t leopardMods.ts testFile.input.ts --parser=tsx */
import {
  API,
  FileInfo,
  ImportDefaultSpecifier,
  Collection,
  JSCodeshift,
} from "jscodeshift";

const updateStore = (store: string, j: JSCodeshift, root: Collection) => {
  root
    .find(j.ImportDeclaration, {
      source: { value: `@merchant/stores/${store}` },
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
    updateStore(store, j, root);
  });

  return root.toSource();
};

export default leopardMods;
