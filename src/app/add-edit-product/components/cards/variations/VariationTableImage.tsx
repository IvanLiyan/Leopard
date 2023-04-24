/*
 * VariationTableImage.tsx
 *
 * Created by Jonah Dlin on Tue Oct 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import VariationImageModal from "./VariationImageModal";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration from "@core/components/Illustration";
import AddEditProductState, {
  Variation,
} from "@add-edit-product/AddEditProductState";
import { Layout } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import Image from "@core/components/Image";

type Props = BaseProps & {
  readonly state: AddEditProductState;
  readonly variation: Variation;
};

const VariationsTableImage: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet(props);
  const {
    style,
    className,
    state,
    variation,
    variation: { image },
  } = props;
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  const onImageClicked = () => {
    setIsImageModalOpen(true);
  };

  if (image == null) {
    return (
      <>
        <VariationImageModal
          open={isImageModalOpen}
          state={state}
          onClose={() => {
            setIsImageModalOpen(false);
          }}
          initiallySelectedVariation={variation}
        />
        <Illustration
          className={css(styles.placeholder, style, className)}
          onClick={onImageClicked}
          name="emptyImage"
          alt={i`Please select an image for your variation`}
        />
      </>
    );
  }

  return (
    <>
      <VariationImageModal
        open={isImageModalOpen}
        state={state}
        onClose={() => {
          setIsImageModalOpen(false);
        }}
        initiallySelectedVariation={variation}
      />
      <Layout.FlexColumn
        key={image.wishUrl}
        style={[styles.imageContainer, style, className]}
        justifyContent="center"
        alignItems="center"
        onClick={onImageClicked}
      >
        <Image
          className={css(styles.image)}
          draggable="false"
          src={image.wishUrl}
          alt={i`The variation's image`}
        />
      </Layout.FlexColumn>
    </>
  );
};

const useStylesheet = ({ state: { isSubmitting } }: Props) => {
  const { surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        placeholder: {
          width: 40,
          maxHeight: 40,
          borderRadius: 4,
          cursor: isSubmitting ? "default" : "pointer",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        imageContainer: {
          width: 40,
          height: 40,
          borderRadius: 4,
          backgroundColor: surfaceLightest,
          overflow: "hidden",
          cursor: isSubmitting ? "default" : "pointer",
        },
        image: {
          maxHeight: "100%",
          maxWidth: "100%",
        },
      }),
    [isSubmitting, surfaceLightest],
  );
};

export default observer(VariationsTableImage);
