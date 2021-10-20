/*
 * NewNavBanner.tsx
 *
 * Created by Jonah Dlin on Mon May 31 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";
import { useNavigationStore } from "@stores/NavigationStore";
import { useApolloStore } from "@stores/ApolloStore";

import { useUIStateBool } from "@toolkit/ui-state";
import bannerGif from "@assets/img/new-nav-banner.gif";

export type NewNavBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string | undefined;
  };
};

const NewNavBanner = (props: NewNavBannerProps) => {
  const { logParams } = props;
  const navigationStore = useNavigationStore();
  const { client } = useApolloStore();

  const { isLoading, update: setPrefersNewNav } = useUIStateBool(
    "PREFERS_NEW_NAV",
    {
      client,
    },
  );

  const onSwitch = async () => {
    await setPrefersNewNav(true);
    await navigationStore.reload({ fullReload: true });
  };

  const { primary, textBlack } = useTheme();

  return (
    <SimpleBannerItem
      title={i`Try the new navigation menu`}
      body={
        i`We have a new view of the navigation menu for you to try out! Opt ` +
        i`out at any time by clicking "Switch to original navigation" in the ` +
        i`store name dropdown on the top right corner.`
      }
      textColor={textBlack}
      bannerImg={() => <img src={bannerGif} alt={i`New navigation`} />}
      cta={{
        text: i`Switch to new navigation`,
        onClick: onSwitch,
        isLoading,
        style: {
          backgroundColor: primary,
        },
      }}
      logParams={{
        banner_key: "NewNavBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(NewNavBanner);
