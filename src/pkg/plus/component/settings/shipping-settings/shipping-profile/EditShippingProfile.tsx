/*
 *
 * EditShippingProfile.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 9/17/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import _ from "lodash";

import Fuse from "fuse.js";

import { css } from "@toolkit/styling";
import {
  SearchBox,
  FilterButton,
  SimpleSelect,
  PageIndicator,
  MultiSecondaryButton,
} from "@ContextLogic/lego";
import { RowSelectionArgs } from "@ContextLogic/lego";
import EditShippingProfileUpperArea from "./EditShippingProfileUpperArea";
import ShippingProfileDestinationTable from "./ShippingProfileDestinationTable";
import { PrimaryButton } from "@ContextLogic/lego";

import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import { useTheme } from "@stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import ShippingProfileState, {
  ShippingProfileDestinationState,
} from "@plus/model/ShippingProfileState";

const InputHeight = 30;

type Props = BaseProps & {
  readonly profileState: ShippingProfileState;
};

const EditShippingProfile = (props: Props) => {
  const styles = useStylesheet();
  const { className, style, profileState } = props;

  const [selectedRowIndeces, setSelectedRowIndeces] = useState<Set<number>>(
    new Set(),
  );

  const [rawQuery, setRawQuery] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);

  const destinations: ReadonlyArray<ShippingProfileDestinationState> = useMemo(
    () => profileState?.allDestinations ?? [],
    [profileState],
  );
  const debouncedQuery = useDebouncer(rawQuery, 500);
  const fuse = useFuse(destinations);
  const query: string | undefined =
    debouncedQuery.trim().length == 0 ? undefined : debouncedQuery.trim();

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
    setSelectedRowIndeces(new Set());
  };

  const onRowSelectionToggled = ({
    index,
    selected,
  }: RowSelectionArgs<unknown>) => {
    if (selected) {
      selectedRowIndeces.add(index);
    } else {
      selectedRowIndeces.delete(index);
    }
    setSelectedRowIndeces(new Set(selectedRowIndeces));
  };

  const results: ReadonlyArray<ShippingProfileDestinationState> =
    useMemo(() => {
      let results: ReadonlyArray<ShippingProfileDestinationState> =
        destinations;
      if (query != null) {
        const fuseResults = fuse.search(query);
        results = fuseResults.map((result) => result.item);
      }

      if (query != null) {
        return results;
      }

      return _.sortBy(
        results,
        ({ country }) => country?.gmvRank ?? Number.MAX_SAFE_INTEGER,
      );
    }, [query, destinations, fuse]);

  const pageResults = useMemo(
    () => results.slice(offset, limit + offset),
    [results, limit, offset],
  );

  const resetPagination = () => {
    setOffset(0);
    setSelectedRowIndeces(new Set());
  };

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.content)}>
        <EditShippingProfileUpperArea profileState={profileState} />
        <div className={css(styles.controlsRow)}>
          <SearchBox
            className={css(styles.input)}
            value={rawQuery}
            onChange={({ text }) => {
              setRawQuery(text);
              resetPagination();
            }}
            placeholder={i`Search by destination`}
            height={30}
            focusOnMount
          />
          <div className={css(styles.filterControls)}>
            <PageIndicator
              className={css(styles.pageIndicator)}
              rangeStart={offset + 1}
              rangeEnd={Math.min(offset + pageResults.length, offset + limit)}
              hasNext={limit + offset < results.length}
              hasPrev={offset > 0}
              currentPage={Math.ceil(offset / limit)}
              totalItems={results.length}
              onPageChange={onPageChange}
            />

            <SimpleSelect
              options={[10, 50, destinations.length].map((v) => ({
                value: v.toString(),
                text: v == destinations.length ? i`All` : v.toString(),
              }))}
              onSelected={(value: string) => {
                setLimit(parseInt(value));
                resetPagination();
              }}
              className={css(styles.limitSelect)}
              selectedValue={limit.toString()}
            />
            <FilterButton className={css(styles.filterButton)} />
          </div>
        </div>
        <ShippingProfileDestinationTable
          data={pageResults}
          onRowSelectionToggled={onRowSelectionToggled}
          selectedRowIndeces={Array.from(selectedRowIndeces)}
          profileState={profileState}
        />
      </div>
      <div className={css(styles.footer)}>
        <MultiSecondaryButton
          actions={[
            {
              text: i`Add destination`,
              onClick: async () => {
                profileState.createDraftDestination();
                setRawQuery("");
                resetPagination();
              },
            },
            {
              text: i`Add top Wish countries`,
              onClick: async () => {
                profileState.createDraftDestination("top-countries");
                setRawQuery("");
                resetPagination();
              },
            },
            {
              text: i`Add top European countries`,
              onClick: async () => {
                profileState.createDraftDestination("top-eu");
                setRawQuery("");
                resetPagination();
              },
            },
            {
              text: i`Add all countries`,
              onClick: async () => {
                profileState.createDraftDestination("all");
                setRawQuery("");
                resetPagination();
              },
            },
          ]}
          dropDownContentWidth={225}
        />
        <PrimaryButton
          onClick={() => profileState.submit()}
          isDisabled={!profileState.canSave}
        >
          Save
        </PrimaryButton>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { borderPrimary, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          "@media (max-width: 900px)": {
            alignItems: "stretch",
          },
        },
        content: {
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          minHeight: 570,
          paddingBottom: 100,
        },
        footer: {
          display: "flex",
          alignSelf: "stretch",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          borderTop: `1px solid ${borderPrimary}`,
          padding: "20px 20px",
          backgroundColor: surfaceLightest,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
        },
        footerButton: {
          height: 80,
          width: 100,
        },
        controlsRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "12px 0px",
          padding: "15px 20px",
          maxWidth: "100%",
          borderTop: `1px solid ${borderPrimary}`,
        },
        input: {
          // Want min 200 here to prevent search from shrinking
          //eslint-disable-next-line local-rules/no-frozen-width
          minWidth: 275,
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
        filterButton: {
          margin: "0px 10px",
          height: InputHeight,
        },
      }),
    [borderPrimary, surfaceLightest],
  );
};

const useFuse = (
  profileDestinations: ReadonlyArray<ShippingProfileDestinationState>,
): Fuse<ShippingProfileDestinationState, any> => {
  return useMemo((): Fuse<ShippingProfileDestinationState, any> => {
    const documents: ReadonlyArray<ShippingProfileDestinationState> = [
      ...profileDestinations,
    ];
    const keys: ReadonlyArray<string> = ["country.name", "country.code"];
    const options = {
      includeScore: true,
      threshold: 0.4,
      distance: 100,
      keys: keys as string[],
    };

    const index = Fuse.createIndex(keys as string[], documents);

    return new Fuse(documents, options, index);
  }, [profileDestinations]);
};
export default observer(EditShippingProfile);
