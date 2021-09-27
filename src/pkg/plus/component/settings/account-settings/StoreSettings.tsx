import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightSemibold } from "@toolkit/fonts";
import { StoreNameValidator } from "@toolkit/validators";
import { LoadingIndicator, Markdown } from "@ContextLogic/lego";

/* Merchant Plus Components */
import SettingsSection, {
  SettingsSectionProps,
} from "@plus/component/settings/toolkit/SettingsSection";
import SettingsRow from "@plus/component/settings/toolkit/SettingsRow";

/* Merchant Stores */
import { useToastStore } from "@merchant/stores/ToastStore";

/* Relative Imports */
import InlineEdit from "./InlineEdit";
import StoreNameConfirmationModal from "./modals/StoreNameConfirmationModal";
import VacationModeConfirmationModal from "./modals/VacationModeConfirmationModal";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ChangeDisplayNameMutation,
  ChangeVacationModeMutation,
  MerchantMutationChangeDisplayNameArgs,
  MerchantMutationChangeVacationModeArgs,
} from "@schema/types";
import { useTheme } from "@merchant/stores/ThemeStore";
import { AccountSettingsInitialData } from "@toolkit/account-settings";
import { useDeciderKey } from "@merchant/stores/ExperimentStore";
import { zendeskURL } from "@toolkit/url";

const CHANGE_DISPLAY_NAME = gql`
  mutation StoreSettings_ChangeDisplayName($input: ChangeDisplayNameInput!) {
    currentUser {
      merchant {
        changeDisplayName(input: $input) {
          error
          displayName
        }
      }
    }
  }
`;

type ChangeDisplayNameResponse = {
  readonly currentUser: {
    readonly merchant: {
      readonly changeDisplayName: Pick<
        ChangeDisplayNameMutation,
        "error" | "displayName"
      >;
    };
  };
};

const CHANGE_VACATION_MODE = gql`
  mutation StoreSettings_ChangeVacationMode($input: ChangeVacationModeInput!) {
    currentUser {
      merchant {
        changeVacationMode(input: $input) {
          onVacationMode
          error
        }
      }
    }
  }
`;

type ChangeVacationModeResponse = {
  readonly currentUser: {
    readonly merchant: {
      readonly changeVacationMode: Pick<
        ChangeVacationModeMutation,
        "error" | "onVacationMode"
      >;
    };
  };
};

export type StoreSettingsProps = BaseProps & {
  readonly hasBottomBorder?: SettingsSectionProps["hasBottomBorder"];
  readonly initialData: AccountSettingsInitialData;
};

const StoreSettings: React.FC<StoreSettingsProps> = (
  props: StoreSettingsProps
) => {
  const { className, style, hasBottomBorder, initialData } = props;
  const styles = useStylesheet(props);
  const toastStore = useToastStore();
  const [displayName, setDisplayName] = useState(
    initialData.currentMerchant.displayName
  );
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [
    changeDisplayName,
    { loading: changeDisplayNameLoading },
  ] = useMutation<
    ChangeDisplayNameResponse,
    MerchantMutationChangeDisplayNameArgs
  >(CHANGE_DISPLAY_NAME);
  const [vacationModeOn, setVacationModeOn] = useState<
    boolean | null | undefined
  >(initialData.currentMerchant.onVacationMode);
  const [
    changeVacationMode,
    { loading: changeVacationModeLoading },
  ] = useMutation<
    ChangeVacationModeResponse,
    MerchantMutationChangeVacationModeArgs
  >(CHANGE_VACATION_MODE);
  const {
    currentUser: { accountManager },
    currentMerchant: { id, revShare, canUseVacationMode, isStoreMerchant },
  } = initialData;

  const {
    decision: hideRevShareValueDeciderKey,
    isLoading: hideRevShareValueIsLoading,
  } = useDeciderKey("hide_merchant_rev_share");

  const displayRevShare = !isStoreMerchant && !!revShare;

  const hideMerchantRevShareValue =
    hideRevShareValueDeciderKey && revShare == 15;

  const canEditDisplayName = !editingDisplayName && !isStoreMerchant;

  const onDisplayNameChange = async (newDisplayName: string) => {
    const { data } = await changeDisplayName({
      variables: { input: { displayName: newDisplayName } },
    });
    if (data == null) {
      toastStore.negative(i`Something went wrong. Please try again later.`);
      return;
    }

    const {
      currentUser: {
        merchant: {
          changeDisplayName: { error, displayName: returnedDisplayName },
        },
      },
    } = data;

    if (error) {
      toastStore.negative(error);
      return;
    }

    setDisplayName(returnedDisplayName || "");
    setEditingDisplayName(false);
    new StoreNameConfirmationModal({}).render();
  };

  const onVacationModeChange = async (turningOn: boolean) => {
    const { data } = await changeVacationMode({
      variables: { input: { setToOn: turningOn } },
    });
    if (data == null) {
      toastStore.negative(i`Something went wrong. Please try again later.`);
      return;
    }

    const {
      currentUser: {
        merchant: {
          changeVacationMode: { error, onVacationMode },
        },
      },
    } = data;

    if (error) {
      toastStore.negative(error);
      return;
    }

    if (onVacationMode !== undefined) setVacationModeOn(onVacationMode);
    new VacationModeConfirmationModal({
      turningOnVacationMode: turningOn,
    }).render();
  };

  const displayNameNode = editingDisplayName ? (
    <InlineEdit
      className={css(styles.inlineEdit)}
      onSave={onDisplayNameChange}
      validators={[new StoreNameValidator()]}
      onCancel={() => {
        setEditingDisplayName(false);
      }}
      isLoading={changeDisplayNameLoading}
    />
  ) : (
    displayName
  );

  const vacationModeNode = (
    <div className={css(styles.vacationMode)}>
      {vacationModeOn ? i`ON` : i`OFF`}
    </div>
  );

  return (
    <SettingsSection
      className={css(className, style)}
      title={i`Store`}
      hasBottomBorder={hasBottomBorder}
    >
      <div className={css(styles.root)}>
        <SettingsRow
          title={i`Store name`}
          onEdit={
            canEditDisplayName
              ? () => {
                  setEditingDisplayName(true);
                }
              : undefined
          }
        >
          {displayNameNode}
        </SettingsRow>
        <SettingsRow title={i`Merchant ID`}>{id}</SettingsRow>
        {accountManager && (
          <SettingsRow title={i`Account manager`}>
            {accountManager.email}
          </SettingsRow>
        )}
        {displayRevShare &&
          (hideRevShareValueIsLoading ? (
            <LoadingIndicator />
          ) : (
            <SettingsRow title={i`Revenue share`}>
              {hideMerchantRevShareValue ? (
                <Markdown
                  text={i`Standard. [Learn more](${zendeskURL("204531558")})`}
                />
              ) : (
                `${revShare}%`
              )}
            </SettingsRow>
          ))}

        {!isStoreMerchant && (
          <SettingsRow
            title={i`Vacation mode`}
            popoverMarkdown={
              i`Put your store in vacation mode to stop receiving ` +
              i`orders on your products.`
            }
            onEdit={
              canUseVacationMode
                ? () => {
                    onVacationModeChange(!vacationModeOn);
                  }
                : undefined
            }
            isLoading={changeVacationModeLoading}
          >
            {vacationModeNode}
          </SettingsRow>
        )}
      </div>
    </SettingsSection>
  );
};

export default observer(StoreSettings);

const useStylesheet = (props: StoreSettingsProps) => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        inlineEdit: {},
        vacationMode: {
          color: textDark,
          fontWeight: weightSemibold,
        },
      }),
    [textDark]
  );
};
