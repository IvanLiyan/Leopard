import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { Illustration } from "@merchant/component/core";
import { Modal } from "@merchant/component/core/modal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import DimenStore from "@merchant/stores/DimenStore";

import Screen1 from "./Screen1";
import Screen2 from "./Screen2";
import Screen3 from "./Screen3";
import Footer from "./Footer";
import { useLogger } from "@toolkit/logger";

type Props = {
  readonly onClose: () => unknown;
};

const WishExpressIntroductionModalContent: React.FC<Props> = ({
  onClose,
}: Props) => {
  const styles = useStylesheet();
  const [screen, setScreen] = useState(0);
  const actionLogger = useLogger("PLUS_WISH_EXPRESS_UI");

  return (
    <div className={css(styles.root)}>
      <Illustration
        name="merchantPlusWishExpressHeader"
        alt={i`wish express header`}
      />
      {screen === 0 && <Screen1 className={css(styles.screen)} />}
      {screen === 1 && <Screen2 className={css(styles.screen)} />}
      {screen === 2 && <Screen3 className={css(styles.screen)} />}
      <Footer
        className={css(styles.footer)}
        screen={screen}
        numScreens={3}
        setScreen={setScreen}
        onDone={async () => {
          onClose();
          actionLogger.info({
            action: "CLICK_INTRO_MODAL_DONE",
          });
        }}
      />
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        screen: {
          "@media (max-width: 900px)": {
            padding: "8px 24px 24px 24px",
          },
          "@media (min-width: 900px)": {
            padding: "8px 80px 24px 80px",
            minHeight: 380,
          },
        },
        footer: {},
      }),
    []
  );
};

export default class WishExpressIntroductionModal extends Modal {
  constructor(props: Omit<Props, "onClose">) {
    super((onClose) => (
      <WishExpressIntroductionModalContent {...props} onClose={onClose} />
    ));

    this.setHeader({
      title: i`Wish Express`,
    });

    this.setRenderFooter(() => null);
    this.setNoMaxHeight(true);
    const { screenInnerWidth } = DimenStore.instance();
    const targetPercentage = 800 / screenInnerWidth;
    this.setWidthPercentage(targetPercentage);
  }
}
