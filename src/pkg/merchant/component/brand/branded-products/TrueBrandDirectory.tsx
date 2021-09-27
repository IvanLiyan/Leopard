import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { TextInput } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { DownloadButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

/* Merchant Store */
import { useApolloStore } from "@merchant/stores/ApolloStore";

/* Merchant API */
import { getABSBrands } from "@merchant/api/brand/true-brands";

/* Toolkit */
import { useRequest } from "@toolkit/api";

/* Relative Imports */
import TrueBrandDirectoryTable from "./true-brand-directory/TrueBrandDirectoryTable";
import NoBrandsFound from "./true-brand-directory/NoBrandsFound";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Type Imports */
import { BrandServiceSchemaTrueBrandsArgs } from "@schema/types";
import { TrueBrandObject } from "@merchant/component/brand/branded-products/BrandSearch";
import gql from "graphql-tag";

type TrueBrandDirectoryProps = BaseProps;

const GET_TRUE_BRANDS_QUERY = gql`
  query TrueBrandDirectory_GetTrueBrands(
    $count: Int!
    $offset: Int!
    $queryString: String!
    $sort: BrandSort!
  ) {
    brand {
      trueBrands(
        count: $count
        offset: $offset
        queryString: $queryString
        sort: $sort
      ) {
        id
        displayName
        logoUrl
      }
    }
  }
`;

type GetTrueBrandsRequestType = Pick<
  BrandServiceSchemaTrueBrandsArgs,
  "count" | "offset" | "queryString" | "sort"
>;

type GetTrueBrandsResponseType = {
  readonly brand: {
    readonly trueBrands: ReadonlyArray<TrueBrandObject>;
  };
};

const TrueBrandDirectory = ({ style }: TrueBrandDirectoryProps) => {
  const PAGE_SIZE = 50;
  const SCROLL_THRESHOLD = 80;
  const EXPORT_URL = "/branded-products/brand-directory/export";

  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const { client } = useApolloStore();
  const [liveQuery, setLiveQuery] = useState("");
  const debouncedQuery = useDebouncer(liveQuery, 750);
  const [offset, setOffset] = useState(0);
  const [brands, setBrands] = useState<ReadonlyArray<TrueBrandObject>>([]);
  const [newBrands, setNewBrands] = useState<ReadonlyArray<TrueBrandObject>>(
    []
  );
  const brandDirectoryElement = useRef<HTMLDivElement | null>(null);
  // Used so we don't query more results until the current query is finished
  const blockCheckDimensions = useRef(false);

  const [absResponse] = useRequest(getABSBrands());
  const [isQuerying, setIsQuerying] = useState(false);
  const isLoading = absResponse == null || isQuerying;
  const moreToLoad = newBrands?.length === PAGE_SIZE;
  const absBrandIds = absResponse?.data?.brands || [];

  useEffect(() => {
    if (
      newBrands &&
      newBrands.length !== 0 &&
      !brands.some((item) => item.id === newBrands[0].id)
    ) {
      setBrands([...brands, ...newBrands]);
    }
  }, [brands, newBrands]);

  useEffect(() => {
    setBrands([]);
    setNewBrands([]);
    setOffset(0);
  }, [debouncedQuery]);

  useEffect(() => {
    const queryBrands = async (): Promise<void> => {
      blockCheckDimensions.current = true;
      setIsQuerying(true);
      const { data } = await client.query<
        GetTrueBrandsResponseType,
        GetTrueBrandsRequestType
      >({
        query: GET_TRUE_BRANDS_QUERY,
        variables: {
          count: PAGE_SIZE,
          offset,
          queryString: debouncedQuery,
          sort: {
            field: "NAME",
            order: "ASC",
          },
        },
      });

      const newBrands = data?.brand.trueBrands || [];
      setNewBrands(newBrands);
      blockCheckDimensions.current = false;
      setIsQuerying(false);
    };
    queryBrands();
  }, [offset, debouncedQuery, client]);

  const onSearchChange = useCallback(async ({ text }) => {
    if (text.trim().length === 0 || text.trim().length >= 2) {
      setLiveQuery(text.trim());
    }
  }, []);

  useEffect(() => {
    const checkDimensions = () => {
      const { current: containerElem } = brandDirectoryElement;
      if (containerElem == null) {
        return null;
      }
      if (
        containerElem.clientHeight +
          containerElem.offsetTop -
          (window.pageYOffset + window.innerHeight) <
          SCROLL_THRESHOLD &&
        moreToLoad &&
        !blockCheckDimensions.current
      ) {
        setOffset(offset + PAGE_SIZE);
      }
    };

    // timeout allows us to check the dimensions after they've stabilized
    setTimeout(() => checkDimensions(), 2000);
    window.addEventListener("scroll", checkDimensions);
    window.addEventListener("resize", checkDimensions);

    return () => {
      window.removeEventListener("scroll", checkDimensions);
      window.removeEventListener("resize", checkDimensions);
    };
  }, [moreToLoad, offset]);

  const onDownloadClicked = async () => {
    navigationStore.download(EXPORT_URL);
  };

  let body;
  if (!isLoading && brands.length === 0) {
    body = (
      <NoBrandsFound style={css(styles.noBrands)} brand={debouncedQuery} />
    );
  } else {
    body = (
      <React.Fragment>
        <TrueBrandDirectoryTable brands={brands} absBrandIds={absBrandIds} />
        {isLoading && <LoadingIndicator />}
      </React.Fragment>
    );
  }

  return (
    <div ref={brandDirectoryElement} className={css(style)}>
      <div className={css(styles.buttonContainer)}>
        <TextInput
          style={css(styles.search)}
          placeholder={i`Search by brand name or ID`}
          icon="search"
          onChange={onSearchChange}
        />
        <DownloadButton onClick={onDownloadClicked} popoverContent={null}>
          Download full list (.csv)
        </DownloadButton>
      </div>
      {body}
    </div>
  );
};
export default observer(TrueBrandDirectory);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        },
        buttonContainer: {
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
        },
        search: {
          minWidth: 300,
        },
        noBrands: {
          marginTop: 20,
        },
      }),
    []
  );
