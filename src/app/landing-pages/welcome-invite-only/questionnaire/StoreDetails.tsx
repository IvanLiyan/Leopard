import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text, FormSelect } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import MerchantLeadSubmissionState from "./MerchantLeadSubmissionState";
import { useTheme } from "@core/stores/ThemeStore";

/* Toolkit */
import {
  numYearsSellingOptions,
  yearlyRevenueOptions,
  numSkuOptions,
  productCategoryOptions,
  QuestionPrompts,
  skuMap,
  yearsSellingMap,
  revenueMap,
  YearKeys,
  RevenueKeys,
  SkuKeys,
} from "src/app/landing-pages/welcome-invite-only/toolkit/form-options";
import { MerchantLeadProductCategory } from "@schema";
import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps & {
  readonly submissionState: MerchantLeadSubmissionState;
};

const StoreDetails = (props: Props) => {
  const { className, style, submissionState } = props;
  const styles = useStylesheet();

  const [skuKey, setSkuKey] = useState<SkuKeys | null>();
  const [yearsKey, setYearsKey] = useState<YearKeys | null>();
  const [revenueKey, setRevenueKey] = useState<RevenueKeys | null>();

  return (
    <Layout.FlexColumn alignItems="stretch" style={[className, style]}>
      <Layout.FlexColumn
        alignItems="stretch"
        justifyContent="flex-start"
        style={styles.row}
      >
        <Text style={styles.question} weight="semibold">
          {QuestionPrompts.YEARS_SELLING}
        </Text>
        <FormSelect
          showArrow
          error={!submissionState.isHowLongSellingValid}
          placeholder={ci18n("Placeholder on a select box", "Select")}
          style={styles.select}
          options={numYearsSellingOptions}
          selectedValue={yearsKey}
          onSelected={(years: YearKeys) => {
            setYearsKey(years);
            submissionState.howLongSelling = yearsSellingMap[years];
            submissionState.isHowLongSellingValid = true;
          }}
        />
      </Layout.FlexColumn>

      <Layout.FlexColumn
        alignItems="stretch"
        justifyContent="flex-start"
        style={styles.row}
      >
        <Text style={styles.question} weight="semibold">
          {QuestionPrompts.REVENUE}
        </Text>
        <FormSelect
          showArrow
          error={!submissionState.isAnnualRevenueValid}
          style={styles.select}
          placeholder={ci18n("Placeholder on a select box", "Select")}
          options={yearlyRevenueOptions}
          selectedValue={revenueKey}
          onSelected={(rev: RevenueKeys) => {
            setRevenueKey(rev);
            submissionState.annualRevenue = revenueMap[rev];
            submissionState.isAnnualRevenueValid = true;
          }}
        />
      </Layout.FlexColumn>

      <Layout.FlexColumn
        alignItems="stretch"
        justifyContent="flex-start"
        style={styles.row}
      >
        <Text style={styles.question} weight="semibold">
          {QuestionPrompts.SKU}
        </Text>
        <FormSelect
          showArrow
          error={!submissionState.isSkuQuantityValid}
          style={styles.select}
          placeholder={ci18n("Placeholder on a select box", "Select")}
          options={numSkuOptions}
          selectedValue={skuKey}
          onSelected={(skuKey: SkuKeys) => {
            setSkuKey(skuKey);
            submissionState.skuQuantity = skuMap[skuKey];
            submissionState.isSkuQuantityValid = true;
          }}
        />
      </Layout.FlexColumn>

      <Layout.FlexColumn
        alignItems="stretch"
        justifyContent="flex-start"
        style={styles.row}
      >
        <Text style={styles.question} weight="semibold">
          {QuestionPrompts.CATEGORY}
        </Text>
        <FormSelect
          showArrow
          error={!submissionState.isProductCategoryValid}
          style={styles.select}
          placeholder={ci18n("Placeholder on a select box", "Select")}
          options={productCategoryOptions}
          selectedValue={submissionState.productCategory}
          onSelected={(category: MerchantLeadProductCategory) => {
            submissionState.productCategory = category;
            submissionState.isProductCategoryValid = true;
          }}
        />
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        row: {
          marginTop: 20,
        },
        question: {
          fontSize: 15,
          color: textDark,
        },
        select: {
          marginTop: 5,
        },
      }),
    [textDark],
  );
};

export default observer(StoreDetails);
