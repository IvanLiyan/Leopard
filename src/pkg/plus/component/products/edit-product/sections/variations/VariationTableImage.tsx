/*
 *
 * VariationsTableImage.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/24/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import ProductEditState, {
  VariationEditState,
} from "@plus/model/ProductEditState";
import VariationImageModal from "./VariationImageModal";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Illustration } from "@merchant/component/core";

type Props = BaseProps & {
  readonly editState: ProductEditState;
  readonly variation: VariationEditState;
};

const VariationsTableImage: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet(props);
  const {
    style,
    className,
    editState,
    variation,
    variation: { image },
  } = props;

  const rootStyle = css(styles.root, style, className);
  const onClick = () => {
    new VariationImageModal({
      editState,
      initiallySelectedVariation: variation,
    }).render();
  };
  if (image == null) {
    return (
      <Illustration
        className={rootStyle}
        onClick={onClick}
        name="emptyImage"
        alt={i`Please select an image for your variation`}
      />
    );
  }

  return (
    <img
      className={rootStyle}
      draggable="false"
      src={image.wishUrl}
      alt={i`The variation's image`}
      onClick={onClick}
    />
  );
};

const useStylesheet = ({ editState: { isSubmitting } }: Props) =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          width: 55,
          maxHeight: 55,
          borderRadius: 3,
          cursor: isSubmitting ? "default" : "pointer",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
    [isSubmitting]
  );

export default observer(VariationsTableImage);
