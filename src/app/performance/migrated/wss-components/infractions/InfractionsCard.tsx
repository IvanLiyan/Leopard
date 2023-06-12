import { H6, Layout, Markdown, Popover, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import Icon from "@core/components/Icon";
import { useTheme } from "@core/stores/ThemeStore";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

type Infraction = {
  readonly title: string;
  readonly count: number | undefined;
};

type InfractionsProps = BaseProps & {
  readonly title: string;
  readonly info: string;
  readonly infractions: ReadonlyArray<Infraction>;
};

const InfractionsCard: React.FC<InfractionsProps> = (props) => {
  const { className, style, title, info, infractions } = props;

  const { primary } = useTheme();
  const styles = useStylesheet();

  const getInfractionsCount = (infractions: ReadonlyArray<Infraction>) =>
    infractions.reduce((acc, cur) => acc + (cur.count || 0), 0);

  const infractionsCount = getInfractionsCount(infractions);

  return (
    <Layout.FlexColumn style={[className, style, styles.root]}>
      <Layout.FlexRow alignItems="center">
        <Text weight="bold" style={styles.title}>
          {title}
        </Text>
        <Popover popoverContent={info}>
          <Icon style={styles.icon} name="calendar" size={20} color={primary} />
        </Popover>
      </Layout.FlexRow>
      <Layout.FlexColumn>
        <H6>{ci18n("Means the value of a metric as of today", "Today")}</H6>
        <Text
          weight="bold"
          style={[styles.sum, infractionsCount > 0 && styles.colorRed]}
        >
          {infractionsCount}
        </Text>
      </Layout.FlexColumn>
      {infractionsCount > 0 && (
        <Layout.FlexColumn style={styles.infractionsList}>
          {infractions.map(({ title, count }, i) => {
            const hasInfractions = count != null && count > 0;
            if (!hasInfractions) {
              return null;
            }
            return (
              <Markdown
                key={i}
                style={[
                  styles.infractionCount,
                  hasInfractions && styles.colorRed,
                ]}
                text={`${title}: **${count}**`}
              />
            );
          })}
        </Layout.FlexColumn>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(InfractionsCard);

const useStylesheet = () => {
  const {
    textBlack,
    textDark,
    borderPrimary,
    negativeDarker,
    surfaceLightest,
  } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 16,
          gap: "8px 0",
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          background: surfaceLightest,
        },
        icon: {
          margin: "0px 4px 0px 4px",
        },
        title: {
          fontSize: 16,
          color: textBlack,
          marginRight: 8,
        },
        sum: {
          fontSize: 40,
          color: textDark,
        },
        colorRed: {
          color: negativeDarker,
        },
        infractionsList: {
          gap: "8px 0",
        },
        infractionName: {
          fontSize: 16,
          color: textDark,
        },
        infractionCount: {
          fontSize: 16,
          color: textDark,
        },
      }),
    [textBlack, borderPrimary, textDark, negativeDarker, surfaceLightest],
  );
};
