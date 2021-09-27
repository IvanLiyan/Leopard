import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { Modal, ModalFooter } from "@merchant/component/core/modal";
import { OnCloseFn } from "@merchant/component/core/modal/Modal";
//export type RenderFn = (onClose: OnCloseFn) => ReactNode;
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FaqCardProps = BaseProps & {
  readonly text: string;
  readonly modalContent: () => ReactNode;
};

const CountryOfDomicileFaqCard = (props: FaqCardProps) => {
  const { className, style, text, modalContent } = props;
  const styles = useStylesheet();

  const renderContent = (onClose: OnCloseFn) => {
    return (
      <>
        <div className={css(styles.modalContentRoot)}>{modalContent()}</div>
        <ModalFooter
          cancel={{ children: i`Close`, onClick: onClose }}
          layout="horizontal-centered"
        />
      </>
    );
  };
  const handleClickLearnMore = () => {
    const modal = new Modal(renderContent);
    modal
      .setHeader({ title: i`What should I know` })
      .setWidthPercentage(0.5)
      .setNoMaxHeight(true)
      .render();
  };

  return (
    <Card className={css(style, styles.root, className)}>
      <div className={css(styles.content)}>
        <div className={css(styles.text)}>{text}</div>
        <Link onClick={handleClickLearnMore}>Learn more</Link>
      </div>
    </Card>
  );
};

export default CountryOfDomicileFaqCard;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          ":nth-child(1n) > div": {
            height: "100%",
          },
        },
        content: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "18px 24px",
          fontSize: 16,
          lineHeight: "26px",
          boxSizing: "border-box",
          height: "100%",
        },
        text: {
          flex: 1,
          marginBottom: 5,
          textAlign: "center",
        },
        modalContentRoot: {
          padding: "24px 40px",
        },
      }),
    []
  );
};
