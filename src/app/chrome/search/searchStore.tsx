// re-writing file soon
/* eslint-disable @typescript-eslint/no-unused-vars */
/*

    MobX Store used to power the search bar in MD Chrome.
    Functionality copied from the SearchStore in CLROOT and kept in MobX
    to ease migration.

*/
import React, {
  useState,
  createContext,
  useContext,
  createRef,
  useImperativeHandle,
} from "react";
import { observable, computed, reaction, toJS } from "mobx";

/* External Libraries */
import Id from "valid-objectid";
import Fuse from "fuse.js";
import sortBy from "lodash/sortBy";
import flatten from "lodash/flatten";

/* Relative Imports */
import UserStore from "@core/stores/UserStore";
import NavigationStore from "@core/stores/NavigationStore";
import ApolloStore from "@core/stores/ApolloStore";
import { gql } from "@apollo/client";
import {
  ChromeSchemaObjectSearchArgs,
  NavigationResultSchema,
  NavigationResultType,
} from "@schema";
import { ChromeNavigationNode } from "@core/stores/ChromeStore";
import { queryZendesk } from "./zendesk";
import LocalizationStore from "@core/stores/LocalizationStore";

const OBJECT_SEARCH_QUERY = gql`
  query SearchStore_ObjectSearchQuery(
    $objectId: ObjectIdType!
    $currentPath: String
  ) {
    chrome {
      objectSearch(objectId: $objectId, currentPath: $currentPath) {
        type
        title
        description
        imageUrl
        url
        nuggets
      }
    }
  }
`;

type ObjectSearchQueryRequestType = ChromeSchemaObjectSearchArgs;
type ObjectSearchQueryResponseType = {
  readonly chrome?: {
    readonly objectSearch?: Pick<
      NavigationResultSchema,
      "type" | "title" | "description" | "imageUrl" | "url" | "nuggets"
    > | null;
  } | null;
};

type SearchStoreProps = {
  readonly tree?: ChromeNavigationNode;
};

type ResultType =
  | "page"
  | "admin_page"
  | "recent_page"
  | "merchant"
  | "frequent_page"
  | "order"
  | "product"
  | "fine_display_item"
  | "warning"
  | "zendesk"
  | "tracking_dispute";

const ObjectSearchTypeToResultType: {
  readonly [T in NavigationResultType]: ResultType;
} = {
  MERCHANT: "merchant",
  ORDER: "order",
  WARNING: "warning",
  PRODUCT: "product",
};

const TypeNameMap: { [key in ResultType]: string } = {
  page: i`Pages`,
  admin_page: i`Wish Operations`,
  order: i`Orders`,
  product: i`Products`,
  fine_display_item: i`Penalties`,
  warning: i`Infractions`,
  zendesk: i`FAQ`,
  tracking_dispute: i`Tracking Disputes`,
  recent_page: i`Recently Visited`,
  frequent_page: i`Most Visited`,
  merchant: i`Merchants`,
};

type FlattenedNode = {
  readonly node: ChromeNavigationNode;
  readonly parents: ReadonlyArray<ChromeNavigationNode>;
};

export type WeightedNode = FlattenedNode & {
  readonly weight: number;
};

type SearchResultPayloadType = WeightedNode | undefined;

export type NavigationSearchResult = {
  readonly url?: string | null;
  readonly type: ResultType;
  readonly title?: string | null;
  readonly description?: null | string;
  readonly imageUrl?: null | string;
  readonly keywords?: ReadonlyArray<string> | null;
  readonly breadcrumbs?: ReadonlyArray<string> | null;
  readonly searchPhrase?: string | null;
  readonly openInNewTab?: boolean | null;
  readonly nuggets?: ReadonlyArray<string | null> | null;
  readonly weight?: number | null;
  readonly payload?: SearchResultPayloadType | null;
};

export type SearchResultGroup = {
  readonly title: string;
  readonly type: ResultType;
  readonly results: ReadonlyArray<NavigationSearchResult>;
};

class SearchStore {
  @observable
  rawSearchQuery = "";

  @observable
  searchQuery = "";

  debouceTimeoutId: ReturnType<typeof setTimeout> | null = null;

  @observable
  tree?: ChromeNavigationNode;

  @observable
  searchResults: ReadonlyArray<SearchResultGroup> = [];

  // time in unix when the latest search was made
  latestSearchTime: number | undefined;

  init(): void {
    reaction(
      () => this.rawSearchQuery,
      (searchQuery) => {
        if (this.debouceTimeoutId != null) {
          clearTimeout(this.debouceTimeoutId);
        }

        this.debouceTimeoutId = setTimeout(() => {
          if (
            Id.isValid(searchQuery.trim()) ||
            this.rawSearchQuery == searchQuery
          ) {
            this.searchQuery = searchQuery.trim();
          }
        }, 300);
      },
      { fireImmediately: false },
    );

    reaction(
      () => this.searchQuery,
      () => {
        void this.populateSearchResultGroups();
      },
      { fireImmediately: true },
    );
  }

  constructor({ tree }: SearchStoreProps) {
    this.tree = tree;
    this.init();
  }

  @computed
  get pageSearchResult(): undefined | null | NavigationSearchResult {
    if (location == null) {
      return null;
    }

    const { searchDocuments } = this;
    const { currentHash, currentPath, currentSearch } =
      NavigationStore.instance();

    // Used to trigger an recomputation we navigate.
    // this.latestPendingNavigationPath;
    const pathAndSearch = currentPath + currentSearch + currentHash;

    const results = searchDocuments.filter((doc) => {
      try {
        if (doc.url == null) {
          return false;
        }
        const url = new URL(doc.url);

        if (url.search || url.hash) {
          return doc.url.includes(pathAndSearch);
        }

        return location.pathname.startsWith(url.pathname);
      } catch {
        return false;
      }
    });

    // url cannot be missing here as no URL docs are filtered above
    const topResults = sortBy(results, (doc) => doc.url?.length ?? 0);
    return topResults[0];
  }

  @computed
  get fuzeSearch(): Fuse<
    NavigationSearchResult,
    Fuse.IFuseOptions<NavigationSearchResult>
  > {
    const { searchDocuments } = this;

    const keys: {
      name: keyof NavigationSearchResult;
      weight: number;
    }[] = [
      { name: "title", weight: 0.2 },
      { name: "searchPhrase", weight: 0.3 },
      { name: "keywords", weight: 0.2 },
      { name: "description", weight: 0.2 },
      { name: "breadcrumbs", weight: 0.1 },
    ];

    const options = {
      includeScore: true,
      threshold: 0.4,
      distance: 100,
      keys,
    };

    const cleanSearchDocuments = searchDocuments.map((doc) => ({
      ...doc,
      // mobxs wraps the arrays with ObservableArray, which
      // messes with fuzy. Convert them back to plain arrays.
      keywords: toJS(doc.keywords),
      breadcrumbs: toJS(doc.breadcrumbs),
    }));

    const index = Fuse.createIndex(
      ["title", "search_phrase", "keywords", "description", "breadcrumbs"],
      cleanSearchDocuments,
    );

    return new Fuse(cleanSearchDocuments, options, index);
  }

  populateSearchResultGroups = async (): Promise<void> => {
    const startTime = new Date().getTime();
    this.latestSearchTime = startTime;
    const results = await this.getSearchResultGroups();
    if (this.latestSearchTime === startTime) {
      this.searchResults = results;
    }
  };

  getRawSearchResults = async (): Promise<
    ReadonlyArray<NavigationSearchResult>
  > => {
    const {
      getObjectSearchResult,
      searchQuery,
      getZendeskResults,
      mostRecentlyVisitedPages,
    } = this;

    if (searchQuery.trim().length == 0) {
      return mostRecentlyVisitedPages;
    }

    const objectSearchResult = await getObjectSearchResult();

    if (objectSearchResult != null) {
      return [objectSearchResult];
    }

    const zendeskResults = await getZendeskResults();

    const results = this.fuzeSearch.search(this.searchQuery);

    const rankedResults = sortBy(results, (result) => {
      const finalScore =
        -1 *
        ((1 - (result.score || 0)) * 0.7 + (result.item.weight || 0) * 0.3);
      return finalScore;
    });
    return [...rankedResults.map((result) => result.item), ...zendeskResults];
  };

  getSearchResultGroups = async (): Promise<
    ReadonlyArray<SearchResultGroup>
  > => {
    const MAX_RESULTS_PER_GROUP = 3;
    const priority: {
      [key in ResultType]: number;
    } = {
      page: 1,
      merchant: 1,
      admin_page: 2,
      zendesk: 3,
      recent_page: 4,
      frequent_page: 5,
      order: 1,
      product: 1,
      fine_display_item: 1,
      warning: 1,
      tracking_dispute: 1,
    };

    const { getRawSearchResults } = this;

    const rawSearchResults = await getRawSearchResults();

    const groupedResults: {
      [T in ResultType]?: ReadonlyArray<NavigationSearchResult>;
    } = {};

    for (const result of rawSearchResults) {
      const { type } = result;
      let groupResults = groupedResults[type] || [];
      if (groupResults.length == MAX_RESULTS_PER_GROUP) {
        continue;
      }

      // If node was already added (usually because it was swapped for an overview node)
      // don't duplicate
      if (groupResults.some(({ url }) => url == result.url)) {
        continue;
      }

      const { payload } = result;

      const isOverviewNode =
        payload != null &&
        payload.parents.some(({ nodeid }) => nodeid == "overview");

      // If this result is an overview node and its URL exists elsewhere, use
      // the other node as well
      if (isOverviewNode) {
        const duplicateNonOverviewResult = rawSearchResults.find(
          ({ url, payload: otherPayload }) =>
            otherPayload != null &&
            url == result.url &&
            !otherPayload.parents.some(({ nodeid }) => nodeid == "overview"),
        );
        if (duplicateNonOverviewResult != null) {
          groupResults = [...groupResults, duplicateNonOverviewResult];
          groupedResults[type] = groupResults;
          continue;
        }
      }

      groupResults = [...groupResults, result];
      groupedResults[type] = groupResults;
    }

    const results: ReadonlyArray<SearchResultGroup> = (
      Object.keys(groupedResults) as ResultType[]
    ).reduce((acc, type) => {
      const results = groupedResults[type];
      return results == null
        ? acc
        : [
            ...acc,
            {
              title: TypeNameMap[type],
              type,
              results,
            },
          ];
    }, [] as ReadonlyArray<SearchResultGroup>);

    const sortedGroups = sortBy(results, ({ type }) => {
      if (type in priority) {
        return priority[type];
      }

      return Object.keys(priority).length + 1;
    });

    return sortedGroups;
  };

  getObjectSearchResult = async (): Promise<
    null | undefined | NavigationSearchResult
  > => {
    const { searchIsObjectID, searchQuery } = this;
    // TODO [lliepert]: replace .instance calls with initialization vars
    const { currentPath } = NavigationStore.instance();
    const { client } = ApolloStore.instance();
    if (!searchIsObjectID) {
      return null;
    }

    const { data } = await client.query<
      ObjectSearchQueryResponseType,
      ObjectSearchQueryRequestType
    >({
      query: OBJECT_SEARCH_QUERY,
      variables: {
        objectId: searchQuery,
        currentPath,
      },
    });

    if (data.chrome?.objectSearch == null) {
      return null;
    }

    const {
      chrome: { objectSearch },
    } = data;

    return {
      url: objectSearch.url,
      type: ObjectSearchTypeToResultType[objectSearch.type],
      title: objectSearch.title,
      description: objectSearch.description,
      imageUrl: objectSearch.imageUrl,
      nuggets: objectSearch.nuggets ?? undefined,
    };
  };

  @computed
  get searchIsObjectID(): boolean {
    return Id.isValid(this.searchQuery.trim());
  }

  getZendeskResults = async (): Promise<
    ReadonlyArray<NavigationSearchResult>
  > => {
    const { searchQuery } = this;
    const { isMerchant } = UserStore.instance();
    const { locale } = LocalizationStore.instance();
    if (!isMerchant || searchQuery.trim().length == 0) {
      return [];
    }

    const zendeskData = await queryZendesk({
      query: searchQuery,
      locale,
    });

    if (zendeskData == null) {
      return [];
    }

    return zendeskData.results.map((result) => {
      return {
        type: "zendesk",
        url: result.html_url,
        title: result.title,
        description: result.snippet.replace(/<[^>]*>?/gm, ""),
        open_in_new_tab: true,
      };
    });
  };

  flattenNodes(
    node: ChromeNavigationNode,
    parents: ReadonlyArray<ChromeNavigationNode>,
  ): ReadonlyArray<FlattenedNode> {
    if (node == null || node.children == null || node.children.length == 0) {
      return [
        {
          node,
          parents,
        },
      ];
    }

    return flatten(
      node.children.map((child) =>
        this.flattenNodes(child, [...parents, node]),
      ),
    );
  }

  convertToDocuments(
    flattenedNodes: ReadonlyArray<FlattenedNode>,
  ): ReadonlyArray<NavigationSearchResult> {
    const globalMaxHits = Math.max(
      ...flattenedNodes.map(({ node }) => node.totalHits || 0),
    );
    const globalMostRecentHit = Math.max(
      ...flattenedNodes.map(({ node }) => node.mostRecentHit?.unix || 0),
    );

    const weightedNodes: ReadonlyArray<WeightedNode> = flattenedNodes.map(
      (node) => {
        const {
          node: { totalHits, mostRecentHit },
        } = node;
        const frequencyScore =
          globalMaxHits == 0 || totalHits == null
            ? 0
            : totalHits / globalMaxHits;
        const recencyScore =
          globalMostRecentHit == 0 || mostRecentHit == null
            ? 0
            : mostRecentHit.unix / globalMostRecentHit;

        const weight = 0.6 * frequencyScore + 0.4 * recencyScore;

        return { ...node, weight, isTypeWeightedNode: true };
      },
    );

    return weightedNodes.map((weightedNode) => {
      const {
        node: { label: title, url, keywords, description, searchPhrase },
        parents,
        weight,
      } = weightedNode;
      const breadcrumbs = [...parents.map((node) => node.label), title].filter(
        (crumb) => crumb != null,
      ) as ReadonlyArray<string>;
      return {
        type: "page",
        url,
        title: searchPhrase || title,
        keywords,
        description,
        breadcrumbs,
        searchPhrase: searchPhrase || title,
        weight,
        payload: weightedNode,
      };
    });
  }

  @computed
  get searchDocuments(): ReadonlyArray<NavigationSearchResult> {
    const { flattenedNodes } = this;
    return this.convertToDocuments(flattenedNodes);
  }

  @computed
  get flattenedNodes(): ReadonlyArray<FlattenedNode> {
    const { tree } = this;
    if (tree == null) {
      return [];
    }

    return flatten(
      (tree?.children ?? []).map((node) => this.flattenNodes(node, [])),
    );
  }

  @computed
  get mostRecentlyVisitedPages(): ReadonlyArray<NavigationSearchResult> {
    const { searchDocuments } = this;
    return sortBy(
      searchDocuments,
      ({ payload }) => -1 * (payload?.node.mostRecentHit?.unix ?? 0),
    )
      .filter(({ payload }) => payload?.node.nodeid != "home")
      .slice(0, 10)
      .map((doc) => ({ ...doc, type: "recent_page" }));
  }

  @computed
  get frequentlyVisitedPages(): ReadonlyArray<NavigationSearchResult> {
    const { searchDocuments, mostRecentlyVisitedPages } = this;
    const res: NavigationSearchResult[] = sortBy(
      searchDocuments,
      ({ payload }) => -1 * (payload?.node.totalHits || 0),
    )
      .filter(({ payload }) => payload?.node.nodeid != "home")
      .slice(0, 10);

    return res
      .map(
        (doc): NavigationSearchResult => ({
          ...doc,
          type: "frequent_page",
        }),
      )
      .filter(
        ({ url, title }) =>
          !mostRecentlyVisitedPages.some(
            (doc) => doc.title == title && doc.url == url,
          ),
      );
  }
}

const SearchStoreContext = createContext(
  new SearchStore({
    tree: undefined,
  }),
);

export const SearchStoreProvider: React.FC<SearchStoreProps> = ({
  children,
  tree,
}) => {
  const [searchStore] = useState(new SearchStore({ tree }));

  return (
    <SearchStoreContext.Provider value={searchStore}>
      {children}
    </SearchStoreContext.Provider>
  );
};

export const useSearchStore = (): SearchStore => {
  return useContext(SearchStoreContext);
};
