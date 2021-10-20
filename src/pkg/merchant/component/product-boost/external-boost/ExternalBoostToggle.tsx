/*
 * ExternalBoostToggle.tsx
 *
 * Created by Jonah Dlin on Fri Mar 12 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import {
  CurrencyInput,
  HorizontalField,
  Info,
  Layout,
  LoadingIndicator,
  OnTextChangeEvent,
  PrimaryButton,
  Switch,
  Text,
} from "@ContextLogic/lego";
import { useMutation, useQuery } from "react-apollo";
import {
  GetExternalBoostDailyBudgetResponseType,
  GET_EXTERNAL_BOOST_DAILY_BUDGET,
  SetExternalBoostDailyBudgetInputType,
  SetExternalBoostDailyBudgetResponseType,
  SetExternalBoostToggleResponseType,
  SetExternalBoostToggleInputType,
  SET_EXTERNAL_BOOST_DAILY_BUDGET,
  SET_EXTERNAL_BOOST_TOGGLE,
  ExternalBoostInitialData,
} from "@toolkit/product-boost/external-boost/external-boost";
import { PaymentCurrencyCode } from "@schema/types";
import { useToastStore } from "@stores/ToastStore";
import { useTheme } from "@stores/ThemeStore";
import { CurrencyValidator, MinMaxValueValidator } from "@toolkit/validators";
import { useNavigationStore } from "@stores/NavigationStore";
import { zendeskURL } from "@toolkit/url";

type Props = BaseProps & {
  readonly initialData: ExternalBoostInitialData;
};

const ExternalBoostToggle: React.FC<Props> = ({
  className,
  style,
  initialData: {
    marketing: {
      currentMerchant: {
        offsiteBoost: { maxDailyBudget, minDailyBudget, chargingMethod },
      },
    },
  },
}: Props) => {
  const styles = useStylesheet();

  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();

  const allowBudget = chargingMethod != "CPA";

  const [budgetToAdd, setBudgetToAdd] = useState<number>();
  const [isValidBudget, setIsValidBudget] = useState(true);
  const [budgetError, setBudgetError] = useState<string | null | undefined>("");

  const [isRefetching, setIsRefetching] = useState(false);

  const {
    data,
    loading: isLoadingQuery,
    refetch,
  } = useQuery<GetExternalBoostDailyBudgetResponseType, {}>(
    GET_EXTERNAL_BOOST_DAILY_BUDGET,
  );

  const [setExternalBoostToggle, { loading: isLoadingEnabledMutation }] =
    useMutation<
      SetExternalBoostToggleResponseType,
      SetExternalBoostToggleInputType
    >(SET_EXTERNAL_BOOST_TOGGLE);

  const [
    setExternalBoostDailyBudget,
    { loading: isLoadingDailyBudgetMutation },
  ] = useMutation<
    SetExternalBoostDailyBudgetResponseType,
    SetExternalBoostDailyBudgetInputType
  >(SET_EXTERNAL_BOOST_DAILY_BUDGET);

  useEffect(() => {
    if (data != null) {
      setBudgetToAdd(
        data.marketing.currentMerchant.offsiteBoost.dailyBudget.amount,
      );
    }
  }, [data]);

  const isLoading =
    isLoadingQuery ||
    isLoadingEnabledMutation ||
    isLoadingDailyBudgetMutation ||
    isRefetching;

  const handleToggleEnabled = async (to: boolean) => {
    const result = await setExternalBoostToggle({
      variables: { input: { enabled: to } },
    });

    if (result.data != null && result.data.marketing.updateOffsiteBoost.ok) {
      setIsRefetching(true);
      await refetch();
      setIsRefetching(false);
      const msg = to
        ? i`ExternalBoost daily budget enabled`
        : i`ExternalBoost daily budget disabled`;
      toastStore.positive(msg);
      return;
    }

    const serverMsg =
      result.data != null && result.data.marketing.updateOffsiteBoost.message;

    toastStore.negative(serverMsg || i`Something went wrong`);
  };

  const handleSubmitDailyBudget = async () => {
    if (data == null || !isValidBudget || budgetToAdd == null) {
      return;
    }

    if (!isValidBudget) {
      setBudgetToAdd(
        data.marketing.currentMerchant.offsiteBoost.dailyBudget.amount,
      );
      return;
    }

    const currencyCode = data.marketing.currentMerchant.offsiteBoost.dailyBudget
      .currencyCode as PaymentCurrencyCode;

    const result = await setExternalBoostDailyBudget({
      variables: {
        input: {
          dailyBudget: { amount: budgetToAdd, currencyCode },
        },
      },
    });

    if (result.data != null && result.data.marketing.updateOffsiteBoost.ok) {
      navigationStore.releaseNavigationLock();
      setIsRefetching(true);
      const result = await refetch();
      setIsRefetching(false);
      toastStore.positive(i`ExternalBoost daily budget updated`);
      setBudgetToAdd(
        result.data.marketing.currentMerchant.offsiteBoost.dailyBudget.amount,
      );
      return;
    }

    const serverMsg =
      result.data != null && result.data.marketing.updateOffsiteBoost.message;

    toastStore.negative(serverMsg || i`Something went wrong`);
  };

  const isToggleOn = data
    ? data.marketing.currentMerchant.offsiteBoost.enabled
    : false;

  const validators = useMemo(
    () => [
      new MinMaxValueValidator({
        minAllowedValue: isToggleOn ? minDailyBudget.amount : undefined,
        maxAllowedValue: isToggleOn ? maxDailyBudget.amount : undefined,
        allowBlank: isToggleOn ? false : undefined,
        customMessage: i`Please enter an amount between ${minDailyBudget.display} and ${maxDailyBudget.display}`,
      }),
      new CurrencyValidator(),
    ],
    [minDailyBudget, maxDailyBudget, isToggleOn],
  );

  if (data == null) {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    return null;
  }

  const currencyCode =
    data.marketing.currentMerchant.offsiteBoost.dailyBudget.currencyCode;

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <Text className={css(styles.description)}>
        {allowBudget
          ? i`Simply set a budget for your ExternalBoost ads and enable spend to ` +
            i`get started.`
          : i`Simply enable spend to get started with ExternalBoost ads. Wish will ` +
            i`only charge an amount to your account when customers place an order ` +
            i`after clicking on the ads.`}
      </Text>
      <Layout.FlexRow alignItems="flex-start" justifyContent="flex-start">
        <Layout.FlexColumn className={css(styles.section)}>
          <HorizontalField
            title={i`Enable spend`}
            titleAlign="start"
            popoverSentiment="info"
            popoverContent={
              allowBudget
                ? undefined
                : i`By enabling ExternalBoost, Wish will automatically select some ` +
                  i`or all of your products to boost across external platforms. Your ` +
                  i`account will only be charged a fee (25% of the order’s Total Cost) ` +
                  i`when an order is placed after the customer clicks on the ad. ` +
                  i`[Learn more](${zendeskURL("1260803771770")})`
            }
          />
          <Layout.FlexRow
            className={css(styles.sectionContent)}
            alignItems="center"
          >
            <Switch
              className={css(styles.switch)}
              disabled={isLoading}
              isOn={isToggleOn}
              onToggle={async () => {
                await handleToggleEnabled(!isToggleOn);
              }}
            />
          </Layout.FlexRow>
        </Layout.FlexColumn>
        {allowBudget && (
          <Layout.FlexColumn className={css(styles.section)}>
            <Layout.FlexRow className={css(styles.sectionHeaderRow)}>
              <Text className={css(styles.sectionHeader)} weight="semibold">
                Budget
              </Text>
              <Info
                className={css(styles.budgetInfo)}
                text={
                  i`Set a budget of ${minDailyBudget.display} to ${maxDailyBudget.display}. ` +
                  i`Wish will automatically select some or all of your products ` +
                  i`and leverage the budget that you set to boost these products ` +
                  i`across external platforms.`
                }
              />
            </Layout.FlexRow>
            <Layout.FlexRow>
              <CurrencyInput
                className={css(styles.currencyInput)}
                inputContainerStyle={{ boxShadow: "none", maxWidth: 96 }}
                currencyCode={currencyCode}
                value={budgetToAdd}
                onChange={({ textAsNumber }: OnTextChangeEvent) => {
                  navigationStore.placeNavigationLock(
                    i`You have unsaved changed. Are you sure want to leave?`,
                  );
                  setBudgetToAdd(textAsNumber || 0);
                }}
                validators={validators}
                onValidityChanged={(isValid, errorMessage) => {
                  setIsValidBudget(isValid);
                  setBudgetError(errorMessage);
                }}
                disabled={isLoading}
                showErrorMessages={false}
                forceValidation
              />
              <PrimaryButton
                className={css(styles.budgetSubmit)}
                onClick={handleSubmitDailyBudget}
                isDisabled={!isValidBudget || isLoading}
                isLoading={isLoadingDailyBudgetMutation}
              >
                Save
              </PrimaryButton>
            </Layout.FlexRow>
            {!isValidBudget && budgetError != null && (
              <Text className={css(styles.errorText)} weight="semibold">
                {budgetError}
              </Text>
            )}
          </Layout.FlexColumn>
        )}
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default observer(ExternalBoostToggle);

const useStylesheet = () => {
  const { textDark, negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        description: {
          marginBottom: 24,
          fontSize: 14,
          lineHeight: "20px",
        },
        section: {
          ":not(:last-child)": {
            marginRight: 40,
          },
        },
        sectionHeaderRow: {
          marginBottom: 4,
        },
        sectionHeader: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        sectionContent: {
          height: 40,
        },
        switch: {
          flex: 1,
        },
        currencyInput: {
          maxWidth: 360,
        },
        budgetSubmit: {
          marginLeft: 8,
          height: 40,
          boxSizing: "border-box",
        },
        budgetInfo: {
          marginLeft: 8,
        },
        errorText: {
          fontSize: 12,
          lineHeight: 1.33,
          color: negative,
          marginTop: 7,
          cursor: "default",
        },
      }),
    [textDark, negative],
  );
};
