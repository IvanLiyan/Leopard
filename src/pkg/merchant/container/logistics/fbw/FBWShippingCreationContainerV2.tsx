/*
 * FBWShippingCreationContainerV2.tsx
 *
 * Created by Sola Ogunsakin on Wed Apr 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
/* eslint-disable filenames/match-regex */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";

import {
  H4,
  Card,
  Layout,
  Markdown,
  BackButton,
  PrimaryButton,
  StepsIndicator,
} from "@ContextLogic/lego";
import { useTheme } from "@stores/ThemeStore";
import SelectSKUs from "@merchant/component/logistics/shipping-plan/create/SelectSKUs";
import SubmitShippingPlan from "@merchant/component/logistics/shipping-plan/create/SubmitShippingPlan";
import EnterLogisticsInfo from "@merchant/component/logistics/shipping-plan/create/EnterLogisticsInfo";
import SelectWarehouseRegion from "@merchant/component/logistics/shipping-plan/create/SelectWarehouseRegion";

import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";

import {
  StepList,
  StepNames,
  InitialData,
} from "@toolkit/fbw/create-shipping-plan";
import CreateShippingPlanState from "@merchant/model/fbw/CreateShippingPlanState";

type Props = {
  readonly initialData: InitialData;
};

const FBWShippingCreationContainerV2: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const [state] = useState(new CreateShippingPlanState({ initialData }));

  const learnMoreLink = "/";
  const { currentStep } = state;
  const steps: ReadonlyArray<{
    readonly title: string;
  }> = useMemo(() => {
    return StepList.map((step) => ({ title: StepNames[step] }));
  }, []);

  const Body = () => {
    if (currentStep == "SELECT_REGION") {
      return <SelectWarehouseRegion state={state} />;
    }

    if (currentStep == "SPECIFY_SKU_AND_QUANTITY") {
      return <SelectSKUs state={state} />;
    }

    if (currentStep == "LOGISTICS_INFO") {
      return <EnterLogisticsInfo state={state} />;
    }

    if (currentStep == "SUBMIT") {
      return <SubmitShippingPlan state={state} />;
    }

    return null;
  };

  return (
    <PageRoot>
      <PageGuide relaxed>
        <Card style={styles.card}>
          <Layout.FlexColumn>
            <Layout.FlexColumn style={styles.contentContainer}>
              <H4>Create FBW Shipping Plan</H4>
              <Markdown
                style={styles.description}
                text={
                  i`Plan to easily manage the shipping of your ` +
                  i`inventory to the corresponding FBW warehouses. [Learn more](${learnMoreLink})`
                }
              />
              <StepsIndicator
                steps={steps}
                completedIndex={StepList.indexOf(currentStep)}
                className={css(styles.stepsIndicator)} // TODO [lliepert]: stepsIndicator not passing style correctly, fixed in new version, will bump separately
              />
              <Body />
            </Layout.FlexColumn>
            <Layout.FlexRow
              justifyContent="space-between"
              style={styles.bottomContainer}
            >
              <BackButton
                onClick={() => {
                  window.scrollTo(0, 0);
                  state.moveToPreviousStep();
                }}
                style={[styles.button, { opacity: state.canGoBack ? 1 : 0 }]}
                disabled={!state.canGoBack}
              >
                Previous
              </BackButton>

              <PrimaryButton
                popoverStyle={css(styles.button)} // TODO [lliepert]: popoverStyle is passed to className in lego, fixed in new version, will bump separately
                onClick={async () => {
                  window.scrollTo(0, 0);
                  await state.moveToNextStep();
                }}
                isLoading={state.isSubmitting}
                isDisabled={state.clearanceError != null}
                popoverContent={state.clearanceError}
              >
                {currentStep == "SUBMIT" ? i`Submit` : i`Next`}
              </PrimaryButton>
            </Layout.FlexRow>
          </Layout.FlexColumn>
        </Card>
      </PageGuide>
    </PageRoot>
  );
};

export default observer(FBWShippingCreationContainerV2);

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        description: {
          margin: "15px 0px 25px 0px",
        },
        card: {
          marginTop: 30,
        },
        contentContainer: {
          flex: 1,
          padding: 30,
          animationName: [
            {
              from: {
                transform: "translate(-5px)",
                opacity: 0.3,
              },

              to: {
                transform: "translate(0px)",
                opacity: 1,
              },
            },
          ],
          animationDuration: "400ms",
        },
        stepsIndicator: {
          marginBottom: 30,
        },
        bottomContainer: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "10px 25px",
        },
        button: {
          minWidth: 240,
        },
      }),
    [borderPrimary],
  );
};
