//
//  PageGuide.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 01/20/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useDeviceStore } from "@stores/DeviceStore";

type PageMode = "page-with-table" | "default";
export type PageGuideProps = BaseProps & {
  readonly mode?: PageMode;
};

const PageGuide: React.FC<PageGuideProps> = (props: PageGuideProps) => {
  const { className, children, style } = props;
  const styles = useStylesheet(props);
  return <div className={css(styles.root, className, style)}>{children}</div>;
};

export default observer(PageGuide);

const useStylesheet = ({ mode = "default" }: PageGuideProps) => {
  const { pageGuideXForPageWithTable, pageGuideX, pageGuideBottom } =
    useDeviceStore();

  const guideX = mode == "default" ? pageGuideX : pageGuideXForPageWithTable;
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          paddingLeft: guideX,
          paddingRight: guideX,
          paddingBottom: pageGuideBottom,
        },
      }),
    [guideX, pageGuideBottom]
  );
};
