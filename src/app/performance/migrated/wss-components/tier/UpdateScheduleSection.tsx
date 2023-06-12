import { H6, Layout, Text } from "@ContextLogic/lego";
import { ci18n } from "@core/toolkit/i18n";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useTheme } from "@core/stores/ThemeStore";
import { CommerceMerchantState } from "@schema";
import {
  isBanned,
  PickedMerchantWssDetails,
} from "@performance/migrated/toolkit/stats";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly merchantState: CommerceMerchantState;
  readonly wssDetails?: PickedMerchantWssDetails | null;
};

const UpdateScheduleSection: React.FC<Props> = ({
  className,
  style,
  merchantState,
  wssDetails,
}) => {
  const { locale } = useLocalizationStore();
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[className, style, styles.root]}>
      <H6>
        {ci18n("The last/next date WSS tier is updated", "Update schedule")}
      </H6>
      <Layout.FlexRow style={{ gap: 24 }}>
        <Layout.FlexColumn style={{ gap: 8, flexGrow: 1 }}>
          <Text>
            {ci18n("Date when WSS tier was last updated", "Last update:")}
          </Text>
          <Text style={styles.dateText} weight="medium">
            {wssDetails?.lastTierUpdateDate && !isBanned(merchantState)
              ? new Intl.DateTimeFormat(locale, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(wssDetails.lastTierUpdateDate.unix * 1000))
              : "-"}
          </Text>
        </Layout.FlexColumn>
        <Layout.FlexColumn style={{ gap: 8, flexGrow: 1 }}>
          <Text>
            {ci18n("Date when WSS tier will be updated", "Next update:")}
          </Text>
          <Text style={styles.dateText} weight="medium">
            {wssDetails?.nextMonthlyTierUpdateDate && !isBanned(merchantState)
              ? new Intl.DateTimeFormat(locale, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(
                  new Date(wssDetails.nextMonthlyTierUpdateDate.unix * 1000),
                )
              : "-"}
          </Text>
        </Layout.FlexColumn>
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};
export default observer(UpdateScheduleSection);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 8,
        },
        dateText: {
          color: textBlack,
        },
      }),
    [textBlack],
  );
};
