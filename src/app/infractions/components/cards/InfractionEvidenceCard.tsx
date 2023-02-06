import React, { useContext, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";
import { InfractionContext } from "@infractions/InfractionContext";

const InfractionEvidenceCard: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  const styles = useStylesheet();
  const {
    infraction: { infractionEvidence },
  } = useContext(InfractionContext);

  return (
    <Card title={i`Infraction Evidence`} style={[className, style]}>
      <div className={css(styles.tableContainer)}>
        <table className={css({ all: "unset" })}>
          <tr className={css(styles.tableRow)}>
            <th className={css(styles.tableCell)}>Type</th>
            <th className={css(styles.tableCell)}>ID</th>
            <th className={css(styles.tableCell)}>Note</th>
          </tr>
          {infractionEvidence.map(({ type, id, note }) => (
            <tr key={id} className={css(styles.tableRow)}>
              <td className={css(styles.tableCell)}>
                <Markdown text={type} />
              </td>
              <td className={css(styles.tableCell)}>
                <Markdown text={id} />
              </td>
              <td className={css(styles.tableCell)}>
                <Markdown text={note} />
              </td>
            </tr>
          ))}
        </table>
      </div>
    </Card>
  );
};

export const useStylesheet = () => {
  const { borderPrimary, surfaceLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        tableContainer: {
          width: "100%",
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          overflow: "hidden",
        },
        tableRow: {
          ":first-child": {
            backgroundColor: surfaceLight,
          },
          ":not(:last-child)": {
            borderBottom: `1px solid ${borderPrimary}`,
          },
        },
        tableCell: {
          textAlign: "initial",

          padding: 8,
          minWidth: 58,
        },
      }),
    [borderPrimary, surfaceLight],
  );
};

export default observer(InfractionEvidenceCard);
