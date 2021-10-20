import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table, Markdown, Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightNormal, weightSemibold } from "@toolkit/fonts";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { AccountTypeDisplayNames, MxDropdown } from "@toolkit/tax/types-v2";

/* Merchant Components */
import ValidatedLabel from "@merchant/component/tax/v2/ValidatedLabel";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useLocalizationStore } from "@stores/LocalizationStore";
import { useTaxStore } from "@merchant/stores/TaxStore";

type Props = BaseProps & {
  readonly info: MxDropdown;
};

const MXTaxInfo: React.FC<Props> = ({
  className,
  style,
  info: {
    accountType,
    accountValidation,
    rfcId,
    defaultShipFromIsMx,
    lastUpdated: { unix },
  },
}: Props) => {
  const styles = useStylesheet();
  const { preferredProperLocale } = useLocalizationStore();
  const { getTaxDescription } = useTaxStore();

  const defaultShipFromString =
    defaultShipFromIsMx === true
      ? `Orders are shipped from Mexico`
      : `Orders are shipped from outside of Mexico`;

  return (
    <>
      <Table
        className={css(className, style)}
        rowStyle={() => ({ minHeight: 68 })}
        style={{
          position: "static",
        }}
        hideBorder
      >
        <Table.FixtureColumn title={i`Your tax information`} width={135} />
        <Table.FixtureColumn />

        <Table.FixtureRow>
          <Table.FixtureCell>
            <div className={css(styles.title)}>Account type</div>
          </Table.FixtureCell>
          <Table.FixtureCell>
            <div className={css(styles.accountTypeCell, styles.font)}>
              {AccountTypeDisplayNames[accountType || "COMPANY"]}
              <ValidatedLabel
                state={accountValidation}
                className={css(styles.accountTypeLabel)}
              />
            </div>
          </Table.FixtureCell>
        </Table.FixtureRow>

        <Table.FixtureRow>
          <Table.FixtureCell>
            <div className={css(styles.title)}>
              <Markdown text={i`Mexico tax identification number (RFC ID)`} />
              <Info
                className={css(styles.info)}
                popoverPosition="right center"
                text={() => (
                  <div className={css(styles.desc)}>
                    <Markdown
                      className={css(styles.descText)}
                      text={getTaxDescription({ countryCode: "MX" }) || ""}
                    />
                  </div>
                )}
              />
            </div>
          </Table.FixtureCell>
          <Table.FixtureCell>
            <div className={css(styles.font)}>{rfcId}</div>
          </Table.FixtureCell>
        </Table.FixtureRow>

        <Table.FixtureRow>
          <Table.FixtureCell>
            <div className={css(styles.title)}>
              <Markdown text={i`Default ship-from location`} />
              <Info
                className={css(styles.info)}
                text={
                  i`For Mexico-bound orders, please select the default ` +
                  i`ship-from location below. Your selection may be used ` +
                  i`to calculate VAT at the time of customer purchase.`
                }
              />
            </div>
          </Table.FixtureCell>
          <Table.FixtureCell>
            {defaultShipFromIsMx != null && (
              <div className={css(styles.font)}>{defaultShipFromString}</div>
            )}
          </Table.FixtureCell>
        </Table.FixtureRow>

        <Table.FixtureRow>
          <Table.FixtureCell>
            <div className={css(styles.title)}>Last updated</div>
          </Table.FixtureCell>
          <Table.FixtureCell>
            {new Date(unix * 1000).toLocaleDateString(preferredProperLocale)}
          </Table.FixtureCell>
        </Table.FixtureRow>
      </Table>
    </>
  );
};

export default observer(MXTaxInfo);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        font: {
          fontSize: 14,
          color: textBlack,
        },
        accountTypeCell: {
          display: "flex",
        },
        accountTypeLabel: {
          marginLeft: 8,
        },
        title: {
          paddingLeft: 14,
          display: "flex",
          alignItems: "center",
          fontWeight: weightSemibold,
          fontSize: 15,
          color: textBlack,
        },
        info: {
          marginLeft: 4,
        },
        desc: {
          display: "flex",
          flexDirection: "column",
          padding: 8,
          maxWidth: 250,
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
        },
        descText: {
          fontSize: 14,
          lineHeight: 1.5,
          fontWeight: weightNormal,
        },
      }),
    [textBlack],
  );
};
