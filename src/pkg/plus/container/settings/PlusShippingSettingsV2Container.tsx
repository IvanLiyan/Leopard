import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import {
  Card,
  SearchBox,
  PageIndicator,
  SimpleSelect,
  LoadingIndicator,
} from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";

import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import { useIntQueryParam, useStringQueryParam } from "@toolkit/url";

import Header from "@plus/component/settings/shipping-settings/shipping-profile/Header";
import ShippingProfilesTable from "@plus/component/settings/shipping-settings/shipping-profile/ShippingProfilesTable";
import CreateShippingProfileModal from "@plus/component/settings/shipping-settings/shipping-profile/CreateShippingProfileModal";

import {
  PickedShippingProfileSchema,
  ShippingSettingsInitialData,
} from "@toolkit/shipping-settings-v2";

import {
  ShippingProfileCollectionSchema,
  ShippingProfileCollectionSchemaShippingProfilesArgs,
  ShippingProfileCollectionSchemaShippingProfileCountArgs,
} from "@schema/types";

import { useApolloStore } from "@stores/ApolloStore";

type Props = {
  readonly initialData: ShippingSettingsInitialData;
};

const InputHeight = 30;
const GET_SHIPPING_PROFILES = gql`
  query PlusShippingSettingsV2Container_GetShippingProfiles(
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
        linkedProductCount
      }
    }
  }
`;

const GET_SHIPPING_PROFILES_COUNT = gql`
  query PlusShippingSettingsV2Container_GetShippingProfileCount(
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

const PlusShippingSettingsV2Container: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const { nonBatchingClient } = useApolloStore();

  const [query, setQuery] = useStringQueryParam("q");
  const [rawLimit, setLimit] = useIntQueryParam("limit");
  const [rawOffset, setOffset] = useIntQueryParam("offset");

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

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  const headerActions = (
    <PrimaryButton
      onClick={async () => new CreateShippingProfileModal({}).render()}
      minWidth
    >
      Add new shipping profile
    </PrimaryButton>
  );

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Shipping settings`}
        breadcrumbs={[
          { name: i`Settings`, href: "/plus/settings" },
          { name: i`Shipping`, href: "/plus/settings/shipping" },
        ]}
        actions={headerActions}
        sticky
      />
      <PageGuide>
        <Card className={css(styles.content)}>
          <Header />
          <div className={css(styles.controlsRow)}>
            <SearchBox
              className={css(styles.input)}
              value={query}
              onChange={({ text }) => {
                setQuery(text);
                setOffset(0);
              }}
              placeholder={i`Search`}
              height={InputHeight}
              focusOnMount
            />
            <div className={css(styles.filterControls)}>
              <PageIndicator
                className={css(styles.pageIndicator)}
                rangeStart={offset + 1}
                rangeEnd={Math.min(
                  shippingProfiles?.length ?? 0,
                  offset + limit,
                )}
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
          {shippingProfiles == null ? (
            <LoadingIndicator />
          ) : (
            <ShippingProfilesTable
              className={css(styles.table)}
              shippingProfiles={shippingProfiles}
            />
          )}
        </Card>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        wishExpressCard: {
          marginTop: 25,
        },
        content: {
          marginTop: 25,
        },
        controlsRow: {
          display: "flex",
          justifyContent: "space-between",
          margin: "25px 0px",
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
          // Want min 400 here to prevent search from shrinking
          //eslint-disable-next-line local-rules/no-frozen-width
          minWidth: 400,
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
        table: {
          alignSelf: "stretch",
        },
      }),
    [],
  );

export default observer(PlusShippingSettingsV2Container);
