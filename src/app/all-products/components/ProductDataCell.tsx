/*
 * ProductDataCell.tsx
 *
 * Created by Jonah Dlin on Thu Apr 28 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import {
  Layout,
  Link,
  Markdown,
  ObjectId,
  Popover,
  Text,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import Illustration from "@core/components/Illustration";
import { ProductBadge, BadgeTitle, BadgeIcon } from "@all-products/toolkit";
import ProductDetailModal from "@core/components/products/ProductDetailModal";
import { zendeskURL } from "@core/toolkit/url";
import { merchFeURL } from "@core/toolkit/router";
import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps & {
  readonly name: string;
  readonly id: string;
  readonly badges: ReadonlyArray<ProductBadge>;
};

const ProductDataCell: React.FC<Props> = ({
  className,
  style,
  name,
  id,
  badges,
}) => {
  const styles = useStylesheet();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const BadgeTooltips: { readonly [T in ProductBadge]: () => React.ReactNode } =
    {
      // Name of constant in string union type
      /* eslint-disable @typescript-eslint/naming-convention */
      BRANDED: () => (
        <Layout.FlexColumn style={styles.tooltipContainer}>
          <Text style={styles.tooltipTitle} weight="semibold">
            {ci18n(
              "Header of tooltip describing an attribute of a product. Means the product has been associated with a brand",
              "Branded Product",
            )}
          </Text>
          <Markdown
            style={styles.tooltipContent}
            openLinksInNewTab
            text={
              i`This is a branded product listing. You can view and improve your ` +
              i`performance on [Branded Products](${merchFeURL(
                "/branded-products",
              )}). Make ` +
              i`your authentic branded products stand out by properly tagging ` +
              i`your listings. [Learn more](${zendeskURL("360044649073")})`
            }
          />
        </Layout.FlexColumn>
      ),
      WISH_EXPRESS: () => (
        <Markdown
          style={[styles.tooltipContent, styles.tooltipContainer]}
          openLinksInNewTab
          text={
            i`This product is shipped quickly and is admitted into the Wish Express ` +
            i`program. [Learn more](${zendeskURL("231264967")})`
          }
        />
      ),
      YELLOW_BADGE: () => (
        <Markdown
          style={[styles.tooltipContent, styles.tooltipContainer]}
          openLinksInNewTab
          text={i`This product is popular and has generated a lot of sales. [Learn more](${zendeskURL(
            "205212507",
          )})`}
        />
      ),
      CLEAN_IMAGE: () => (
        <Layout.FlexColumn style={styles.tooltipContainer}>
          <Text style={styles.tooltipTitle} weight="semibold">
            Clean image Selected
          </Text>
          <Markdown
            style={styles.tooltipContent}
            openLinksInNewTab
            text={
              i`Products with a high quality clean image selected may receive ` +
              i`increased sales and impressions. [Learn more](${zendeskURL(
                "360033668153",
              )})`
            }
          />
        </Layout.FlexColumn>
      ),
      RETURN_ENROLLED: () => (
        <Layout.FlexColumn style={styles.tooltipContainer}>
          <Text style={styles.tooltipTitle} weight="semibold">
            Enrolled in Wish Returns Program
          </Text>
          <Markdown
            style={styles.tooltipContent}
            openLinksInNewTab
            text={
              i`This product is enrolled in the Wish Returns Program. Customers ` +
              i`based in regions supported by the program will have to return ` +
              i`the products to the specified address before receiving ` +
              i`refunds. [Learn more](${zendeskURL("360050732014")})`
            }
          />
        </Layout.FlexColumn>
      ),
      /* eslint-enable @typescript-eslint/naming-convention */
    };

  return (
    <Layout.FlexColumn
      style={[className, style]}
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <ProductDetailModal
        productId={id}
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
      <Link
        style={styles.productName}
        onClick={() => {
          setIsDetailModalOpen(true);
        }}
      >
        {name}
      </Link>
      <ObjectId id={id} showFull style={styles.objectId} />
      {badges.length > 0 && (
        <Layout.FlexRow style={styles.badges}>
          {badges.map((badge) => (
            <Popover
              popoverMaxWidth={320}
              popoverContent={BadgeTooltips[badge]}
              key={badge}
            >
              <Illustration
                style={styles.badge}
                name={BadgeIcon[badge]}
                alt={BadgeTitle[badge]}
              />
            </Popover>
          ))}
        </Layout.FlexRow>
      )}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textLight, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        productName: {
          maxWidth: 320,
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        badges: {
          gap: 8,
          flexWrap: "wrap",
        },
        tooltipTitle: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
          marginBottom: 8,
        },
        tooltipContent: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
        },
        badge: {
          height: 24,
          width: 24,
        },
        tooltipContainer: {
          padding: 16,
          maxWidth: 320,
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        objectId: {
          color: textLight,
          padding: "4px 0px",
        },
      }),
    [textLight, textBlack],
  );
};

export default observer(ProductDataCell);
