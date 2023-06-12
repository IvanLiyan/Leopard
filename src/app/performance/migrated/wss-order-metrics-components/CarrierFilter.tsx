import {
  CheckboxGroupField,
  H6,
  Layout,
  Link,
  PrimaryButton,
  SecondaryButton,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";

type Props = BaseProps & {
  readonly options?: ReadonlyArray<string> | null;
  readonly selected?: ReadonlyArray<string> | null;
  readonly onConfirm?: (reasons: ReadonlyArray<string>) => void;
};

const CarrierFilter: React.FC<Props> = (props) => {
  const {
    className,
    style,
    options,
    selected: initSelected,
    onConfirm,
  } = props;
  const styles = useStylesheet();
  const { locale } = useLocalizationStore();

  // initSelected may be initialized to a set too large
  // filter it down to those that exists in `options`
  const [unconfirmedSelected, setUnconfirmedSelected] = useState(
    initSelected?.filter((country) =>
      options?.some((option) => option === country),
    ) ||
      options ||
      [],
  );

  if (!options) {
    return null;
  }

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <H6>
        {ci18n(
          "Means the carrier used for an order, e.g. USPS, UPS",
          "Carrier",
        )}
      </H6>
      <CheckboxGroupField
        style={styles.filters}
        options={options
          .map((carrierName) => {
            return {
              value: carrierName,
              title: carrierName,
              key: carrierName,
            };
          })
          .sort((a, b) => a.title.localeCompare(b.title, locale))}
        selected={unconfirmedSelected}
        onChecked={(option: { readonly value: string }) => {
          setUnconfirmedSelected((prev) => {
            if (prev.includes(option.value)) {
              return prev.filter((reason) => reason != option.value);
            }
            return [...prev, option.value];
          });
        }}
      />
      <Layout.FlexRow justifyContent="flex-start" style={styles.buttonRow}>
        <Link
          onClick={() => {
            setUnconfirmedSelected([]);
          }}
        >
          {ci18n("CTA text", "Clear filter")}
        </Link>
        <Link
          onClick={() => {
            setUnconfirmedSelected(options);
          }}
        >
          {ci18n("CTA text", "Select all")}
        </Link>
      </Layout.FlexRow>
      <Layout.FlexRow justifyContent="flex-end" style={styles.buttonRow}>
        <PrimaryButton
          onClick={() => {
            onConfirm && onConfirm(unconfirmedSelected);
            // disabled as string is not shown to user
            /* eslint-disable local-rules/unwrapped-i18n */
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
          }}
        >
          {ci18n("CTA text", "Confirm")}
        </PrimaryButton>
        <SecondaryButton
          padding="5px 15px"
          type="default"
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
          }}
          text={ci18n("CTA text", "Cancel")}
        />
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 24,
        },
        filters: {
          marginTop: 16,
          marginBottom: 16,
          maxHeight: 300,
          overflowY: "scroll",
          // ripple ink uses an :after that expands the size of the checkbox
          // eslint-disable-next-line local-rules/no-broad-styling-rules
          ":nth-child(1n) div": {
            ":after": {
              content: "none",
            },
          },
        },
        buttonRow: {
          gap: 16,
          marginTop: 8,
        },
      }),
    [],
  );
};

export default observer(CarrierFilter);
