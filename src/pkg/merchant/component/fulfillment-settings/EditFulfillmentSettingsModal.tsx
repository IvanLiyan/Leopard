import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

import {
  Text,
  Field,
  Button,
  Markdown,
  FormSelect,
  NumericInput,
  PrimaryButton,
  DayPickerInput,
  HorizontalField,
  SimpleSelectOption,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";
import { useToastStore } from "@stores/ToastStore";
import { useNavigationStore } from "@stores/NavigationStore";
import { useApolloStore } from "@stores/ApolloStore";
import {
  InitialData,
  FulfillmentSetting,
  FulfillmentSettingNames,
  fulfillmentSettingDescription,
  FulfillmentSettingWarning,
  getCurrentFulfillmentSetting,
  getAvailableFulfillmentSettings,
  getCurrentVacationModeEndDate,
} from "@toolkit/fulfillment-settings";
import {
  ChangeVacationModeInput,
  ChangeVacationModeMutation,
  SetMerchantFulfillmentExtension,
  MerchantMutationChangeVacationModeArgs,
  FulfillmentMutationSetMerchantFulfillmentExtensionArgs,
} from "@schema/types";
import DefaultSettingTip from "@merchant/component/fulfillment-settings/DefaultSettingTip";
import ProductImpressionMeter from "@merchant/component/fulfillment-settings/ProductImpressionMeter";

const SET_FULFILLMENT_EXTENSION = gql`
  mutation EditFulfillmentSettingsModal_SetFulfillmentExtension(
    $input: SetMerchantFulfillmentExtensionInput!
  ) {
    fulfillment {
      setMerchantFulfillmentExtension(input: $input) {
        ok
        errorMessage
      }
    }
  }
`;

type SetFulfillmentExtensionResponseType = {
  readonly fulfillment: {
    readonly setMerchantFulfillmentExtension: Pick<
      SetMerchantFulfillmentExtension,
      "ok" | "errorMessage"
    >;
  };
};

const CHANGE_VACATION_MODE = gql`
  mutation EditFulfillmentSettingsModal_ChangeVacationMode(
    $input: ChangeVacationModeInput!
  ) {
    currentMerchant {
      changeVacationMode(input: $input) {
        onVacationMode
        error
      }
    }
  }
`;

type ChangeVacationModeResponse = {
  readonly currentMerchant: {
    readonly changeVacationMode: Pick<
      ChangeVacationModeMutation,
      "error" | "onVacationMode"
    >;
  };
};

export type EditFulfillmentSettingsModalProps = {
  readonly initialData: InitialData;
  readonly onClose: () => unknown;
};

const EditFulfillmentSettingsModalContent: React.FC<EditFulfillmentSettingsModalProps> =
  observer(({ initialData, onClose }: EditFulfillmentSettingsModalProps) => {
    const {
      platformConstants: {
        fulfillment: {
          cnyFulfillmentExtension: { minExtensionDays, maxExtensionDays },
        },
      },
    } = initialData;
    const { currentMerchant } = initialData;
    const currentSetting = getCurrentFulfillmentSetting(currentMerchant);
    const currentVacationModeEndDate =
      getCurrentVacationModeEndDate(currentMerchant);
    const [selectedSetting, setSelectedSetting] = useState<
      FulfillmentSetting | undefined
    >(currentSetting);
    const [extensionDays, setExtensionDays] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [vacationModeStartDate, setVacationModeStartDate] = useState<
      Date | undefined
    >();
    const [vacationModeEndDate, setVacationModeEndDate] = useState<
      Date | undefined
    >(currentVacationModeEndDate);
    const availableSettings = getAvailableFulfillmentSettings(currentMerchant);

    const styles = useStylesheet();
    const toastStore = useToastStore();
    const navigationStore = useNavigationStore();
    const settingOptions: ReadonlyArray<
      SimpleSelectOption<FulfillmentSetting>
    > = useMemo(() => {
      return availableSettings.map((setting) => {
        const text = FulfillmentSettingNames[setting];
        return {
          value: setting,
          text: setting == "STANDARD" ? text : `${text}*`,
        };
      });
    }, [availableSettings]);

    const { client } = useApolloStore();
    const [setFulfillmentExtension] = useMutation<
      SetFulfillmentExtensionResponseType,
      FulfillmentMutationSetMerchantFulfillmentExtensionArgs
    >(SET_FULFILLMENT_EXTENSION, { client });

    const [changeVacationMode] = useMutation<
      ChangeVacationModeResponse,
      MerchantMutationChangeVacationModeArgs
    >(CHANGE_VACATION_MODE);

    const canSubmit = useMemo((): boolean => {
      if (selectedSetting == "CNY_EXTENSION") {
        return (
          extensionDays != null &&
          minExtensionDays <= extensionDays &&
          extensionDays <= maxExtensionDays
        );
      }

      return true;
    }, [selectedSetting, extensionDays, minExtensionDays, maxExtensionDays]);

    const runSetFulfillmentExtension = async (
      variables: FulfillmentMutationSetMerchantFulfillmentExtensionArgs
    ): Promise<boolean> => {
      const { data } = await setFulfillmentExtension({
        variables,
      });
      const ok = data?.fulfillment.setMerchantFulfillmentExtension.ok;
      if (!ok) {
        const error =
          data?.fulfillment.setMerchantFulfillmentExtension.errorMessage;
        toastStore.negative(error || i`Something went wrong`);
        return false;
      }

      return true;
    };

    const runChangeVacationMode = async (
      variables: MerchantMutationChangeVacationModeArgs
    ) => {
      const { data } = await changeVacationMode({
        variables,
      });
      const error = data?.currentMerchant.changeVacationMode.error;
      if (error != null) {
        toastStore.negative(error || i`Something went wrong`);
        return;
      }

      return true;
    };

    const onSubmit = async () => {
      if (selectedSetting == null) {
        toastStore.error(i`Please select a vacation setting`);
        return;
      }

      if (selectedSetting == "CNY_EXTENSION") {
        if (
          extensionDays < minExtensionDays ||
          extensionDays > maxExtensionDays
        ) {
          toastStore.error(
            i`The number of extension days selected must be between ${minExtensionDays} and ${maxExtensionDays}`
          );
          return;
        }

        setIsSubmitting(true);
        const extensionUpdateSuccess = await runSetFulfillmentExtension({
          input: { extensionDays },
        });
        if (!extensionUpdateSuccess) {
          setIsSubmitting(false);
          return;
        }
      } else {
        let vacationModeDestinationState: ChangeVacationModeInput["destState"];
        let vacationStartDate: ChangeVacationModeInput["vacationStartDate"];
        let vacationEndDate: ChangeVacationModeInput["vacationEndDate"];

        if (
          ["VACATION_MODE", "PRIMARY_WAREHOUSE_ON_VACATION"].includes(
            selectedSetting
          )
        ) {
          if (vacationModeEndDate == null) {
            toastStore.error(
              i`Please select a date to reactivate your warehouse(s)`
            );
            return;
          }

          if (
            vacationModeStartDate != null &&
            vacationModeStartDate >= vacationModeEndDate
          ) {
            toastStore.error(i`Start date must be before the end date`);
            return;
          }

          if (vacationModeStartDate != null) {
            vacationStartDate = {
              unix: vacationModeStartDate.getTime() / 1000,
            };
          }

          vacationEndDate = {
            unix: vacationModeEndDate.getTime() / 1000,
          };
        }

        if (selectedSetting == "PRIMARY_WAREHOUSE_ON_VACATION") {
          vacationModeDestinationState = "WISH_EXPRESS_ONLY";
        } else if (selectedSetting == "VACATION_MODE") {
          vacationModeDestinationState = "VACATION";
        } else {
          vacationModeDestinationState = "APPROVED";
        }

        setIsSubmitting(true);
        const vacationModeSuccess = await runChangeVacationMode({
          input: {
            destState: vacationModeDestinationState,
            vacationStartDate,
            vacationEndDate,
          },
        });
        if (!vacationModeSuccess) {
          setIsSubmitting(false);
          return;
        }
      }

      toastStore.positive(i`Your vacation settings have been saved.`);
      onClose();
      navigationStore.reload();
    };

    const canSelectDates =
      selectedSetting != null &&
      ["VACATION_MODE", "PRIMARY_WAREHOUSE_ON_VACATION"].includes(
        selectedSetting
      ) &&
      (availableSettings.includes("VACATION_MODE") ||
        availableSettings.includes("PRIMARY_WAREHOUSE_ON_VACATION"));

    const canSetExtensionDays =
      selectedSetting == "CNY_EXTENSION" &&
      availableSettings.includes("CNY_EXTENSION");

    return (
      <div className={css(styles.root)}>
        <div className={css(styles.content)}>
          <div className={css(styles.contentUpper)}>
            {["VACATION_MODE", "PRIMARY_WAREHOUSE_ON_VACATION"].includes(
              currentSetting
            ) && <DefaultSettingTip className={css(styles.tip)} />}
            <Field title={i`Setting type`} className={css(styles.field)}>
              <FormSelect
                options={settingOptions}
                onSelected={(value: FulfillmentSetting | undefined) =>
                  setSelectedSetting(value)
                }
                selectedValue={selectedSetting}
              />
            </Field>
            {canSetExtensionDays && (
              <Field
                title={i`Number of extension days`}
                className={css(styles.field, styles.extensionDaysInput)}
              >
                <NumericInput
                  value={extensionDays || 1}
                  onChange={({ valueAsNumber }) =>
                    setExtensionDays(
                      Math.min(
                        maxExtensionDays,
                        Math.max(minExtensionDays, valueAsNumber || 0)
                      )
                    )
                  }
                  incrementStep={1}
                  disabled={isSubmitting}
                />
              </Field>
            )}
            {canSelectDates && (
              <>
                <div className={css(styles.field, styles.sideBySide)}>
                  <Field title={i`Start date (optional)`}>
                    <DayPickerInput
                      value={vacationModeStartDate}
                      onDayChange={(data) => setVacationModeStartDate(data)}
                      dayPickerProps={{
                        showOutsideDays: true,
                        cannotSelectPast: true,
                      }}
                      style={{ marginRight: 15 }}
                      disabled={isSubmitting}
                    />
                  </Field>
                  <Field title={i`End date`}>
                    <DayPickerInput
                      value={vacationModeEndDate}
                      onDayChange={(date) => setVacationModeEndDate(date)}
                      dayPickerProps={{
                        showOutsideDays: true,
                      }}
                      disabled={isSubmitting}
                    />
                  </Field>
                </div>
              </>
            )}

            {selectedSetting != null && selectedSetting != "STANDARD" && (
              <Markdown
                style={styles.field}
                text={`*${
                  fulfillmentSettingDescription(initialData)[selectedSetting]
                }`}
                openLinksInNewTab
              />
            )}

            {selectedSetting != null &&
              FulfillmentSettingWarning[selectedSetting] !== null && (
                <Markdown
                  style={styles.field}
                  text={`**${FulfillmentSettingWarning[selectedSetting]}**`}
                  openLinksInNewTab
                />
              )}
          </div>
          <div className={css(styles.contentBottom)}>
            <Text>
              The product impression meter shows how your vacation setting
              affects your product impressions.
            </Text>
            {selectedSetting != null && (
              <HorizontalField
                titleAlign="start"
                centerTitleVertically
                titleWidth={200}
                style={styles.settingField}
                title={() => (
                  <Text style={styles.settingTitleStyle} weight="semibold">
                    Product impression meter
                  </Text>
                )}
              >
                <ProductImpressionMeter
                  currentSetting={selectedSetting}
                  height={7}
                />
              </HorizontalField>
            )}
          </div>
        </div>
        <div className={css(styles.footer)}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <PrimaryButton onClick={onSubmit} isDisabled={!canSubmit}>
            Save
          </PrimaryButton>
        </div>
      </div>
    );
  });

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          "@media (max-width: 900px)": {
            alignItems: "stretch",
          },
        },
        content: {
          display: "flex",
          flexDirection: "column",
          padding: "20px 20px",
          alignItems: "stretch",
        },
        contentUpper: {
          display: "flex",
          flexDirection: "column",
          padding: "0px 20px 30px 20px",
          alignItems: "stretch",
        },
        contentBottom: {
          display: "flex",
          padding: "30px 20px",
          flexDirection: "column",
          borderTop: `1px solid ${borderPrimary}`,
        },
        extensionDaysInput: {
          maxWidth: "min(50%, 300px)",
        },
        settingTitleStyle: {
          fontSize: 15,
          color: textBlack,
        },
        settingField: {
          margin: "15px 0px",
        },
        field: {
          margin: "10px 0",
        },
        survey: {
          marginTop: 10,
        },
        surveyFreeformOption: {
          flex: 1,
        },
        sideBySide: {
          display: "flex",
          alignSelf: "stretch",
          margin: "10px 0px",
          "@media (max-width: 900px)": {
            alignItems: "stretch",
            flexDirection: "column",
            ":nth-child(1n) > div": {
              marginBottom: 20,
            },
          },
          "@media (min-width: 900px)": {
            alignItems: "stretch",
            flexDirection: "row",
            flexWrap: "wrap",
            ":nth-child(1n) > div": {
              flexGrow: 1,
              flexBasis: 0,
              flexShrink: 1,
            },
          },
        },
        footer: {
          display: "flex",
          alignSelf: "stretch",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          borderTop: `1px solid ${borderPrimary}`,
          padding: "20px 20px",
        },
        footerButton: {
          height: 80,
          width: 100,
        },
        tip: {
          margin: "10px 0px",
        },
      }),
    [borderPrimary, textBlack]
  );
};
export default class EditFulfillmentSettingsModal extends Modal {
  constructor(props: Omit<EditFulfillmentSettingsModalProps, "onClose">) {
    super((onClose) => (
      <EditFulfillmentSettingsModalContent {...props} onClose={onClose} />
    ));

    this.setHeader({
      title: i`Edit vacation settings`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.5);
    this.setMaxHeight(720);
  }
}
