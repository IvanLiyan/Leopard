import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@merchant/component/core";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

type CampaignSuggestionsProps = BaseProps & {
  readonly illustration: IllustrationName;
  readonly content: string;
  readonly renderAction?: () => ReactNode;
};

const CampaignSuggestions = (props: CampaignSuggestionsProps) => {
  const { illustration, content, renderAction, className, style } = props;
  const styles = useStylesheet();
  return (
    <Card className={css(className, style)}>
      <div className={css(styles.root)}>
        <Illustration
          className={css(styles.img)}
          name={illustration}
          alt={illustration}
        />
        <div className={css(styles.content)}>{content}</div>
        {renderAction && renderAction()}
      </div>
    </Card>
  );
};

export default observer(CampaignSuggestions);

const useStylesheet = () => {
  const { textBlack, primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderLeft: `solid 4px ${primary}`,
        },
        img: {
          margin: 15,
          width: 50,
          height: 50,
        },
        content: {
          fontSize: 20,
          fontWeight: weightBold,
          flexGrow: 1,
          color: textBlack,
        },
      }),
    [textBlack, primary],
  );
};
