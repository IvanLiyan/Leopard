import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CurrencyInput } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { CheckboxGrid } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import BonusBudgetForm from "@merchant/component/product-boost/BonusBudgetForm";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

/* Toolkit */
import ScheduledBudgetValidator from "@toolkit/product-boost/validators/ScheduledBudgetValidator";

/* Merchant Store */
import { useProductBoostMerchantInfo } from "@merchant/stores/product-boost/ProductBoostContextStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ScheduledBudgetFormProps = BaseProps & {
  campaign: Campaign;
  setValidity?: (arg0: boolean) => void;
};

const ScheduledBudgetForm = (props: ScheduledBudgetFormProps) => {
  const styles = useStyleSheet();
  const { campaign, setValidity } = props;

  const onAutoAddBudgetDaysChange = (value: number, checked: boolean) => {
    if (!campaign) {
      // Should never happen.
      return;
    }
    if (!campaign.scheduledAddBudgetDays) {
      campaign.scheduledAddBudgetDays = [];
    }
    if (checked) {
      campaign.scheduledAddBudgetDays.push(value);
      const amount = parseFloat(campaign.scheduledAddBudgetAmount || "");
      if (setValidity && amount) {
        setValidity(true);
      }
    } else {
      campaign.scheduledAddBudgetDays = campaign.scheduledAddBudgetDays.filter(
        (el) => el !== value
      );
      if (setValidity) {
        setValidity(!!campaign.scheduledAddBudgetDays.length);
      }
    }
  };

  const productBoostMerchantInfoResult = useProductBoostMerchantInfo();
  if (productBoostMerchantInfoResult == null) {
    return null;
  }

  const {
    marketing: {
      currentMerchant: { minBudgetToAdd, maxBudgetToAdd },
    },
  } = productBoostMerchantInfoResult;

  if (!campaign.scheduledAddBudgetDays) {
    campaign.scheduledAddBudgetDays = [];
  }
  const options = [
    { title: i`Monday`, value: 0 },
    { title: i`Tuesday`, value: 1 },
    { title: i`Wednesday`, value: 2 },
    { title: i`Thursday`, value: 3 },
    { title: i`Friday`, value: 4 },
    { title: i`Saturday`, value: 5 },
    { title: i`Sunday`, value: 6 },
  ];
  const scheduledAddBudgetDaysEmpty = !campaign.scheduledAddBudgetDays.length;

  const amount = parseFloat(campaign.scheduledAddBudgetAmount || "");

  return (
    <Card className={css(styles.scheduledAddBudget)}>
      <HorizontalField title={i`Schedule`} titleWidth={80}>
        <CheckboxGrid
          options={options}
          selected={campaign.scheduledAddBudgetDays}
          onCheckedChanged={onAutoAddBudgetDaysChange}
        />
        <CheckboxField
          className={css(styles.selectDays)}
          title={
            scheduledAddBudgetDaysEmpty
              ? i`Select all days`
              : i`Deselect all days`
          }
          checked={!scheduledAddBudgetDaysEmpty}
          onChange={(checked: boolean) => {
            if (scheduledAddBudgetDaysEmpty) {
              campaign.scheduledAddBudgetDays = [0, 1, 2, 3, 4, 5, 6];
              if (setValidity && amount) {
                setValidity(true);
              }
            } else {
              campaign.scheduledAddBudgetDays = [];
              if (setValidity) {
                setValidity(false);
              }
            }
          }}
        />
      </HorizontalField>
      {scheduledAddBudgetDaysEmpty && (
        <section className={css(styles.errorText)}>
          At least 1 day must be selected
        </section>
      )}
      <HorizontalField
        title={i`Amount`}
        popoverContent={
          campaign.isCampaignEligibleForBonusBudget()
            ? () => {
                return (
                  <BonusBudgetForm
                    merchantBudget={
                      campaign.scheduledAddBudgetAmount
                        ? campaign.scheduledAddBudgetAmount
                        : "0.00"
                    }
                    localizedCurrency={campaign.localizedCurrency}
                    bonusBudgetRate={campaign.getBonusBudgetRate()}
                    bonusBudgetType={campaign.getBonusBudgetPromotionType()}
                    showPromoMessage
                    style={{ maxWidth: 700 }}
                  />
                );
              }
            : undefined
        }
        popoverSentiment="success"
        className={css(styles.topMargin)}
        centerTitleVertically
        titleWidth={80}
      >
        <CurrencyInput
          currencyCode={campaign.localizedCurrency}
          value={campaign.scheduledAddBudgetAmount}
          onChange={({ text }: OnTextChangeEvent) => {
            campaign.scheduledAddBudgetAmount = text;
          }}
          className={css(styles.input)}
          validators={[
            new ScheduledBudgetValidator({
              currencyCode: campaign.localizedCurrency,
              minBudgetToAdd: Math.min(minBudgetToAdd.amount, amount),
              maxBudgetToAdd: maxBudgetToAdd.amount,
            }),
          ]}
          onValidityChanged={(
            isValid: boolean,
            errorMessage: string | null | undefined
          ) => {
            if (setValidity) {
              const days =
                campaign.scheduledAddBudgetDays &&
                campaign.scheduledAddBudgetDays.length > 0;
              setValidity(!!days && isValid);
            }
          }}
        />
      </HorizontalField>
    </Card>
  );
};

export default observer(ScheduledBudgetForm);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        scheduledAddBudget: {
          marginTop: 20,
          padding: 20,
          alignSelf: "center",
        },
        selectDays: {
          margin: "10px 10px",
        },
        topMargin: {
          marginTop: 20,
        },
        input: {
          "@media (max-width: 900px)": {
            width: "100%",
          },
          "@media (min-width: 900px)": {
            width: "60%",
          },
        },
        errorText: {
          fontSize: 12,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.33,
          color: palettes.reds.DarkRed,
          marginTop: 7,
          marginLeft: 130,
          animationName: [
            {
              from: {
                transform: "translateY(-5px)",
                opacity: 0,
              },
              to: {
                transform: "translate(-5px)",
                opacity: 1,
              },
            },
          ],
          animationDuration: "300ms",
          cursor: "default",
        },
      }),
    []
  );
};
