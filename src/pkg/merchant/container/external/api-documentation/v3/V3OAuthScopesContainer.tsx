import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { StaggeredFadeIn } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant API */
import { getAllApiScopeStrings } from "@merchant/api/scope";

import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { ApiScopeWithDescription } from "@merchant/api/scope";

const V3OAuthScopesContainer = () => {
  const styles = useStylesheet();
  const { dimenStore } = useStore();

  const Scopes = getScopes();

  if (!Scopes) {
    return <LoadingIndicator className={css(styles.loading)} />;
  }

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`API Scopes`}
        body={
          i`When authorizing an app, the data they can have access to can ` +
          i`be specified. This page lists the access scopes that can be ` +
          i`granted.`
        }
        hideBorder
        paddingX={dimenStore.pageGuideX}
        className={css(styles.header)}
      />

      <StaggeredFadeIn className={css(styles.body)} animationDurationMs={800}>
        <Table data={Scopes}>
          <Table.MarkdownColumn title={i`Scopes`} columnKey="scopes" />

          <Table.MarkdownColumn
            title={i`Description`}
            columnKey="description"
          />
        </Table>
      </StaggeredFadeIn>
    </div>
  );
};

const useStylesheet = () => {
  const { dimenStore } = useStore();
  return StyleSheet.create({
    root: {
      display: "flex",
      alignItems: "stretch",
      flexDirection: "column",
    },
    header: {},
    body: {
      padding: `20px ${dimenStore.pageGuideX}`,
      display: "flex",
      flexDirection: "column",
    },
    table: {
      flex: 1,
    },
    loading: {
      margin: "300px 50%",
    },
  });
};

const getScopes = ():
  | ReadonlyArray<ApiScopeWithDescription>
  | null
  | undefined => {
  const request = getAllApiScopeStrings();
  const results = request.response?.data?.results;
  if (!results) {
    return null;
  }

  return JSON.parse(JSON.stringify(results));
};

export default observer(V3OAuthScopesContainer);
