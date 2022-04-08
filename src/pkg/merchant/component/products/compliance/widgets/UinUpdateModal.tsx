import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { useQuery } from "@apollo/client";
import { observer } from "mobx-react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import {
  Layout,
  Banner,
  Markdown,
  Text,
  H6,
  TextInput,
  CheckboxField,
  LoadingIndicator,
} from "@ContextLogic/lego";

/* Merchant Store */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

/* Model */
import FranceEprState from "@merchant/model/products/FranceEprState";
import {
  ProductCategoryLabel,
  LINK_COUNT_QUERY,
  LinkCountRequestData,
  LinkCountResponseData,
} from "@toolkit/products/france-epr";

import Link from "@next-toolkit/Link";

export type Props = {
  readonly isEdit: boolean;
  readonly state: FranceEprState;
};

export type ContentProps = {
  readonly onClose: () => unknown;
  readonly isEdit: boolean;
  readonly state: FranceEprState;
};

const UinUpdateModalContent = observer((props: ContentProps) => {
  const { isSmallScreen } = useDeviceStore();
  const { onClose, isEdit, state } = props;
  const [checked, setChecked] = useState(false);

  const styles = useStylesheet();

  const sendButtonProps = {
    style: { flex: 1 },
    text: i`Submit`,
    isDisabled: isEdit ? !state.isValid : !checked || !state.isValid,
    isLoading: state.isSubmitting,
    onClick: async () => {
      await state.submit();
      onClose();
    },
  };

  const { data, loading } = useQuery<
    LinkCountResponseData,
    LinkCountRequestData
  >(LINK_COUNT_QUERY, {
    variables: {
      ...(state.category ? { franceUinCategories: [state.category] } : {}),
    },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (data == null) {
    return null;
  }

  const productCount = data.policy?.productCompliance?.linkCount || 0;

  return (
    <Layout.FlexColumn>
      <Layout.FlexColumn style={styles.content}>
        {isEdit && (
          <Banner
            sentiment="warning"
            contentAlignment="left"
            text={
              <Markdown
                text={i`This will impact **${productCount}** product(s).`}
              />
            }
          />
        )}
        <Text weight="semibold" style={[styles.row, styles.title, styles.top]}>
          Unique Identification Number (UIN)
        </Text>
        <TextInput
          value={state.uniqueIdentificationNumber}
          onChange={({ text }) => {
            state.uniqueIdentificationNumber = text;
          }}
          style={styles.row}
          placeholder={i`Enter unique identification number`}
        />
        <Text weight="semibold" style={[styles.row, styles.title]}>
          Producer Responsibility Organizations (PRO)
        </Text>
        <TextInput
          value={state.productResponsibilityOrganization}
          onChange={({ text }) => {
            state.productResponsibilityOrganization = text;
          }}
          style={styles.row}
          placeholder={i`Enter producer responsibility organization`}
        />
        <Text weight="semibold" style={[styles.row, styles.title]}>
          Category
        </Text>
        {state.category && (
          <H6 style={styles.row}>{ProductCategoryLabel[state.category]}</H6>
        )}
        {!isEdit && (
          <CheckboxField
            checked={checked}
            onChange={(value) => setChecked(value)}
            style={styles.row}
            title={i`I confirm that all details I provided are legitimate`}
          />
        )}
      </Layout.FlexColumn>
      <ModalFooter
        layout={isSmallScreen ? "vertical" : "horizontal"}
        action={sendButtonProps}
        extraFooterContent={
          <Link style={styles.cancelButton} onClick={() => onClose()}>
            Cancel
          </Link>
        }
      />
    </Layout.FlexColumn>
  );
});

export default class UinUpdateModal extends Modal {
  parentProps: Props;

  constructor(props: Props) {
    super(() => null);
    this.parentProps = props;

    this.setHeader({
      title: this.parentProps.isEdit
        ? i`Edit EPR registration number`
        : i`Add EPR registration number`,
    });
    this.setWidthPercentage(0.4);
    this.setOverflowY("scroll");
  }

  renderContent() {
    const { isEdit } = this.parentProps;
    return (
      <UinUpdateModalContent
        onClose={() => this.close()}
        isEdit={isEdit}
        state={this.parentProps.state}
      />
    );
  }
}

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
        },
        cancelButton: {
          ":not(:last-child)": {
            marginRight: 24,
          },
        },
        row: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        title: {
          color: textDark,
        },
        top: {
          marginTop: 16,
        },
      }),
    [textDark]
  );
};
