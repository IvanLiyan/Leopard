/*
 * CreateShippingLabel.tsx
 *
 * Created by Jonah Dlin on Thu Jan 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useLazyQuery, useMutation } from "react-apollo";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import ShipToCard from "./create-shipping-label-cards/ShipToCard";
import ShipFromCard from "./create-shipping-label-cards/ShipFromCard";
import OrderSummaryCard from "./create-shipping-label-cards/OrderSummaryCard";
import PackageCard from "./create-shipping-label-cards/PackageCard";
import ShippingCard from "./create-shipping-label-cards/ShippingCard";
import SummaryCard from "./create-shipping-label-cards/SummaryCard";
import TosBanner from "./create-shipping-label-cards/TosBanner";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useToastStore } from "@merchant/stores/ToastStore";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

/* Toolkit */
import { css } from "@toolkit/styling";
import {
  GET_TOS_ACCEPTED,
  GetTosAcceptedResponseType,
  AcceptTosResponseType,
  AcceptTosInputType,
  ACCEPT_TOS,
} from "@toolkit/wps/create-shipping-label";

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
};

const CreateShippingLabel: React.FC<Props> = ({
  state,
  className,
  style,
}: Props) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const { showSummary, showTos, onAcceptTos } = state;

  const [getTosAcceptance, { data }] = useLazyQuery<
    GetTosAcceptedResponseType,
    {}
  >(GET_TOS_ACCEPTED, {
    fetchPolicy: "no-cache",
  });

  const [acceptTos, { loading }] = useMutation<
    AcceptTosResponseType,
    AcceptTosInputType
  >(ACCEPT_TOS);

  useEffect(() => {
    if (data != null) {
      state.isWpsTosChecked =
        data.currentMerchant.merchantTermsAgreed?.wpsTermsOfService
          ?.agreedWpsTos || false;
    }
  }, [data, state]);

  const onFocus = useCallback(async () => {
    await getTosAcceptance();
  }, [getTosAcceptance]);

  useEffect(() => {
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, [onFocus]);

  const handleWpsClick = async () => {
    const response = await acceptTos({ variables: { tos: "WPS" } });
    const success =
      response.data?.currentMerchant?.merchantTermsAgreed
        ?.actOnWpsTermsOfService.ok || false;
    if (success) {
      toastStore.positive(`Successfully accepted WPS Terms`);
      state.isWpsTosChecked = true;
      getTosAcceptance();
    }
  };

  useEffect(() => {
    if (!showTos) {
      onAcceptTos();
    }
  }, [onAcceptTos, showTos]);

  return (
    <div className={css(styles.root, className, style)}>
      {showTos && (
        <TosBanner
          className={css(styles.tosBanner)}
          isWpsChecked={state.isWpsTosChecked}
          onCheckWps={handleWpsClick}
          disableCheckboxes={loading}
        />
      )}
      <div className={css(styles.column)}>
        <ShipFromCard className={css(styles.card)} state={state} />
        <PackageCard className={css(styles.card)} state={state} />
        <ShippingCard className={css(styles.card)} state={state} />
      </div>
      <div className={css(styles.column)}>
        {showSummary && (
          <SummaryCard className={css(styles.card)} state={state} />
        )}
        <ShipToCard className={css(styles.card)} state={state} />
        <OrderSummaryCard className={css(styles.card)} state={state} />
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          columnGap: "20px",
          backgroundColor: pageBackground,
        },
        tosBanner: {
          gridColumn: "1 / 3",
          marginBottom: 20,
        },
        column: {
          display: "flex",
          flexDirection: "column",
        },
        card: {
          ":not(:last-child)": {
            marginBottom: 20,
          },
        },
      }),
    [pageBackground]
  );
};

export default observer(CreateShippingLabel);
