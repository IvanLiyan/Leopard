import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link, Layout } from "@ContextLogic/lego";

/* Merchant Imports */
import { Icon } from "@merchant/component/core";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import AnnouncementDashboard from "@merchant/component/widget/announcement-dashboard/AnnouncementDashboard";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import HomeSection from "@plus/component/home/HomeSection";

type Props = BaseProps;

const AnnouncementsSection: React.FC<Props> = ({ style, className }: Props) => {
  const styles = useStylesheet();
  const { primary } = useTheme();

  const renderRight = () => (
    <Link href="/announcements/system-update">
      <Layout.FlexRow>
        {i`View all`}
        <Icon name="arrowRight" color={primary} />
      </Layout.FlexRow>
    </Link>
  );

  return (
    <HomeSection
      title={i`Announcements`}
      renderRight={renderRight}
      className={css(className, style)}
    >
      <AnnouncementDashboard className={css(styles.root)} />
    </HomeSection>
  );
};

export default observer(AnnouncementsSection);

const useStylesheet = () =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
  });
