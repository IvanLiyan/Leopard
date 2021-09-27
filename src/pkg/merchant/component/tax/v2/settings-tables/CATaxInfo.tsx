import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table, Markdown, Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightSemibold } from "@toolkit/fonts";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import {
  AccountTypeDisplayNames,
  ValidatedState,
  AccountType,
} from "@toolkit/tax/types-v2";

/* Merchant Components */
import ValidatedLabel from "@merchant/component/tax/v2/ValidatedLabel";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly gstNumber: string | null | undefined;
  readonly accountValidation: ValidatedState;
  readonly accountType: AccountType;
};

const CATaxInfo: React.FC<Props> = (props: Props) => {
  const { className, style, gstNumber, accountValidation, accountType } = props;

  const styles = useStylesheet();

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
              <Markdown text={i`GST/HST Account Number`} />
              <Info
                className={css(styles.info)}
                text={
                  i`This GST/HST account number applies to all ` +
                  i`provinces/territories. If a provincial tax number has been ` +
                  i`provided for a given province/territory, it will be ` +
                  i`displayed in the Tax & Account Number columns below.`
                }
              />
            </div>
          </Table.FixtureCell>
          <Table.FixtureCell>
            <div className={css(styles.font)}>{gstNumber}</div>
          </Table.FixtureCell>
        </Table.FixtureRow>
      </Table>
    </>
  );
};

export default observer(CATaxInfo);

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
      }),
    [textBlack]
  );
};
