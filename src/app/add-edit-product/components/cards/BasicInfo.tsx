/*
 * BasicInfo.tsx
 *
 * Created by Jonah Dlin on Wed Nov 10 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import {
  Layout,
  Link,
  Markdown,
  ObjectId,
  Popover,
  Text,
  HorizontalField,
} from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { zendeskURL } from "@core/toolkit/url";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import Section from "./Section";
import { merchFeUrl } from "@core/toolkit/router";

export type Props = BaseProps & {
  readonly state: AddEditProductState;
};

const BasicInfo: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    state: { id, createTime, lastUpdateTime, disputeId, initialState },
  } = props;

  const categories = initialState == null ? undefined : initialState.categories;
  const eligibleForCategoryDispute =
    initialState == null ? undefined : initialState.eligibleForCategoryDispute;

  const styles = useStylesheet();
  if (lastUpdateTime == null || createTime == null || id == null) {
    return null;
  }

  const categoryLearnMoreLink = zendeskURL("4403535077403");
  const disputeCategoryLink = merchFeUrl(
    `/product/create-category-dispute/${id}`,
  );
  const categoryDisputesListLink =
    disputeId == null
      ? ""
      : merchFeUrl(`/product-category-dispute/${disputeId}`);

  const disableDispute = eligibleForCategoryDispute != "ELIGIBLE";

  const renderDisputeLink = () => {
    if (disableDispute && disputeId != null) {
      return (
        <Popover
          position="bottom center"
          popoverContent={() => (
            <Markdown
              style={styles.popover}
              openLinksInNewTab
              text={
                i`Product Category can only be disputed 1 time. To track the status ` +
                i`of the dispute, visit [Product Category Disputes](${categoryDisputesListLink}).`
              }
            />
          )}
        >
          <Text style={styles.disabledRevShareDisputeLink} weight="semibold">
            Dispute
          </Text>
        </Popover>
      );
    }

    if (disableDispute) {
      return (
        <Text style={css(styles.disabledRevShareDisputeLink)} weight="semibold">
          Dispute
        </Text>
      );
    }

    return (
      <Link
        style={css(styles.revShareDisputeLink)}
        openInNewTab
        href={disputeCategoryLink}
      >
        Dispute
      </Link>
    );
  };

  return (
    <Section className={css(className, style)} title={i`Basic info`} alwaysOpen>
      <HorizontalField
        title={i`Last updated`}
        titleAlign="start"
        style={[styles.item]}
        centerTitleVertically
      >
        {lastUpdateTime.formatted}
      </HorizontalField>
      <HorizontalField
        title={i`Date created`}
        titleAlign="start"
        style={[styles.item]}
        centerTitleVertically
      >
        {createTime.formatted}
      </HorizontalField>
      <HorizontalField
        title={i`Product ID`}
        titleAlign="start"
        style={[styles.item]}
        centerTitleVertically
      >
        <ObjectId id={id} style={styles.id} showFull={false} />
      </HorizontalField>
      {categories != null && categories.length > 0 && (
        <HorizontalField
          title={i`Category`}
          titleAlign="start"
          style={[styles.item]}
          popoverContent={
            i`This is the product category, as determined by Wish, used to ` +
            i`calculate merchant commission fees on the corresponding order. ` +
            i`If this field displays multiple product categories, then Wish ` +
            i`uses the category with the lowest merchant commission fees. ` +
            i`[Learn more](${categoryLearnMoreLink})`
          }
        >
          <Layout.FlexColumn>
            {categories.map(({ name }) => name).join(", ")}
            {categories.length > 0 && renderDisputeLink()}
          </Layout.FlexColumn>
        </HorizontalField>
      )}
    </Section>
  );
};

export default observer(BasicInfo);

const useStylesheet = () => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        item: {
          paddingBottom: 10,
          flexWrap: "nowrap",
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
        id: {
          padding: 0,
          width: "fit-content",
        },
      }),
    [textLight],
  );
};
