/*
 * VariationImageModal.tsx
 *
 * Created by Jonah Dlin on Tue Oct 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import Modal, { ModalProps } from "@core/components/modal/Modal";

import {
  Layout,
  PrimaryButton,
  SecondaryButton,
  Text,
} from "@ContextLogic/lego";

import AddEditProductState, {
  createCustomsLogistics,
  CustomsLogistics,
  getVariationOptionValues,
  updateCustomsLogistics,
  Variation,
} from "@add-edit-product/AddEditProductState";
import CustomsLogisticsForm from "@add-edit-product/components/cards/customs-logistics/CustomsLogisticsForm";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import ModalTitle from "@core/components/modal/ModalTitle";

export type CustomCustomsLogisticsProps = Pick<ModalProps, "open"> & {
  readonly state: AddEditProductState;
  readonly variation: Variation;
  readonly onClose: () => unknown;
};

const CustomCustomsLogisticsModal: React.FC<CustomCustomsLogisticsProps> = ({
  open,
  state,
  variation,
  onClose,
}) => {
  const {
    customsCountryOptions,
    primaryCurrency,
    customsLogisticsDefault,
    updateVariation,
    useCalculatedShipping,
  } = state;

  const { customCustomsLogistics, size, color, options, clientSideId } =
    variation;

  const initialData = useMemo(() => {
    if (customCustomsLogistics != null) {
      return createCustomsLogistics(customCustomsLogistics);
    }
    return createCustomsLogistics();
  }, [customCustomsLogistics]);

  const styles = useStylesheet();

  const [data, setData] = useState<CustomsLogistics>(initialData);

  const variationName = useMemo(() => {
    if (
      size == null &&
      color == null &&
      (options == null || Object.entries(options).length === 0)
    ) {
      return i`Variation`;
    }

    const optionValues = getVariationOptionValues(variation);
    const name = [...optionValues, color, size]
      .filter((part) => part != null)
      .join(" / ");
    return ci18n(
      "Variation modal header",
      "Variation: {%1=display name}",
      name,
    );
  }, [size, color, options, variation]);

  return (
    <Modal open={open} onClose={onClose} maxWidth="md" fullWidth>
      <ModalTitle onClose={onClose} title={i`Customs & Logistics (Custom)`} />
      <Layout.FlexColumn alignItems="stretch" key={clientSideId}>
        <Layout.FlexColumn style={styles.content}>
          <Layout.FlexRow style={styles.header} justifyContent="space-between">
            <Text weight="semibold" style={styles.variationName}>
              {variationName}
            </Text>
            <PrimaryButton
              style={styles.prefillButton}
              onClick={() => {
                customsLogisticsDefault != null &&
                  setData(createCustomsLogistics(customsLogisticsDefault));
              }}
            >
              Apply prefilled information
            </PrimaryButton>
          </Layout.FlexRow>
          <CustomsLogisticsForm
            data={data}
            onUpdate={(newProps) =>
              setData(updateCustomsLogistics({ data, newProps }))
            }
            currency={primaryCurrency}
            customsCountryOptions={customsCountryOptions}
            useCalculatedShipping={useCalculatedShipping}
            data-cy={`variation-customs`}
          />
        </Layout.FlexColumn>
        <Layout.FlexRow
          alignItems="stretch"
          justifyContent="flex-end"
          style={styles.footer}
        >
          <SecondaryButton
            onClick={() => onClose()}
            data-cy="customs-modal-button-cancel"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={() => {
              updateVariation({
                clientSideId,
                newProps: {
                  customCustomsLogistics: data,
                },
              });
              onClose();
            }}
            style={styles.submitButton}
            data-cy="customs-modal-button-submit"
          >
            Submit
          </PrimaryButton>
        </Layout.FlexRow>
      </Layout.FlexColumn>
    </Modal>
  );
};

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: "40px 90px",
        },
        header: {
          marginBottom: 24,
        },
        variationName: {
          color: textBlack,
          fontSize: 24,
          lineHeight: "28px",
        },
        prefillButton: {
          marginLeft: 8,
        },
        footer: {
          padding: 24,
          borderTop: `1px solid ${borderPrimary}`,
          gap: 8,
        },
        submitButton: {
          flex: 1,
        },
      }),
    [borderPrimary, textBlack],
  );
};

export default observer(CustomCustomsLogisticsModal);
