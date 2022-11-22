import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text, FormSelect, RadioGroup } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import MerchantLeadSubmissionState from "./MerchantLeadSubmissionState";
import { useTheme } from "@core/stores/ThemeStore";
import { BrandRegistrationCountry, MerchantType } from "@schema";

type Props = BaseProps & {
  readonly submissionState: MerchantLeadSubmissionState;
};

const CNOnlyDetails: React.FC<Props> = (props) => {
  const { className, style, submissionState } = props;

  const styles = useStylesheet();

  const merchantTypeOptions: ReadonlyArray<{
    value: MerchantType;
    text: string;
  }> = [
    { value: `Brand`, text: "品牌卖家（自有品牌或代理）" },
    { value: `Factory`, text: "源头工厂" },
    { value: `Trading_Company`, text: "贸易公司" },
    { value: `Others`, text: "其他" },
  ];

  const registerLocationOptions: ReadonlyArray<{
    value: BrandRegistrationCountry;
    text: string;
  }> = [
    { value: `US`, text: "美国" },
    { value: `EU`, text: "欧洲" },
    { value: `Japan`, text: "日本" },
    { value: `Others`, text: "其他" },
  ];

  return (
    <Layout.FlexColumn alignItems="stretch" style={[className, style]}>
      <Layout.FlexColumn
        alignItems="stretch"
        justifyContent="flex-start"
        style={styles.row}
      >
        <Text style={styles.question} weight="semibold">
          您是什么类型的卖家？
        </Text>
        <FormSelect
          showArrow
          error={!submissionState.isMerchantTypeCNOnlyValid}
          placeholder="选择"
          style={styles.select}
          options={merchantTypeOptions}
          selectedValue={submissionState.merchantTypeCNOnly}
          onSelected={(merchantType: MerchantType | undefined) => {
            submissionState.merchantTypeCNOnly = merchantType;
            if (merchantType) {
              submissionState.isMerchantTypeCNOnlyValid = true;
            } else {
              submissionState.isMerchantTypeCNOnlyValid = false;
            }
          }}
        />
      </Layout.FlexColumn>

      {submissionState.merchantTypeCNOnly === `Brand` && (
        <>
          <Layout.FlexColumn
            alignItems="stretch"
            justifyContent="flex-start"
            style={styles.row}
          >
            <Text style={styles.question} weight="semibold">
              您在哪些国家和地区注册了商标？
            </Text>
            <FormSelect
              showArrow
              error={!submissionState.isBrandRegistrationCountryCNOnlyValid}
              placeholder="选择"
              style={styles.select}
              options={registerLocationOptions}
              selectedValue={submissionState.brandRegistrationCountryCNOnly}
              onSelected={(
                brandRegistrationCountry: BrandRegistrationCountry | undefined,
              ) => {
                submissionState.brandRegistrationCountryCNOnly =
                  brandRegistrationCountry;
                if (brandRegistrationCountry) {
                  submissionState.isBrandRegistrationCountryCNOnlyValid = true;
                } else {
                  submissionState.isBrandRegistrationCountryCNOnlyValid = false;
                }
              }}
            />
          </Layout.FlexColumn>
          <Layout.FlexRow
            justifyContent="space-between"
            alignItems="flex-start"
            style={styles.row}
          >
            <Text weight="semibold" style={styles.question}>
              您是否已经成功注册过Wish店铺
            </Text>
            <RadioGroup
              onSelected={(registeredBefore: boolean) => {
                submissionState.registeredBeforeCNOnly = registeredBefore;
              }}
              selectedValue={submissionState.registeredBeforeCNOnly}
              style={styles.radioGroup}
            >
              <RadioGroup.Item value text="是" />
              <RadioGroup.Item value={false} text="否" />
            </RadioGroup>
          </Layout.FlexRow>
        </>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(CNOnlyDetails);

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
        radioGroup: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: 120,
        },
      }),
    [textDark],
  );
};
