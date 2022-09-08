/*
 * BoxIconGroup.tsx
 *
 * Created by Jonah Dlin on Fri Jul 23 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";
import range from "lodash/range";

/* Lego Components */
import { Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { useTheme } from "@stores/ThemeStore";
import Icon from "@merchant/component/core/Icon";
import { ProductListingPlanTier } from "@schema/types";

type Props = BaseProps & {
  readonly tier: ProductListingPlanTier;
  readonly flat?: boolean;
  readonly size?: number;
};

const BoxIconGroup: React.FC<Props> = ({
  className,
  style,
  tier,
  flat,
  size = 32,
}: Props) => {
  const { primary } = useTheme();

  if (flat) {
    const TierBoxAmount: { readonly [T in ProductListingPlanTier]: number } = {
      TIER_ONE: 1,
      TIER_TWO: 2,
      TIER_THREE: 3,
    };
    return (
      <Layout.FlexRow style={[className, style]}>
        {range(TierBoxAmount[tier]).map((index) => (
          <Icon
            key={`${tier}icon${index}`}
            size={size}
            name="box"
            color={primary}
          />
        ))}
      </Layout.FlexRow>
    );
  }

  if (tier == "TIER_ONE") {
    return (
      <Layout.FlexRow style={[className, style]}>
        <Icon size={size} name="box" color={primary} />
      </Layout.FlexRow>
    );
  }
  if (tier == "TIER_TWO") {
    return (
      <Layout.FlexRow style={[className, style]}>
        <Icon size={size} name="box" color={primary} />
        <Icon size={size} name="box" color={primary} />
      </Layout.FlexRow>
    );
  }
  return (
    <Layout.FlexColumn
      style={[className, style]}
      alignItems="stretch"
      justifyContent="center"
    >
      <Layout.FlexRow justifyContent="center">
        <Icon size={size} name="box" color={primary} />
      </Layout.FlexRow>
      <Layout.FlexRow>
        <Icon size={size} name="box" color={primary} />
        <Icon size={size} name="box" color={primary} />
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default observer(BoxIconGroup);
