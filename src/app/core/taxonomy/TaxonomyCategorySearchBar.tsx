import { useQuery } from "@apollo/client";
import {
  Layout,
  LoadingIndicator,
  OnTextChangeEvent,
  Popover,
  Text,
  TextInput,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import { useTheme } from "@core/stores/ThemeStore";
import { KEYCODE_ENTER } from "@core/toolkit/dom";
import { Constants } from "@core/taxonomy/constants";
import {
  LeafCategoryRequestData,
  LeafCategoryResponseData,
  LEAF_CATEGORIES_QUERY,
  PickedCategoryWithDetails,
} from "@core/taxonomy/toolkit";
import { css } from "@core/toolkit/styling";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

type DropdownOption = {
  path: string;
  category: PickedCategoryWithDetails;
};

type Props = BaseProps & {
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly l1CategoryId?: number | null;
  readonly onSelect?: (category: PickedCategoryWithDetails) => void;
};

const TaxonomyCategorySearchBar: React.FC<Props> = ({
  className,
  style,
  disabled,
  l1CategoryId,
  placeholder,
  onSelect,
}) => {
  const styles = useStylesheet();

  const [selectedOption, setSelectedOption] =
    useState<PickedCategoryWithDetails | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, loading } = useQuery<
    LeafCategoryResponseData,
    LeafCategoryRequestData
  >(LEAF_CATEGORIES_QUERY, {
    variables: {
      l1CategoryId: l1CategoryId ?? Constants.TAXONOMY.rootCategoryId,
    },
  });
  const leaves = data?.taxonomy?.leafCategories;

  const dropdownOptions: ReadonlyArray<DropdownOption> = useMemo(() => {
    if (!leaves) {
      return []; // error
    }

    return leaves.map((category) => {
      const treePath = category?.categoriesAlongPath
        ?.map((category) => category.name)
        .join(" > ");

      return {
        path: treePath || "",
        category,
      };
    });
  }, [leaves]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const checkIfClickedOutside = (e: any) => {
      if (
        showDropdown &&
        dropdownRef.current &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        !dropdownRef.current.contains(e.target)
      ) {
        setSearchTerm("");
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showDropdown]);

  const remainingDropdownOptions = useMemo(() => {
    const rawSearchTerm = searchTerm.toLowerCase();
    return dropdownOptions.filter(
      (option) =>
        !selectedOption?.name.includes(option.category.name) &&
        (option.category.name.toLowerCase().includes(rawSearchTerm) ||
          option.path.toLowerCase().includes(rawSearchTerm)),
    );
  }, [dropdownOptions, searchTerm, selectedOption]);

  const onClickOption = (option: DropdownOption) => {
    setSelectedOption(option.category);
    onSelect && onSelect(option.category);

    setSearchTerm("");
  };

  const onSearch = (onTextChangeEvent: OnTextChangeEvent) => {
    const text = onTextChangeEvent.text || "";
    setSearchTerm(text);
    setShowDropdown(true);
  };

  const dropdownNode = (
    <Popover position={"absolute"}>
      <Layout.FlexColumn style={styles.dropdownOptionList} alignItems="stretch">
        {remainingDropdownOptions.map((option) => (
          <Layout.FlexColumn
            key={option.category.id}
            onClick={() => onClickOption(option)}
            style={styles.dropdownOption}
            data-cy={`subcategory-option-${option.category.id}`}
          >
            {searchTerm && (
              <Text className={css(styles.inline)}>
                {ci18n(
                  "Label above a possible search result matching the search term",
                  "{%1=Search keyword} in",
                  searchTerm,
                )}
              </Text>
            )}
            <Text weight="bold" style={styles.optionTitle}>
              {option.category.name}
            </Text>
            <Text style={styles.optionPath}>{option.path}</Text>
          </Layout.FlexColumn>
        ))}
      </Layout.FlexColumn>
    </Popover>
  );

  return (
    <LoadingIndicator loadingComplete={!loading}>
      <div className={css([className, style, styles.input])} ref={dropdownRef}>
        <TextInput
          disabled={disabled}
          icon="search"
          style={styles.input}
          value={selectedOption ? selectedOption.name : searchTerm}
          placeholder={
            placeholder ??
            ci18n(
              "Placeholder text in search bar, lets merchant search for a product category",
              "Search",
            )
          }
          onChange={onSearch}
          onKeyUp={(keyCode?: number) => {
            if (keyCode === KEYCODE_ENTER) {
              setSearchTerm("");
            }
          }}
          onFocus={() => setSelectedOption(null)}
          renderDropdown={() => {
            return showDropdown && !selectedOption ? dropdownNode : null;
          }}
          data-cy="input-subcategory-search"
        />
      </div>
    </LoadingIndicator>
  );
};

export default observer(TaxonomyCategorySearchBar);

const useStylesheet = () => {
  const {
    surface,
    surfaceLightest,
    textBlack,
    primary,
    surfaceDarker,
    corePrimaryLightest,
  } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        dropdownOptionList: {
          overflowY: "scroll",
          maxHeight: 315,
          padding: "10px 0px",
          boxShadow: `0px 8px 16px 0px ${surface}`,
        },
        dropdownOption: {
          padding: "12px 25px",
          userSelect: "none",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          cursor: "pointer",
          backgroundColor: surfaceLightest,
          color: textBlack,
          transition: "all 0.2s linear",
          ":hover": {
            opacity: 1,
            backgroundColor: corePrimaryLightest,
            color: primary,
          },
        },
        input: {
          width: "100%",
        },
        optionTitle: {
          fontSize: 16,
        },
        optionPath: {
          marginTop: 5,
          fontSize: 14,
          color: surfaceDarker,
          display: "block",
        },
        inline: {
          display: "inline",
        },
      }),
    [
      corePrimaryLightest,
      primary,
      surface,
      surfaceDarker,
      surfaceLightest,
      textBlack,
    ],
  );
};
