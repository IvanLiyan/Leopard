import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import { Redirect } from "react-router-dom";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold } from "@toolkit/fonts";
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import ApiMethodRequestForm from "@merchant/component/external/api-explorer-v3/ApiMethodRequestForm";

/* Merchant Model */
import ApiMethodPageState from "@merchant/model/external/v3-api-explorer/ApiMethodPageState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ApiExplorerStore from "@merchant/stores/v3-api-explorer/ApiExplorerStore";

export type ApiMethodPageProps = BaseProps & {
  readonly store: ApiExplorerStore;
  readonly isStoreOrMerchantUser: boolean | undefined;
};

const ApiMethodPage = (props: ApiMethodPageProps) => {
  const {
    className,
    store: { operationIdToApiMethods, isOperationValid, baseUrl },
    isStoreOrMerchantUser,
  } = props;
  const styles = useStylesheet();
  const { operationId } = usePathParams(`${baseUrl}/:operationId`);
  if (operationId && !isOperationValid(operationId)) {
    return <Redirect to={`${baseUrl}/404`} />;
  }
  const rootStyle = css(className);
  const methodData = operationIdToApiMethods[operationId] || {};
  const { pathName } = methodData;

  return (
    <div className={css(rootStyle)}>
      <div className={css(styles.header)}>
        {operationId && <div className={css(styles.apiPath)}>{pathName}</div>}
      </div>

      <ApiMethodRequestForm
        className={css(styles.content)}
        pageState={new ApiMethodPageState(methodData)}
        isStoreOrMerchantUser={isStoreOrMerchantUser}
      />
    </div>
  );
};
export default observer(ApiMethodPage);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: "28px 60px",
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
        },
        header: {
          backgroundColor: palettes.greyScaleColors.Grey,
          height: 50,
          fontSize: 28,
          fontWeight: weightBold,
          padding: "25px 60px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        apiPath: {
          fontSize: 20,
        },
      }),
    [],
  );
