/*
 * ChromePersistentAlerts.tsx
 *
 * Created by Jonah Dlin on Tue Sep 07 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";

/* Merchant Store */
import { useNavigationStore } from "@core/stores/NavigationStore";

/* Lego Toolkit */
import { Banner, Layout, Markdown } from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { AlertSentimentMap, PickedUserAlert } from "@chrome/toolkit";

type Props = BaseProps & {
  readonly alerts: ReadonlyArray<PickedUserAlert>;
};

const ChromePersistentAlerts: React.FC<Props> = ({
  className,
  style,
  alerts,
}: Props) => {
  const navigationStore = useNavigationStore();

  return (
    <Layout.FlexColumn style={[className, style]}>
      {[...alerts]
        .sort(({ sentiment }) => (sentiment === "NEGATIVE" ? -1 : 0))
        .map(({ date, link, description, sentiment }) => (
          <Banner
            sentiment={
              sentiment == null ? "warning" : AlertSentimentMap[sentiment]
            }
            showTopBorder
            key={`${date != null && date.formatted}-${link}-${description}`}
            contentAlignment="left"
          >
            <Markdown
              onLinkClicked={
                void (async () => {
                  if (link) {
                    await navigationStore.navigate(link);
                  }
                })
              }
              text={i`${date == null ? "" : `${date.formatted} UTC - `}${
                link == null ? description : `[${description}](${link})`
              }`}
            />
          </Banner>
        ))}
    </Layout.FlexColumn>
  );
};

export default observer(ChromePersistentAlerts);
