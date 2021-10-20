import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import {
  Layout,
  Link,
  LoadingIndicator,
  Markdown,
  ObjectId,
  Popover,
  Text,
} from "@ContextLogic/lego";
import RightCard from "@plus/component/products/edit-product/RightCard";
import HorizontalField from "@plus/component/form/HorizontalField";
import ProductEditState from "@plus/model/ProductEditState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import { useDeciderKey } from "@stores/ExperimentStore";
import { zendeskURL } from "@toolkit/url";

export type Props = BaseProps & {
  readonly editState: ProductEditState;
};

const BasicInfoCard: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    editState: {
      id,
      createTime,
      lastUpdateTime,
      disputeId,
      initialState: { categories, eligibleForCategoryDispute },
    },
  } = props;

  const { decision: showRevShare, isLoading: isLoadingShowRevShare } =
    useDeciderKey("rev_share_mplus");

  const styles = useStylesheet();
  if (lastUpdateTime == null || createTime == null || id == null) {
    return null;
  }

  const categoryLearnMoreLink = zendeskURL("4403535077403");
  const disputeCategoryLink = `/product/create-category-dispute/${id}`;
  const categoryDisputesListLink =
    disputeId == null ? "" : `/product-category-dispute/${disputeId}`;

  const disableDispute = eligibleForCategoryDispute != "ELIGIBLE";

  const renderDisputeLink = () => {
    if (disableDispute && disputeId != null) {
      return (
        <Popover
          position="bottom center"
          popoverContent={() => (
            <Markdown
              className={css(styles.popover)}
              text={
                i`Product Category can only be disputed 1 time. To track the status ` +
                i`of the dispute, visit [Product Category Disputes](${categoryDisputesListLink}).`
              }
            />
          )}
        >
          <Text
            className={css(styles.disabledRevShareDisputeLink)}
            weight="semibold"
          >
            Dispute
          </Text>
        </Popover>
      );
    }

    if (disableDispute) {
      return (
        <Text
          className={css(styles.disabledRevShareDisputeLink)}
          weight="semibold"
        >
          Dispute
        </Text>
      );
    }

    return (
      <Link
        className={css(styles.revShareDisputeLink)}
        openInNewTab
        href={disputeCategoryLink}
      >
        Dispute
      </Link>
    );
  };

  return (
    <RightCard className={css(className, style)}>
      {isLoadingShowRevShare ? (
        <LoadingIndicator />
      ) : (
        <>
          <HorizontalField
            title={i`Last updated`}
            style={{ flexWrap: "nowrap" }}
            centerTitleVertically
            className={css(styles.item)}
          >
            {lastUpdateTime.formatted}
          </HorizontalField>
          <HorizontalField
            title={i`Date created`}
            style={{ flexWrap: "nowrap" }}
            centerTitleVertically
            className={css(styles.item)}
          >
            {createTime.formatted}
          </HorizontalField>
          <HorizontalField
            title={i`Product ID`}
            style={{ flexWrap: "nowrap" }}
            centerTitleVertically
            className={css(styles.item)}
          >
            <ObjectId id={id} style={{ padding: 0 }} showFull={false} />
          </HorizontalField>
          {showRevShare && categories != null && categories.length > 0 && (
            <HorizontalField
              title={i`Category`}
              style={{ flexWrap: "nowrap" }}
              className={css(styles.item)}
              popoverContent={
                i`This is the category of this product as determined by Wish, used to calculate ` +
                i`corresponding orders' revenue share percentage. If multiple product categories ` +
                i`are shown here, the category that receives the lowest revenue share is used ` +
                i`for calculation. [Learn more](${categoryLearnMoreLink})`
              }
            >
              <Layout.FlexColumn alignItems="flex-end">
                {categories.map(({ name }) => name).join(", ")}
                {categories.length > 0 && renderDisputeLink()}
              </Layout.FlexColumn>
            </HorizontalField>
          )}
        </>
      )}
    </RightCard>
  );
};

export default observer(BasicInfoCard);

const useStylesheet = () => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        item: {
          paddingBottom: 10,
          ":last-child": {
            paddingBottom: 0,
          },
        },
        popover: {
          padding: 16,
          maxWidth: 265,
        },
        disabledRevShareDisputeLink: {
          fontSize: 15,
          lineHeight: "20px",
          color: textLight,
          cursor: "pointer",
        },
        revShareDisputeLink: {
          fontSize: 15,
          lineHeight: "20px",
        },
      }),
    [textLight],
  );
};
