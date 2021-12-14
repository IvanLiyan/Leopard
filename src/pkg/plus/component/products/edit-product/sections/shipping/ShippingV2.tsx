/*
 *
 * ShippingV2.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 9/17/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

import {
  SearchBox,
  Markdown,
  SimpleSelect,
  PageIndicator,
  LoadingIndicator,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import ShippingProfileOption from "./ShippingProfileOption";
import AddShippingProfileOption from "./AddShippingProfileOption";

import Section, {
  SectionProps,
} from "@plus/component/products/edit-product/Section";
import { useTheme } from "@stores/ThemeStore";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

import ProductEditState from "@plus/model/ProductEditState";
import { useApolloStore } from "@stores/ApolloStore";
import { PickedShippingProfileSchema } from "@toolkit/product-edit";

import {
  ShippingProfileCollectionSchema,
  ShippingProfileCollectionSchemaShippingProfilesArgs,
  ShippingProfileCollectionSchemaShippingProfileCountArgs,
} from "@schema/types";

const GET_SHIPPING_PROFILES = gql`
  query ShippingV2_GetShippingProfiles(
    $offset: Int!
    $limit: Int!
    $query: String
    $searchType: ShippingProfileSearchType
  ) {
    shippingProfileCollection {
      shippingProfiles(
        offset: $offset
        limit: $limit
        query: $query
        searchType: $searchType
      ) {
        id
        name
        description
      }
    }
  }
`;

const GET_SHIPPING_PROFILES_COUNT = gql`
  query ShippingV2_GetShippingProfileCount(
    $query: String
    $searchType: ShippingProfileSearchType
  ) {
    shippingProfileCollection {
      shippingProfileCount(query: $query, searchType: $searchType)
    }
  }
`;

type GetShippingProfilesResponseType = {
  readonly shippingProfileCollection: {
    readonly shippingProfiles: ReadonlyArray<PickedShippingProfileSchema>;
  };
};

type GetShippingProfilesCountResponseType = {
  readonly shippingProfileCollection: Pick<
    ShippingProfileCollectionSchema,
    "shippingProfileCount"
  >;
};

type Props = Omit<SectionProps, "title"> & {
  readonly editState: ProductEditState;
  readonly showTip: boolean;
};
const InputHeight = 30;

const ShippingV2: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, editState, showTip, ...sectionProps } = props;

  const { canManageShipping } = editState;
  const [isOpen, setIsOpen] = useState(true);
  const { nonBatchingClient } = useApolloStore();

  const [query, setQuery] = useState<string>("");
  const [rawLimit, setLimit] = useState<number>(10);
  const [rawOffset, setOffset] = useState<number>(0);

  const limit = rawLimit || 10;
  const offset = rawOffset || 0;

  const debouncedQuery = useDebouncer(query, 800);
  const searchQuery =
    debouncedQuery.trim().length == 0 ? undefined : debouncedQuery.trim();

  const searchType = "PROFILE_NAME";
  const { data: profilesData, loading: profilesLoading } = useQuery<
    GetShippingProfilesResponseType,
    ShippingProfileCollectionSchemaShippingProfilesArgs
  >(GET_SHIPPING_PROFILES, {
    variables: {
      offset,
      limit,
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
    },
    fetchPolicy: "no-cache",
  });

  const { data: profileCountData, loading: profileCountLoading } = useQuery<
    GetShippingProfilesCountResponseType,
    ShippingProfileCollectionSchemaShippingProfileCountArgs
  >(GET_SHIPPING_PROFILES_COUNT, {
    client: nonBatchingClient,
    variables: {
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
    },
    fetchPolicy: "no-cache",
  });

  const shippingProfiles =
    profilesData?.shippingProfileCollection.shippingProfiles;

  const totalProfileCount =
    profileCountData?.shippingProfileCollection.shippingProfileCount;

  const { [0]: firstShippingProfile } = shippingProfiles ?? [];
  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  if (!canManageShipping) {
    return null;
  }

  return (
    <Section
      className={css(style, className)}
      style={{ overflow: "visible" }}
      title={i`Shipping`}
      contentStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        padding: 0,
      }}
      isOpen={isOpen}
      onOpenToggled={setIsOpen}
      rightCard={
        showTip ? (
          <Section title={i`What should I know?`} isTip>
            <Markdown
              text={
                i`Grow your business by selling and shipping internationally. ` +
                i`Enable more countries or regions in your ` +
                i`[Shipping Settings](${"/plus/settings/shipping"}).`
              }
            />
          </Section>
        ) : undefined
      }
      {...sectionProps}
    >
      <div className={css(styles.controlsRow)}>
        <SearchBox
          className={css(styles.input)}
          value={query}
          onChange={({ text }) => {
            setQuery(text);
            setOffset(0);
          }}
          placeholder={i`Search for a profile`}
          height={InputHeight}
          debugValue={firstShippingProfile?.name}
        />
        <div className={css(styles.filterControls)}>
          <PageIndicator
            className={css(styles.pageIndicator)}
            rangeStart={offset + 1}
            rangeEnd={Math.min(shippingProfiles?.length ?? 0, offset + limit)}
            hasNext={limit + offset < (shippingProfiles?.length ?? 0)}
            hasPrev={offset > 0}
            currentPage={Math.ceil(offset / limit)}
            totalItems={totalProfileCount}
            isLoading={profilesLoading || profileCountLoading}
            onPageChange={onPageChange}
          />

          <SimpleSelect
            options={[10, 50, 100].map((v) => ({
              value: v.toString(),
              text: v.toString(),
            }))}
            onSelected={(value: string) => {
              setLimit(parseInt(value));
            }}
            className={css(styles.limitSelect)}
            selectedValue={limit.toString()}
          />
        </div>
      </div>
      {shippingProfiles ? (
        <>
          {shippingProfiles.map((shippingProfile) => (
            <ShippingProfileOption
              key={shippingProfile.id}
              shippingProfile={shippingProfile}
              className={css(styles.profile)}
            />
          ))}
          <AddShippingProfileOption />
        </>
      ) : (
        <LoadingIndicator />
      )}
    </Section>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        profile: {
          borderBottom: `1px solid ${borderPrimary}`,
        },
        controlsRow: {
          display: "flex",

          justifyContent: "space-between",
          marginTop: 25,
          padding: "0px 20px",
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            alignItems: "center",
          },
        },
        input: {
          // Want min 250 here to prevent search from shrinking
          //eslint-disable-next-line local-rules/no-frozen-width
          minWidth: 300,
        },
        limitSelect: {
          flex: 0,
          marginLeft: 10,
        },
        filterControls: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "stretch",
          justifyContent: "flex-end",
        },
        pageIndicator: {
          height: InputHeight,
        },
      }),
    [borderPrimary],
  );
};

export default observer(ShippingV2);
