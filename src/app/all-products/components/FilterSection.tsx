/*
 * FilterSection.tsx
 *
 * Created by Jonah Dlin on Wed Jun 08 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import {
  Alert,
  CheckboxField,
  Info,
  Layout,
  Link,
  PrimaryButton,
  RadioGroup,
  Text,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import {
  BadgeIcon,
  BadgeTitle,
  ListingStateTitle,
  ProductBadge,
  ListingEnabledUrlSelection,
  ListingEnabledSelectionTitle,
  DefaultStateFilter,
  DefaultEnabledFilter,
  ListingStateUrlSelection,
} from "@all-products/toolkit";
import Illustration from "@core/components/Illustration";
import isEqual from "lodash/isEqual";
import { ci18n } from "@core/toolkit/i18n";
import {
  useStateFilter,
  useEnabledFilter,
  useBadgesFilter,
  useFiltersStatus,
} from "@all-products/stateHooks";
import { useUpsertQueryParams } from "@core/toolkit/url";

type Props = BaseProps;

const StateOptionsOrder: ReadonlyArray<ListingStateUrlSelection> = [
  "ALL",
  "ACTIVE",
  "MERCHANT_INACTIVE",
  "WISH_INACTIVE",
  "REMOVED_BY_MERCHANT",
  "REMOVED_BY_WISH",
];

const EnabledOptionsOrder: ReadonlyArray<ListingEnabledUrlSelection> = [
  "ALL",
  "TRUE",
  "FALSE",
];

const BadgesOptionsOrder: ReadonlyArray<ProductBadge> = [
  "BRANDED",
  "WISH_EXPRESS",
  "YELLOW_BADGE",
  "CLEAN_IMAGE",
  "RETURN_ENROLLED",
];

const FiltersDisabledAlert: React.FC<{ readonly show: boolean }> = ({
  show,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Alert
      sentiment="info"
      text={i`Filters are disabled when searching by ID`}
      style={{ marginBottom: 24 }}
    />
  );
};

const FilterSection: React.FC<Props> = ({ className, style }) => {
  const styles = useStylesheet();

  const [stateFilter, setStateFilter] =
    useState<ListingStateUrlSelection>(DefaultStateFilter);
  const [enabledFilter, setEnabledFilter] =
    useState<ListingEnabledUrlSelection>(DefaultEnabledFilter);
  const [badgesFilter, setBadgesFilter] = useState<ReadonlySet<ProductBadge>>(
    new Set(),
  );

  const upsertQueryParams = useUpsertQueryParams();

  const [urlStateFilter] = useStateFilter();
  const [urlEnabledFilter] = useEnabledFilter();
  const [urlBadgesFilter] = useBadgesFilter();
  const { enabled: areFiltersEnabled, disabled: areFiltersDisabled } =
    useFiltersStatus();

  useEffect(
    () => setStateFilter(urlStateFilter ?? DefaultStateFilter),
    [urlStateFilter],
  );
  useEffect(
    () => setEnabledFilter(urlEnabledFilter ?? DefaultEnabledFilter),
    [urlEnabledFilter],
  );

  const stringifiedBadgesFilter = Array.from(urlBadgesFilter ?? [])
    .sort()
    .join("|");
  useEffect(
    () =>
      setBadgesFilter(urlBadgesFilter == null ? new Set() : urlBadgesFilter),
    // Object dependency changes on each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stringifiedBadgesFilter],
  );

  const hasChanges = useMemo(() => {
    const noStateChanges =
      (stateFilter == DefaultStateFilter && urlStateFilter == null) ||
      stateFilter == urlStateFilter;
    const noEnabledChanges =
      (enabledFilter == DefaultEnabledFilter && urlEnabledFilter == null) ||
      enabledFilter === urlEnabledFilter;
    const noBadgesChanges =
      (badgesFilter.size == 0 && urlBadgesFilter == null) ||
      isEqual(badgesFilter, urlBadgesFilter);

    return !noStateChanges || !noEnabledChanges || !noBadgesChanges;
  }, [
    stateFilter,
    urlStateFilter,
    enabledFilter,
    urlEnabledFilter,
    badgesFilter,
    urlBadgesFilter,
  ]);

  const clearAll = () => {
    setStateFilter("ALL");
    setEnabledFilter("ALL");
    setBadgesFilter(new Set());
  };

  const submit = async () => {
    await upsertQueryParams({
      // keys here need to be the same as the ones in stateHooks.ts
      state: stateFilter == DefaultStateFilter ? undefined : stateFilter,
      enabled:
        enabledFilter == DefaultEnabledFilter ? undefined : enabledFilter,
      badges: badgesFilter,
    });
  };

  return (
    <Layout.FlexColumn style={[className, style]}>
      <FiltersDisabledAlert show={areFiltersDisabled} />
      <Layout.FlexRow justifyContent="space-between" alignItems="flex-start">
        <Layout.FlexRow style={styles.filtersRow} alignItems="flex-start">
          <Layout.FlexColumn style={styles.filterColumn}>
            <Layout.FlexRow
              style={[
                styles.filterColumnTitleRow,
                areFiltersDisabled && styles.disabled,
              ]}
            >
              <Text style={styles.filterColumnTitle} weight="semibold">
                {ci18n("Meaning the state of a product listing", "State")}
              </Text>
              <Info text={`State Popup Placeholder`} />
            </Layout.FlexRow>
            <RadioGroup
              disabled={areFiltersDisabled}
              selectedValue={areFiltersEnabled ? stateFilter : undefined}
              onSelected={(value: ListingStateUrlSelection) =>
                setStateFilter(value)
              }
              itemStyle={{
                ":not(:last-child)": {
                  marginBottom: 4,
                },
                ":last-child": {
                  marginBottom: 0,
                },
              }}
            >
              {StateOptionsOrder.map((stateOption) =>
                stateOption == "ALL" ? (
                  <RadioGroup.Item
                    key={stateOption}
                    value={stateOption}
                    data-cy={`radio-option-state-${stateOption}`}
                    text={() => (
                      <Text style={styles.filterOptionText} weight="regular">
                        {ci18n(
                          "Option in a list of options, selecting it means seeing not applying this filter",
                          "All",
                        )}
                      </Text>
                    )}
                  />
                ) : (
                  <RadioGroup.Item
                    key={stateOption}
                    value={stateOption}
                    data-cy={`radio-option-state-${stateOption}`}
                    text={() => (
                      <Text style={styles.filterOptionText} weight="regular">
                        {ListingStateTitle[stateOption]}
                      </Text>
                    )}
                  />
                ),
              )}
            </RadioGroup>
          </Layout.FlexColumn>
          <Layout.FlexColumn style={styles.filterColumn}>
            <Layout.FlexRow
              style={[
                styles.filterColumnTitleRow,
                areFiltersDisabled && styles.disabled,
              ]}
            >
              <Text style={styles.filterColumnTitle} weight="semibold">
                {ci18n(
                  "Meaning whether a listing is enabled or not",
                  "Listing Enabled",
                )}
              </Text>
              <Info text={`Listing Enabled Popup Placeholder`} />
            </Layout.FlexRow>
            <RadioGroup
              selectedValue={areFiltersEnabled ? enabledFilter : undefined}
              onSelected={(value: ListingEnabledUrlSelection) =>
                setEnabledFilter(value)
              }
              itemStyle={{
                ":not(:last-child)": {
                  marginBottom: 4,
                },
                ":last-child": {
                  marginBottom: 0,
                },
              }}
              disabled={areFiltersDisabled}
            >
              {EnabledOptionsOrder.map((enabledOption) => (
                <RadioGroup.Item
                  key={enabledOption}
                  value={enabledOption}
                  data-cy={`radio-option-enabled-${enabledOption}`}
                  text={() => (
                    <Text style={styles.filterOptionText} weight="regular">
                      {ListingEnabledSelectionTitle[enabledOption]}
                    </Text>
                  )}
                />
              ))}
            </RadioGroup>
          </Layout.FlexColumn>
          <Layout.FlexColumn style={styles.filterColumn}>
            <Layout.FlexRow
              style={[
                styles.filterColumnTitleRow,
                areFiltersDisabled && styles.disabled,
              ]}
            >
              <Text style={styles.filterColumnTitle} weight="semibold">
                {ci18n(
                  "meaning badges on a product. A badge is an attribute that appears as an icon to the merchant on their product listing, e.g. wish express",
                  "Badges",
                )}
              </Text>
              <Info text={`Badges Popup Placeholder`} />
            </Layout.FlexRow>
            <Layout.FlexColumn style={styles.checkboxColumn}>
              {BadgesOptionsOrder.map((badge) => (
                <CheckboxField
                  key={badge}
                  onChange={(checked) => {
                    const newBadges = new Set(badgesFilter);
                    if (checked && !badgesFilter.has(badge)) {
                      newBadges.add(badge);
                    } else if (!checked && badgesFilter.has(badge)) {
                      newBadges.delete(badge);
                    }
                    setBadgesFilter(newBadges);
                  }}
                  checked={areFiltersEnabled ? badgesFilter.has(badge) : false}
                  disabled={areFiltersDisabled}
                >
                  <Layout.FlexRow
                    style={[
                      styles.checkboxTitle,
                      areFiltersDisabled && styles.disabled,
                    ]}
                    justifyContent="space-between"
                    data-cy={`checkbox-field-option-badges-${badge}`}
                  >
                    <Text style={styles.filterOptionText}>
                      {BadgeTitle[badge]}
                    </Text>
                    <Illustration
                      style={styles.checkboxImage}
                      name={BadgeIcon[badge]}
                      alt={BadgeTitle[badge]}
                    />
                  </Layout.FlexRow>
                </CheckboxField>
              ))}
            </Layout.FlexColumn>
          </Layout.FlexColumn>
        </Layout.FlexRow>
        <Layout.FlexRow style={styles.controls}>
          <Link
            onClick={() => clearAll()}
            style={
              areFiltersDisabled && [
                styles.disabled,
                styles.disableUserInteraction,
              ]
            }
          >
            {ci18n(
              "Text on a button that when clicked clears the selection of filters",
              "Clear all",
            )}
          </Link>
          <PrimaryButton
            onClick={() => submit()}
            isDisabled={!hasChanges || areFiltersDisabled}
            data-cy="filter-section-apply-button"
          >
            {ci18n(
              "Text on a button that when clicked applies the selected filters",
              "Apply",
            )}
          </PrimaryButton>
        </Layout.FlexRow>
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        filtersRow: {
          gap: 24,
          marginRight: 24,
          flexGrow: 1,
        },
        filterColumn: {
          flexBasis: 236,
          flexShrink: 1,
        },
        controls: {
          gap: 8,
        },
        checkboxTitle: {
          gap: 8,
          flex: 1,
        },
        filterColumnTitleRow: {
          gap: 4,
          marginBottom: 4,
        },
        filterColumnTitle: {
          color: textBlack,
          size: 14,
          lineHeight: "20px",
        },
        checkboxImage: {
          width: 16,
          height: 16,
        },
        checkboxColumn: {
          maxWidth: "fit-content",
          gap: 4,
        },
        radioGroupItem: {
          ":not(:last-child)": {
            marginBottom: 4,
          },
          ":last-child": {
            marginBottom: 0,
          },
        },
        filterOptionText: {
          color: textBlack,
          fontSize: 14,
          lineHeight: "20px",
        },
        disabled: {
          opacity: 0.6, // taken from Lego
        },
        disableUserInteraction: {
          pointerEvents: "none",
        },
      }),
    [textBlack],
  );
};

export default observer(FilterSection);
