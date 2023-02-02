import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import ProductImage from "@core/components/products/ProductImage";
import ProductDetailModal from "@core/components/products/ProductDetailModal";
import { css } from "@core/toolkit/styling";

type Props = BaseProps & {
  readonly productId: string;
};

const ClickableProductImage: React.FC<Props> = ({
  className,
  style,
  productId,
}) => {
  const styles = useStylesheet();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ProductDetailModal
        productId={productId}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div
        className={css(styles.root, className, style)}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <ProductImage productId={productId} />
      </div>
    </>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderRadius: 4,
          cursor: "pointer",
        },
      }),
    [],
  );
};

export default observer(ClickableProductImage);
