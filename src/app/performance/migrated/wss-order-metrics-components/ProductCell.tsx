import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";

/* Lego Components */
import { Layout, Link, ObjectId } from "@ContextLogic/lego";

/* Merchant Components */
import ProductDetailModal from "@core/components/products/ProductDetailModal";
import ProductImage from "@core/components/products/ProductImage";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";

type ProductCellProps = BaseProps & {
  readonly id: string;
  readonly name?: string | null;
  readonly imageSize?: string | number;
  readonly showFullId?: boolean;
  readonly imgURL?: string | null;
};

const ProductCell: React.FC<ProductCellProps> = ({
  className,
  style,
  id,
  name,
  imageSize,
  showFullId,
  imgURL,
}: ProductCellProps) => {
  const styles = useStyleSheet({ imageSize });
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ProductDetailModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        productId={id}
      />
      <Layout.FlexRow style={[className, style]}>
        {imgURL ? (
          <ProductImage imageUrl={imgURL} style={styles.productImage} />
        ) : (
          <ProductImage productId={id} style={styles.productImage} />
        )}
        <Layout.FlexColumn style={styles.rightColumn} alignItems="flex-start">
          {name && (
            <Link
              style={styles.productName}
              openInNewTab
              onClick={() => {
                setModalOpen(true);
              }}
            >
              {name}
            </Link>
          )}
          <ObjectId style={styles.objectId} id={id} showFull={showFullId} />
        </Layout.FlexColumn>
      </Layout.FlexRow>
    </>
  );
};

const DEFAULT_IMAGE_SIZE = 40;

const useStyleSheet = ({ imageSize }: { imageSize?: string | number }) => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        productImage: {
          height: imageSize || DEFAULT_IMAGE_SIZE,
          width: imageSize || DEFAULT_IMAGE_SIZE,
          maxWidth: "none",
          borderRadius: 4,
        },
        productName: {
          fontSize: 14,
          lineHeight: "20px",
          maxHeight: 40,
          maxWidth: 280,
          color: textBlack,
          overflow: "hidden",
          whiteSpace: "pre-wrap",
          textOverflow: "ellipsis",
          // @ts-expect-error  legacy code
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
        },
        rightColumn: {
          margin: "0 8px",
        },
        objectId: {
          padding: "0px 4px",
        },
      }),
    [imageSize, textBlack],
  );
};

export default observer(ProductCell);
