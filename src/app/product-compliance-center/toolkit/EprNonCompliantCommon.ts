import { ci18n } from "@core/toolkit/i18n";
import { Option } from "@ContextLogic/lego";

export const SupportedCountryCodes = ["FR", "DE", "SE", "AT"] as const;

export type SupportedCountryCode = typeof SupportedCountryCodes[number];

export type CountryToEprCategoryOptions = Record<
  SupportedCountryCode,
  ReadonlyArray<Option<string>>
>;

export const ALL_EPR_CATEGORIES_VALUE = -1;

const ALL_EPR_CATEGORIES_OPTION: Option<string> = {
  value: ALL_EPR_CATEGORIES_VALUE.toString(),
  text: ci18n(
    "refers to all categories for extended producer responsibility",
    "(all categories)",
  ),
};

export const COUNTRY_TO_EPR_CATEGORY_OPTIONS: CountryToEprCategoryOptions = {
  FR: [
    ALL_EPR_CATEGORIES_OPTION,
    {
      value: "1",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Batteries",
      ),
    },
    {
      value: "2",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Electric and Electronic Equipment (EEE)",
      ),
    },
    {
      value: "3",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Furniture",
      ),
    },
    {
      value: "4",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Paper",
      ),
    },
    {
      value: "5",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Textile",
      ),
    },
    {
      value: "6",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Tires",
      ),
    },
    {
      value: "7",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Primary Packaging",
      ),
    },
  ],
  DE: [
    ALL_EPR_CATEGORIES_OPTION,
    {
      value: "1",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Packaging",
      ),
    },
    {
      value: "2",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Electric and Electronic Equipment (EEE)",
      ),
    },
    {
      value: "3",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Batteries",
      ),
    },
  ],
  SE: [
    ALL_EPR_CATEGORIES_OPTION,
    {
      value: "1",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Batteries",
      ),
    },
    {
      value: "2",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Electric and Electronic Equipment (EEE)",
      ),
    },
    {
      value: "3",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Tires",
      ),
    },
    {
      value: "4",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Packaging",
      ),
    },
    {
      value: "5",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Fishing Gear",
      ),
    },
    {
      value: "6",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Wet Wipes",
      ),
    },
  ],
  AT: [
    ALL_EPR_CATEGORIES_OPTION,
    {
      value: "1",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Batteries",
      ),
    },
    {
      value: "2",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Electric and Electronic Equipment (EEE)",
      ),
    },
    {
      value: "3",
      text: ci18n(
        "refers to a category for extended producer responsibility",
        "Packaging",
      ),
    },
  ],
};

export const PAGE_SIZE_OPTIONS: ReadonlyArray<Option<string>> = [
  { value: "10", text: "10" },
  { value: "20", text: "20" },
  { value: "50", text: "50" },
  { value: "100", text: "100" },
];
