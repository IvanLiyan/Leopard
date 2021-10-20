/*
 * ShippingEditing.tsx
 *
 * Created by Jonah Dlin on Tue Feb 09 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { ni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Components */
import {
  PrimaryButton,
  Radio,
  Text,
  Layout,
  CheckboxField,
  Info,
} from "@ContextLogic/lego";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Merchant Toolkit */
import {
  PickedWpsShippingOption,
  ShippingProviderLogoMap,
} from "@toolkit/wps/create-shipping-label";

/* Merchant Components */
import { Illustration } from "@merchant/component/core";
import ConfirmationModal from "@merchant/component/wps/create-shipping-label/confirmation-modals/ConfirmationModal";

type ShippingOptionProps = BaseProps & {
  readonly option: PickedWpsShippingOption;
  readonly onSelect: () => unknown;
  readonly isSelected?: boolean;
};

const ShippingOption: React.FC<ShippingOptionProps> = ({
  className,
  style,
  option,
  onSelect,
  isSelected,
}: ShippingOptionProps) => {
  const styles = useStylesheet();

  const deliveryString = ni18n(
    option.daysToDeliver,
    "1 day",
    "{%1=number of days} days",
  );

  const includes = i`Includes Tracking`;
  const registered = i`Registered`;

  const attributes = [
    ...(option.includesTracking ? [includes] : []),
    ...(option.isRegistered ? [registered] : []),
  ].join(" • ");

  return (
    <div
      className={css(styles.shippingOption, className, style)}
      onClick={onSelect}
    >
      <Radio checked={isSelected || false} />
      <Illustration
        className={css(styles.logo)}
        name={ShippingProviderLogoMap[option.provider.name] || "truckOutline"}
        alt=""
      />
      <div className={css(styles.optionTitleSection)}>
        <Text className={css(styles.optionTitle)} weight="semibold">
          {option.name}
        </Text>
        <Text className={css(styles.optionAttributes)}>{attributes}</Text>
      </div>
      <div className={css(styles.optionRightSection)}>
        <Text className={css(styles.price)} weight="semibold">
          {option.price.display}
        </Text>
        <Text className={css(styles.delivery)}>{deliveryString}</Text>
      </div>
    </div>
  );
};

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
};

const ShippingEditing: React.FC<Props> = ({
  className,
  style,
  state,
}: Props) => {
  const styles = useStylesheet();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { shippingState, onCloseShipping, canBuyShippingLabel, isEdit } = state;
  const {
    cheapestShippingOption,
    fastestShippingOption,
    selectedShippingOptionId,
    shippingOptions,
    selectedAdditionalServices,
  } = shippingState;

  const handleClickNext = async () => {
    if (!isEdit) {
      onCloseShipping();
      new ConfirmationModal(state).render();
      return;
    }

    setIsSubmitting(true);
    const success = await state.onBuyShippingLabel();
    if (!success) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onCloseShipping();
  };

  const renderCheapest = () => {
    if (cheapestShippingOption == null) {
      return null;
    }

    const { id } = cheapestShippingOption;

    return (
      <Layout.FlexColumn className={css(styles.section)}>
        <Text className={css(styles.sectionTitle)} weight="semibold">
          Low-Priced Option
        </Text>
        <ShippingOption
          option={cheapestShippingOption}
          onSelect={() => (shippingState.selectedShippingOptionId = id)}
          isSelected={id === selectedShippingOptionId}
        />
      </Layout.FlexColumn>
    );
  };

  const renderFastest = () => {
    if (fastestShippingOption == null) {
      return null;
    }

    const { id } = fastestShippingOption;

    return (
      <Layout.FlexColumn className={css(styles.section)}>
        <Text className={css(styles.sectionTitle)} weight="semibold">
          Fastest
        </Text>
        <ShippingOption
          option={fastestShippingOption}
          onSelect={() => (shippingState.selectedShippingOptionId = id)}
          isSelected={id === selectedShippingOptionId}
        />
      </Layout.FlexColumn>
    );
  };

  const renderAll = () => {
    return (
      <Layout.FlexColumn className={css(styles.section)}>
        <Text className={css(styles.sectionTitle)} weight="semibold">
          All rates
        </Text>
        {shippingOptions.map((option) => (
          <ShippingOption
            option={option}
            onSelect={() =>
              (shippingState.selectedShippingOptionId = option.id)
            }
            isSelected={option.id === selectedShippingOptionId}
          />
        ))}
      </Layout.FlexColumn>
    );
  };

  const renderAdditionalServices = () => {
    const shippingOption = shippingOptions.filter(
      (option) => option.id === selectedShippingOptionId,
    );
    if (shippingOption == null || shippingOption.length === 0) {
      return null;
    }

    const services = shippingOption[0].availableAdditionalServiceOptions;

    return (
      <Layout.FlexColumn style={[styles.section, styles.additionalServices]}>
        <Text style={[styles.sectionTitle]} weight="semibold">
          Additional services
        </Text>
        <Layout.FlexRow>
          {services.map((service) => (
            <>
              <CheckboxField
                title={`${service.name} ${
                  service.fee != null ? "(+$)" : ""
                }`.trim()}
                checked={selectedAdditionalServices.has(service.type)}
                style={[styles.additionalService]}
                onChange={(value) => {
                  if (value) {
                    selectedAdditionalServices.add(service.type);
                  } else {
                    selectedAdditionalServices.delete(service.type);
                  }
                }}
              />
              {service.type === "ADDITIONAL_HANDLING" && (
                <Info
                  text={i`Special Handling-Fragile`}
                  style={[styles.info]}
                />
              )}
            </>
          ))}
        </Layout.FlexRow>
      </Layout.FlexColumn>
    );
  };

  return (
    <div className={css(styles.root, className, style)}>
      {renderCheapest()}
      {renderFastest()}
      {renderAll()}
      {renderAdditionalServices()}
      <div className={css(styles.footer)}>
        <PrimaryButton
          onClick={handleClickNext}
          isDisabled={!canBuyShippingLabel}
          isLoading={isSubmitting}
        >
          {isEdit ? i`Save` : i`Next`}
        </PrimaryButton>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        section: {
          marginBottom: 24,
        },
        sectionTitle: {
          fontSize: 16,
          lineHeight: "20px",
          color: textDark,
          marginBottom: 8,
        },
        shippingOption: {
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: 16,
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          ":not(:last-child)": {
            marginBottom: 8,
          },
        },
        logo: {
          marginLeft: 24,
          maxWidth: 40,
        },
        optionTitleSection: {
          marginLeft: 16,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
        optionRightSection: {
          marginLeft: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "space-between",
        },
        optionTitle: {
          fontSize: 16,
          lineHeight: "24px",
          color: textBlack,
        },
        optionAttributes: {
          fontSize: 12,
          lineHeight: "16px",
          color: textDark,
        },
        price: {
          fontSize: 20,
          lineHeight: "24px",
          color: textBlack,
        },
        delivery: {
          fontSize: 12,
          lineHeight: "16px",
          color: textBlack,
        },
        footer: {
          display: "flex",
          justifyContent: "flex-end",
        },
        additionalServices: {
          borderTop: `1px solid ${borderPrimary}`,
          paddingTop: 18,
        },
        additionalService: {
          ":not(:first-child)": {
            marginLeft: 50,
          },
        },
        info: {
          marginLeft: 8,
        },
      }),
    [textBlack, textDark, borderPrimary],
  );
};

export default observer(ShippingEditing);
