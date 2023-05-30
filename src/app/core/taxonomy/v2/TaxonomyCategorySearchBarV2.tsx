import React, { CSSProperties, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { OnTextChangeEvent, TextInput } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import { observer } from "mobx-react";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import {
  VariableSizeList as List,
  ListChildComponentProps,
} from "react-window";
import { Text } from "@ContextLogic/atlas-ui";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { TaxonomyAction, TaxonomyState } from "@core/taxonomy/v2/reducer";
import { CategoryId } from "@core/taxonomy/toolkit";

export type DropdownOption = {
  readonly id: CategoryId;
  readonly name: string;
  readonly path: string;
};

type Props = {
  readonly style?: CSSProperties;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly state: TaxonomyState;
  readonly dispatch: React.Dispatch<TaxonomyAction>;
};

const TaxonomyCategorySearchBarV2: React.FC<Props> = ({
  style,
  disabled,
  placeholder,
  dispatch,
  state,
}) => {
  const { surface, surfaceLightest, textBlack, textDark, corePrimaryLightest } =
    useTheme();
  const [selectedOption, setSelectedOption] = useState<DropdownOption>();
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedInput = useDebouncer(searchInput, 800);
  const searchQuery =
    debouncedInput != null && debouncedInput.trim().length > 0
      ? debouncedInput
      : undefined;

  const dropdownOptions: ReadonlyArray<DropdownOption> = useMemo(() => {
    let options: ReadonlyArray<DropdownOption> = [];
    const categoryNodes = [...state.categoryTreeMap.values()];

    categoryNodes.forEach((node) => {
      options = [
        ...options,
        {
          id: node.id,
          name: node.name,
          path: node.path,
        },
      ];
    });

    return options;
  }, [state.categoryTreeMap]);

  const fuse = useFuse(dropdownOptions);
  const searchResult = useMemo(() => {
    if (searchQuery == null || selectedOption != null) {
      return [];
    }

    return fuse.search(searchQuery).map((result) => result.item);
  }, [fuse, searchQuery, selectedOption]);

  const resultCount = useMemo(() => {
    return searchResult.length;
  }, [searchResult]);

  const onSelectOption = (option: DropdownOption) => {
    setSelectedOption(option);
    dispatch({ type: "HIGHLIGHT_NODE", id: option.id });
    setShowDropdown(false);
  };

  const onSearch = (onTextChangeEvent: OnTextChangeEvent) => {
    const text = onTextChangeEvent.text || "";
    setSearchInput(text);
    setShowDropdown(true);
  };

  const handleDropdownClose = () => {
    setShowDropdown(false);
  };

  const ListItemRenderer = ({ index, ...rest }: ListChildComponentProps) => {
    const option = searchResult[index];

    return (
      <>
        {option && (
          <div
            key={option.id}
            onClick={() => onSelectOption(option)}
            data-cy={`subcategory-option-${option.name}`}
            {...rest}
          >
            <style jsx>{`
              div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 100%;
                user-select: none;
                cursor: pointer;
                background-color: ${surfaceLightest};
                color: ${textBlack};
                transition: all 0.2s linear;
                padding: 10px 20px;
                box-sizing: border-box;
              }
              div:hover {
                opacity: 1;
                background-color: ${corePrimaryLightest};
              }
            `}</style>
            {option.path.trim().length > 0 && (
              <Text
                variant="bodyM"
                sx={{
                  color: textDark,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {option.path}
              </Text>
            )}
            <Text
              variant="bodyL"
              sx={{
                marginTop: "5px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              {option.name}
            </Text>
          </div>
        )}
      </>
    );
  };

  return (
    <ClickAwayListener onClickAway={() => handleDropdownClose()}>
      <div style={style} className="category-search-bar-root">
        <style jsx>{`
          .category-search-bar-root {
            width: 400px;
          }
        `}</style>
        <div ref={inputRef}>
          <TextInput
            icon="search"
            style={{ width: "100%" }}
            value={selectedOption != null ? selectedOption.name : searchInput}
            placeholder={placeholder ?? i`Search by typing category name`}
            onChange={onSearch}
            onFocus={() => setSelectedOption(undefined)}
            data-cy="input-subcategory-search"
            disabled={disabled}
          />
        </div>
        {selectedOption == null && (
          <Popper
            anchorEl={inputRef.current}
            open={showDropdown}
            placement="bottom-start"
            sx={{ width: "400px" }}
          >
            <>
              {searchResult.length === 0 && (
                <Text
                  variant="bodyM"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    backgroundColor: surfaceLightest,
                    boxShadow: `0px 8px 16px 0px ${surface}`,
                    borderRadius: "8px",
                  }}
                >
                  No options
                </Text>
              )}
              {searchResult.length > 0 && (
                <List
                  height={300}
                  itemCount={resultCount}
                  width="100%"
                  itemSize={(index) =>
                    searchResult[index].path.trim().length > 0 ? 70 : 60
                  }
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    backgroundColor: surfaceLightest,
                    boxShadow: `0px 8px 16px 0px ${surface}`,
                    borderRadius: "8px",
                  }}
                >
                  {ListItemRenderer}
                </List>
              )}
            </>
          </Popper>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default observer(TaxonomyCategorySearchBarV2);

const useFuse = (data: ReadonlyArray<DropdownOption>) => {
  return useMemo(() => {
    // Keep type safety for what keys can be, but cast back to string for
    // compatibility with Fuse
    const keys: ReadonlyArray<keyof DropdownOption> = ["name"];
    const keysAsString: string[] = [...keys];

    const options = {
      threshold: 0.6,
      ignoreLocation: true,
      keys: keysAsString,
      minMatchCharLength: 2,
      findAllMatches: true,
    };
    const index = Fuse.createIndex(keysAsString, data);

    return new Fuse(data, options, index);
  }, [data]);
};
