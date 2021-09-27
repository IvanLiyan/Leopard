/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { IllustrationName } from "@merchant/component/core";

/* Type Imports */
import {
  RestrictedProductCountryCode,
  RestrictedProductRegionCode,
  RestrictedProductRegion,
  RestrictedProductRequestState,
  RestrictedProductCategory,
  RestrictedProductRequestSchema,
} from "@schema/types";

/* External Libraries */
import gql from "graphql-tag";

export type RegionToCategoriesMap = Map<
  RestrictedProductRegionCode,
  ReadonlyArray<RestrictedProductCategory>
>;

export type CountryAndRegionType = Pick<
  RestrictedProductRegion,
  "regionName" | "regionCode" | "isACountry"
>;

export type RestrictedProductRequestType = Pick<
  RestrictedProductRequestSchema,
  "state" | "productCategory" | "rejectedReason"
> & {
  readonly region: CountryAndRegionType;
};

export type GetRestrictedProductCategoriesRequestType = {
  readonly region: RestrictedProductRegionCode;
};

export type GetRestrictedProductCategoriesResponseType = {
  readonly policy: {
    readonly restrictedProduct: {
      readonly restrictedProductCategories: ReadonlyArray<
        RestrictedProductCategory
      >;
    };
  };
};

type CategoriesStateType = {
  [category in RestrictedProductCategory]: {
    state: RestrictedProductRequestState | null;
    region?: CountryAndRegionType;
    rejectedReason?: string;
  };
};

export type RestrictedProductCategoryProps = {
  readonly category: RestrictedProductCategory;
  readonly title: string;
  readonly circleImage: IllustrationName;
  readonly colorImage: IllustrationName;
  readonly rawImage: IllustrationName;
  sortOrder: number;
  state?: RestrictedProductRequestState | null;
  countryAndRegion?: CountryAndRegionType;
  rejectedReason?: string;
};

export const applicationPath = `/product-authorization/restricted-product-application`;

export const regionCodeToName: {
  [region in RestrictedProductRegionCode]: string;
} = {
  NA: i`North America (US, CA)`,
  LA: i`Latin America (AR, BR, CO, MX)`,
  EU: i`Europe`,
  TR: i`Turkey`,
  AU: i`Australia`,
  KR: i`South Korea`,
  JP: i`Japan`,
};

export const CountryCodeToTermsOfServicesDoc: {
  [country in RestrictedProductCountryCode]: string;
} = {
  CA:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  US:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  BR:
    "https://drive.google.com/uc?export=download&id=16KuO_6Hdhk1xwk-eF-f9vjeNfjh--4Pz",
  MX:
    "https://drive.google.com/uc?export=download&id=1B-_gVdB9CTvITrdQhoD_ti3ZO03vIT0O",
  CO:
    "https://drive.google.com/uc?export=download&id=1B-_gVdB9CTvITrdQhoD_ti3ZO03vIT0O",
  AR:
    "https://drive.google.com/uc?export=download&id=1B-_gVdB9CTvITrdQhoD_ti3ZO03vIT0O",
  FR:
    "https://drive.google.com/uc?export=download&id=1_1hB03tEY98lxNdBoLetx0JMWxNERRrp",
  IT:
    "https://drive.google.com/uc?export=download&id=1p6UnIL7w9FcX6P_b5MZ0AppMH6jNxQbU",
  DE:
    "https://drive.google.com/uc?export=download&id=1Nnc8U3wQKwLsPR66qYce81cLi7r6wi-7",
  GB:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  ES:
    "https://drive.google.com/uc?export=download&id=1B-_gVdB9CTvITrdQhoD_ti3ZO03vIT0O",
  PT:
    "https://drive.google.com/uc?export=download&id=16KuO_6Hdhk1xwk-eF-f9vjeNfjh--4Pz",
  AT:
    "https://drive.google.com/uc?export=download&id=1Nnc8U3wQKwLsPR66qYce81cLi7r6wi-7",
  BE:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  BG:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  HR:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  CZ:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  DK:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  EE:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  FI:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  GR:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  HU:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  IE:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  LV:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  LT:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  LU:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  MT:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  NL:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  PL:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  RO:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  SK:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  SI:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  CH:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  SE:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  UA:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  TR:
    "https://drive.google.com/uc?export=download&id=1n5dL4zbdpHfM2qEaZ42JwYEoec9adyAU",
  AU:
    "https://drive.google.com/uc?export=download&id=1l7ez4Es90wsZIh1hyot4Mo7dbw2IO9Gv",
  KR:
    "https://drive.google.com/uc?export=download&id=1RdhdTQ3UbojmnipXJENxQdu_zxbSyjln",
  JP:
    "https://drive.google.com/uc?export=download&id=1_6chDWsHUOVEQoRurhYpFri8wFTMxZcq",
};

export const CountryCodeToWarrantyTemplate: {
  [country in RestrictedProductCountryCode]: string;
} = {
  CA:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  US:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  BR:
    "https://drive.google.com/uc?export=download&id=1kZK_NT6_hZGAdR_NufAPyHKyBLjZDi1a",
  MX:
    "https://drive.google.com/uc?export=download&id=1aEzc4kgTmqbIIt5SpaT6Vn7Ww0GWBYYX",
  CO:
    "https://drive.google.com/uc?export=download&id=1aEzc4kgTmqbIIt5SpaT6Vn7Ww0GWBYYX",
  AR:
    "https://drive.google.com/uc?export=download&id=1aEzc4kgTmqbIIt5SpaT6Vn7Ww0GWBYYX",
  FR:
    "https://drive.google.com/uc?export=download&id=1QsZz_9vytr3QDeL9pdd5hr-AMdZxStv8",
  IT:
    "https://drive.google.com/uc?export=download&id=12grH361IsNfeTHWndMYF2gQLtmgMdwly",
  DE:
    "https://drive.google.com/uc?export=download&id=1QrWCc00p780wlI_nETBR1KPXMyLedsWc",
  GB:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  ES:
    "https://drive.google.com/uc?export=download&id=1aEzc4kgTmqbIIt5SpaT6Vn7Ww0GWBYYX",
  PT:
    "https://drive.google.com/uc?export=download&id=1kZK_NT6_hZGAdR_NufAPyHKyBLjZDi1a",
  AT:
    "https://drive.google.com/uc?export=download&id=1QrWCc00p780wlI_nETBR1KPXMyLedsWc",
  BE:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  BG:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  HR:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  CZ:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  DK:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  EE:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  FI:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  GR:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  HU:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  IE:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  LV:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  LT:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  LU:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  MT:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  NL:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  PL:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  RO:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  SK:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  SI:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  CH:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  SE:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  UA:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  TR:
    "https://drive.google.com/uc?export=download&id=1vtCPJphtE5KCZwO4KKAijY1rVt6VSsOg",
  AU:
    "https://drive.google.com/uc?export=download&id=1gyeEOuZpeJoZYy7SHdssvsHe-SFVK8ri",
  KR:
    "https://drive.google.com/uc?export=download&id=1Cahsy0E4lYlPMVi2aMJhNV2AXJ3fkJcx",
  JP:
    "https://drive.google.com/uc?export=download&id=1bfxvgN1xqiCosHp76AAYoyofIBJOL9DR",
};

export const GET_RESTRICTED_PRODUCT_CATEGORIES_QUERY = gql`
  query GetRestrictedProductCategories($region: RestrictedProductRegionCode!) {
    policy {
      restrictedProduct {
        restrictedProductCategories(region: $region)
      }
    }
  }
`;

export const startApplication = () => {
  const { navigationStore } = AppStore.instance();
  navigationStore.navigate(applicationPath);
};

export const CategoryToProductDetails: {
  [category in RestrictedProductCategory]: RestrictedProductCategoryProps;
} = {
  UNVERIFIED_WARRANTIES: {
    category: "UNVERIFIED_WARRANTIES",
    title: i`Merchant Warranties`,
    circleImage: "restrictedProductWarrantiesCircle",
    colorImage: "restrictedProductWarrantiesColor",
    rawImage: "restrictedProductWarrantiesRaw",
    sortOrder: 0,
  },
  PLANT_AND_PLANT_SEEDS: {
    category: "PLANT_AND_PLANT_SEEDS",
    title: i`Plant & Plant Seeds`,
    circleImage: "restrictedProductPlantAndPlantSeedsCircle",
    colorImage: "restrictedProductPlantAndPlantSeedsColor",
    rawImage: "restrictedProductPlantAndPlantSeedsRaw",
    sortOrder: 0,
  },
  VITAMINS_AND_SUPPLEMENTS: {
    category: "VITAMINS_AND_SUPPLEMENTS",
    title: i`Vitamins & Supplements`,
    circleImage: "restrictedProductVitaminsCircle",
    colorImage: "restrictedProductVitaminsColor",
    rawImage: "restrictedProductVitaminsRaw",
    sortOrder: 0,
  },
  OTC_MEDICATION: {
    category: "OTC_MEDICATION",
    title: i`OTC Medications`,
    circleImage: "restrictedProductMedicationsCircle",
    colorImage: "restrictedProductMedicationsColor",
    rawImage: "restrictedProductMedicationsRaw",
    sortOrder: 0,
  },
  FOOD: {
    category: "FOOD",
    title: i`Food`,
    circleImage: "restrictedProductFoodCircle",
    colorImage: "restrictedProductFoodColor",
    rawImage: "restrictedProductFoodRaw",
    sortOrder: 0,
  },
  CHILD_HARNESS: {
    category: "CHILD_HARNESS",
    title: i`Baby Carriers`,
    circleImage: "restrictedProductCarriersCircle",
    colorImage: "restrictedProductCarriersColor",
    rawImage: "restrictedProductCarriersRaw",
    sortOrder: 0,
  },
  BEVERAGES: {
    category: "BEVERAGES",
    title: i`Beverages without Alcohol`,
    circleImage: "restrictedProductBeveragesCircle",
    colorImage: "restrictedProductBeveragesColor",
    rawImage: "restrictedProductBeveragesRaw",
    sortOrder: 0,
  },
  PET_FOOD: {
    category: "PET_FOOD",
    title: i`Pet Food`,
    circleImage: "restrictedProductPetFoodCircle",
    colorImage: "restrictedProductPetFoodColor",
    rawImage: "restrictedProductPetFoodRaw",
    sortOrder: 0,
  },
  CHILD_CARSEAT: {
    category: "CHILD_CARSEAT",
    title: i`Child Car Seats`,
    circleImage: "restrictedProductCarSeatsCircle",
    colorImage: "restrictedProductCarSeatsColor",
    rawImage: "restrictedProductCarSeatsRaw",
    sortOrder: 0,
  },
  SEATBELTS: {
    category: "SEATBELTS",
    title: i`Seat Belt Extenders`,
    circleImage: "restrictedProductSeatBeltCircle",
    colorImage: "restrictedProductSeatBeltColor",
    rawImage: "restrictedProductSeatBeltRaw",
    sortOrder: 0,
  },
};

const sortOders: {
  [type in RestrictedProductRequestState]: number;
} = {
  AWAITING_ADMIN: 4,
  APPROVED: 3,
  REJECTED: 2,
  AWAITING_MERCHANT: 1,
};

export const getCategoryDetails = (categoryData: {
  readonly requests: readonly RestrictedProductRequestType[] | undefined;
  readonly categories: readonly RestrictedProductCategory[] | undefined;
}) => {
  const categories: RestrictedProductCategoryProps[] = [];
  const categoryStates: CategoriesStateType = {
    UNVERIFIED_WARRANTIES: {
      state: null,
    },
    PLANT_AND_PLANT_SEEDS: {
      state: null,
    },
    VITAMINS_AND_SUPPLEMENTS: {
      state: null,
    },
    OTC_MEDICATION: {
      state: null,
    },
    FOOD: {
      state: null,
    },
    CHILD_HARNESS: {
      state: null,
    },
    BEVERAGES: {
      state: null,
    },
    PET_FOOD: {
      state: null,
    },
    CHILD_CARSEAT: {
      state: null,
    },
    SEATBELTS: {
      state: null,
    },
  };
  if (categoryData.requests) {
    categoryData.requests.forEach((request: RestrictedProductRequestType) => {
      categoryStates[request.productCategory].state = request.state;
      categoryStates[request.productCategory].region = request.region;
      if (request.rejectedReason) {
        categoryStates[request.productCategory].rejectedReason =
          request.rejectedReason;
      }
    });
  }
  if (categoryData.categories) {
    categoryData.categories.forEach((category: RestrictedProductCategory) => {
      const categoryDetails: RestrictedProductCategoryProps =
        CategoryToProductDetails[category];
      categoryDetails.countryAndRegion = categoryStates[category].region;
      categoryDetails.state = categoryStates[category].state;
      // sort order for categories on state by following order:
      // AWAITING_ADMIN, APPROVED, REJECTED, null
      if (categoryDetails.state) {
        categoryDetails.sortOrder = sortOders[categoryDetails.state];
      }
      if (categoryStates[category].rejectedReason) {
        categoryDetails.rejectedReason =
          categoryStates[category].rejectedReason;
      }
      categories.push(categoryDetails);
    });
  }
  categories.sort(
    (a: RestrictedProductCategoryProps, b: RestrictedProductCategoryProps) => {
      return b.sortOrder - a.sortOrder;
    }
  );
  return categories;
};
