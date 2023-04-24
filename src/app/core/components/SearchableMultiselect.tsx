/*
 * SearchableMultiselect.tsx
 *
 * Created by Jonah Dlin on Wed Apr 13 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import Fuse from "fuse.js";

import PopperUnstyled from "@mui/base/PopperUnstyled";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTheme as useAtlasTheme } from "@ContextLogic/atlas-ui";

import {
  Layout,
  TextInput,
  CheckboxField,
  Token,
  Text,
} from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import Icon from "@core/components/Icon";

export type SearchableMultiselectOption<T extends string> = {
  readonly key: T;
  readonly value: string;
};

type SearchableMultiselectProps<T extends string> = BaseProps & {
  readonly options: ReadonlyArray<SearchableMultiselectOption<T>>;
  readonly selectedOptions: ReadonlyArray<T>;
  readonly onSelectionChange: (selection: ReadonlyArray<T>) => unknown;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly searchable?: boolean;
  readonly tokenColor?: string;
  readonly borderColor?: string;
};

const CheckboxHeight = 20;
const CheckboxMargin = 12;
const CheckboxesPerPage = 7;
const InitialCheckboxesRendered = 50;

const SearchableMultiselect = <T extends string>({
  className,
  style,
  options,
  selectedOptions,
  onSelectionChange,
  placeholder,
  disabled = false,
  searchable = true,
  tokenColor,
  borderColor,
  "data-cy": dataCy,
}: SearchableMultiselectProps<T>): React.ReactElement => {
  const styles = useStylesheet(tokenColor);
  const { secondary, textDark, borderPrimary } = useTheme();
  const { zIndex } = useAtlasTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [renderTo, setRenderTo] = useState(InitialCheckboxesRendered);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const checkboxesRef = useRef<HTMLDivElement | null>(null);

  const fuse = useFuse(options);

  const trimmedQuery = query == null ? null : query.trim();
  const debouncedQuery = useDebouncer(trimmedQuery, 300);

  const filteredData = useMemo(() => {
    return debouncedQuery
      ? fuse.search(debouncedQuery).map((result) => result.item)
      : options;
  }, [debouncedQuery, fuse, options]);

  const handleClose = () => {
    setQuery(null);
    setRenderTo(InitialCheckboxesRendered);
    setOpen(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPx = (e.target as HTMLDivElement).scrollTop;
    const bottomMostCheckbox =
      Math.floor(scrollPx / (CheckboxHeight + CheckboxMargin)) +
      CheckboxesPerPage;

    if (bottomMostCheckbox + CheckboxesPerPage * 2 > renderTo) {
      setRenderTo(renderTo + InitialCheckboxesRendered);
    }
  };

  const optionsMap = useMemo(
    () =>
      options.reduce<Map<T, string>>((acc, { key, value }) => {
        acc.set(key, value);
        return acc;
      }, new Map()),
    [options],
  );

  const toggleOption = ({
    key,
    checked,
  }: {
    readonly key: T;
    readonly checked: boolean;
  }) => {
    if (checked && !selectedOptions.includes(key)) {
      onSelectionChange([...selectedOptions, key]);
      return;
    }

    if (!checked && selectedOptions.includes(key)) {
      onSelectionChange(
        selectedOptions.filter((selectedOption) => selectedOption != key),
      );
      return;
    }
  };

  return (
    <>
      <Layout.FlexRow
        ref={triggerRef}
        style={[
          styles.box,
          {
            border: `1px solid ${
              borderColor ? borderColor : open ? secondary : borderPrimary
            }`,
          },
          disabled ? { cursor: "auto" } : { cursor: "pointer" },
          className,
          style,
        ]}
        onClick={() => {
          if (disabled) {
            return;
          }
          if (open) {
            handleClose();
            return;
          }
          setOpen(true);
        }}
        justifyContent="space-between"
        data-cy={dataCy}
      >
        {selectedOptions.length > 0 ? (
          <Layout.FlexRow
            style={styles.tokenContainer}
            onClick={(e) => {
              // prevents toggling popover when tokens are clicked
              e.stopPropagation();
            }}
          >
            {selectedOptions.map((key) => (
              <Token
                key={key}
                style={styles.token}
                onDelete={() => toggleOption({ key, checked: false })}
              >
                {optionsMap.get(key)}
              </Token>
            ))}
          </Layout.FlexRow>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        <Icon
          name={open ? "chevronUpLarge" : "chevronDownLarge"}
          color={textDark}
          style={styles.chevron}
          size={20}
        />
      </Layout.FlexRow>
      <PopperUnstyled
        open={open}
        placement="bottom-start"
        anchorEl={triggerRef.current}
        style={{ zIndex: zIndex.tooltip }}
      >
        <ClickAwayListener onClickAway={() => handleClose()}>
          <Layout.FlexColumn style={styles.body}>
            {searchable && (
              <TextInput
                icon="search"
                placeholder={ci18n(
                  "placeholder for a text box with which merchants can enter a query to search through a list",
                  "Search",
                )}
                value={query}
                onChange={({ text }) => {
                  if (checkboxesRef.current) {
                    checkboxesRef.current.scrollTo({
                      top: 0,
                    });
                  }
                  setQuery(text);
                }}
                data-cy={`${dataCy}-input-search`}
              />
            )}
            <Layout.FlexColumn
              style={styles.checkboxes}
              onScroll={(e) => handleScroll(e)}
              ref={checkboxesRef}
            >
              {filteredData.slice(0, renderTo).map((option) => (
                <CheckboxField
                  style={styles.checkboxField}
                  key={option.key}
                  title={() => (
                    <Text style={styles.chemName}>{option.value}</Text>
                  )}
                  checked={selectedOptions.includes(option.key)}
                  onChange={(checked) =>
                    toggleOption({ key: option.key, checked })
                  }
                  data-cy={`${dataCy}-option-${option.key}`}
                />
              ))}
            </Layout.FlexColumn>
          </Layout.FlexColumn>
        </ClickAwayListener>
      </PopperUnstyled>
    </>
  );
};

export default observer(SearchableMultiselect);

const useStylesheet = (tokenColor?: string) => {
  const {
    borderPrimaryDark,
    borderPrimary,
    surfaceLightest,
    surface,
    textBlack,
    textDark,
    textPlaceholder,
  } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        box: {
          border: `1px solid ${borderPrimary}`,
          height: 42,
          borderRadius: 4,
          padding: "10px 10px 10px 16px",
          gap: 8,
          boxSizing: "border-box",
        },
        tokenContainer: {
          gap: 8,
          overflowX: "scroll",
        },
        token: {
          backgroundColor: tokenColor || surface,
          color: textDark,
        },
        placeholder: {
          color: textPlaceholder,
          fontSize: 14,
          lineHeight: "20px",
        },
        body: {
          // Tooltip needs to be fixed at a large width to avoid shifting width
          // when scrolling, when new line items appear
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 500,
          boxSizing: "border-box",
          padding: 16,
          borderRadius: 4,
          border: `1px solid ${borderPrimaryDark}`,
          boxShadow: `0px 1px 4px 1px rgba(24, 39, 75, 0.12), 0px 4px 4px -2px rgba(24, 39, 75, 0.08)`,
          gap: 16,
          backgroundColor: surfaceLightest,
          contentVisibility: "auto",
          marginTop: 8,
          marginBottom: 8,
        },
        checkboxes: {
          gap: CheckboxMargin,
          height:
            CheckboxesPerPage * CheckboxHeight +
            (CheckboxesPerPage - 1) * CheckboxMargin,
          overflowY: "scroll",
        },
        checkboxField: {
          height: CheckboxHeight,
        },
        chemName: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: textBlack,
          fontSize: 14,
          lineHeight: "20px",
        },
        chevron: {
          flex: "0 0 20px",
        },
      }),
    [
      borderPrimaryDark,
      borderPrimary,
      surfaceLightest,
      surface,
      textBlack,
      textDark,
      textPlaceholder,
      tokenColor,
    ],
  );
};

const useFuse = <T extends string>(
  data: ReadonlyArray<SearchableMultiselectOption<T>>,
) => {
  return useMemo(() => {
    // Keep type safety for what keys can be, but cast back to string for
    // compatibility with Fuse
    const keys: ReadonlyArray<keyof SearchableMultiselectOption<T>> = ["value"];
    const keysAsString: string[] = [...keys];

    const options = {
      includeScore: true,
      threshold: 0.4,
      distance: 100,
      keys: keysAsString,
    };
    const index = Fuse.createIndex(keysAsString, data);

    return new Fuse(data, options, index);
  }, [data]);
};
