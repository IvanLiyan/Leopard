/*

    MobX Store used to power the search bar in MD Chrome.
    Functionality copied from the SearchStore in CLROOT and kept in MobX
    to ease migration.

*/
import React, { useState, createContext, useContext } from "react";
import { observable, computed, reaction, toJS } from "mobx";

/* External Libraries */
import Id from "valid-objectid";
import Fuse from "fuse.js";
import sortBy from "lodash/sortBy";
import flatten from "lodash/flatten";

/* Lego Components */
import { NavigationNode } from "@toolkit/chrome";

/* Merchant API */
import * as adminApi from "@merchant/api/admin";
import * as chromeApi from "@merchant/api/chrome";
import * as zendeskApi from "@merchant/api/zendesk";

/* Relative Imports */
import UserStore from "@stores/UserStore";
import EnvironmentStore from "@stores/EnvironmentStore";
import LocalizationStore from "@stores/LocalizationStore";
import NavigationStore from "@stores/NavigationStore";

export const InternalUrlPrefix = "merchant://";

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
  readonly node: NavigationNode;
  readonly parents: ReadonlyArray<NavigationNode>;
};

export type WeightedNode = FlattenedNode & {
  readonly weight: number;
};

type SearchResultPayloadType = WeightedNode | undefined;

export type NavigationSearchResult = {
  readonly url: string;
  readonly type: ResultType;
  readonly title: string;
  readonly description?: null | string;
  readonly image_url?: null | string;
  readonly keywords?: ReadonlyArray<string>;
  readonly breadcrumbs?: ReadonlyArray<string>;
  readonly search_phrase?: string;
  readonly open_in_new_tab?: boolean;
  readonly nuggets?: ReadonlyArray<string | null>;
  readonly weight?: number;
  readonly payload?: SearchResultPayloadType;
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

    // TODO [lliepert]: confirm we don't need this in leopard
    // reaction(
    //   () => this.pageSearchResult,
    //   (pageSearchResult) => {
    //     const { isStoreUser } = UserStore.instance();
    //     const productName = isStoreUser ? i`Wish Local` : i`Wish for Merchants`;
    //     const appName = productName;
    //     if (pageSearchResult == null) {
    //       document.title = appName;
    //       return;
    //     }

    //     const { title } = pageSearchResult;
    //     document.title = `${title} | ${appName}`;
    //   },
    //   { fireImmediately: true },
    // );
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
        const url = new URL(doc.url);

        if (url.search || url.hash) {
          return doc.url.includes(pathAndSearch);
        }

        return location.pathname.startsWith(url.pathname);
      } catch {
        return false;
      }
    });

    const topResults = sortBy(results, (doc) => doc.url.length);
    return topResults[0];
  }

  @computed
  get fuzeSearch(): Fuse<NavigationSearchResult, any> {
    // TODO [lliepert]: fix any type before merging
    const { searchDocuments } = this;

    const keys: {
      name: keyof NavigationSearchResult;
      weight: number;
    }[] = [
      { name: "title", weight: 0.2 },
      { name: "search_phrase", weight: 0.3 },
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

  @computed
  get rawSearchResults(): ReadonlyArray<NavigationSearchResult> {
    const {
      objectSearchResult,
      searchQuery,
      zendeskResults,
      mostRecentlyVisitedPages,
      merchantSearchResults,
    } = this;
    if (searchQuery.trim().length == 0) {
      return mostRecentlyVisitedPages;
    }

    if (objectSearchResult != null) {
      return [objectSearchResult];
    }
    const results = this.fuzeSearch.search(this.searchQuery);

    const rankedResults = sortBy(results, (result) => {
      const finalScore =
        -1 *
        ((1 - (result.score || 0)) * 0.7 + (result.item.weight || 0) * 0.3);
      return finalScore;
    });
    return [
      ...rankedResults.map((result) => result.item),
      ...merchantSearchResults,
      ...zendeskResults,
    ];
  }

  @computed
  get searchResultGroups(): ReadonlyArray<SearchResultGroup> {
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

    const { rawSearchResults } = this;
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
  }

  @computed
  get objectSearchResult(): null | undefined | NavigationSearchResult {
    const { searchIsObjectID, searchQuery } = this;
    // TODO [lliepert]: replace .instance calls with initialization vars
    const { currentPath } = NavigationStore.instance();
    if (!searchIsObjectID) {
      return null;
    }

    return chromeApi.objectSearch({
      oid: searchQuery.trim(),
      current_path: currentPath,
    }).response?.data?.result;
  }

  @computed
  get searchIsObjectID(): boolean {
    return Id.isValid(this.searchQuery.trim());
  }

  @computed
  get zendeskResults(): ReadonlyArray<NavigationSearchResult> {
    const { searchQuery } = this;
    const { isMerchant } = UserStore.instance();
    const { locale } = LocalizationStore.instance();
    if (!isMerchant || searchQuery.trim().length == 0) {
      return [];
    }

    const results = zendeskApi.searchZendesk({
      query: searchQuery,
      locale,
    }).response?.data?.results;

    if (results == null) {
      return [];
    }

    return results.map((result) => {
      return {
        type: "zendesk",
        url: result.html_url,
        title: result.title,
        description: result.snippet.replace(/<[^>]*>?/gm, ""),
        open_in_new_tab: true,
      };
    });
  }

  @computed
  get merchantSearchResults(): ReadonlyArray<NavigationSearchResult> {
    const { searchQuery } = this;
    const { isMerchant } = UserStore.instance();
    const { currentPath } = NavigationStore.instance();
    const { isStaging } = EnvironmentStore.instance();

    if (isStaging || searchQuery.trim().length == 0) {
      return [];
    }

    const merchants = adminApi
      .getMerchants({
        start: 0,
        count: 3,
        query: searchQuery,
        sort: "username",
        order: "asc",
        submerchants: false,
        search_type: "",
        as_su: true,
        get_channel_partners: true,
      })
      .setOptions({ failSilently: true }).response?.data?.merchants;
    if (merchants == null) {
      return [];
    }

    const redirectPath = isMerchant && currentPath ? currentPath : "/";
    return merchants.map((merchant) => {
      return {
        type: "merchant",
        url: `/go/${merchant.merchant_id}?next=${encodeURIComponent(
          redirectPath,
        )}`,
        title: merchant.merchant_name,
      };
    });
  }

  flattenNodes(
    node: NavigationNode,
    parents: ReadonlyArray<NavigationNode>,
  ): ReadonlyArray<FlattenedNode> {
    if (node.children.length == 0) {
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
      ...flattenedNodes.map(({ node }) => node.total_hits || 0),
    );
    const globalMostRecentHit = Math.max(
      ...flattenedNodes.map(({ node }) => node.most_recent_hit || 0),
    );

    const weightedNodes: ReadonlyArray<WeightedNode> = flattenedNodes.map(
      (node) => {
        const {
          node: {
            total_hits: totalHits = 0,
            most_recent_hit: mostRecentHit = 0,
          },
        } = node;
        const frequencyScore =
          globalMaxHits == 0 || totalHits == null
            ? 0
            : totalHits / globalMaxHits;
        const recencyScore =
          globalMostRecentHit == 0 || mostRecentHit == null
            ? 0
            : mostRecentHit / globalMostRecentHit;

        const weight = 0.6 * frequencyScore + 0.4 * recencyScore;

        return { ...node, weight, isTypeWeightedNode: true };
      },
    );

    return weightedNodes.map((weightedNode) => {
      const {
        node: {
          label: title,
          url,
          keywords,
          description,
          search_phrase: searchPhrase,
        },
        parents,
        weight,
      } = weightedNode;
      const breadcrumbs = [...parents.map((node) => node.label), title];
      return {
        type: "page",
        url,
        title: searchPhrase || title,
        keywords,
        description,
        breadcrumbs,
        search_phrase: searchPhrase || title,
        weight,
        payload: weightedNode,
      };
    });
  }

  @computed
  get searchDocuments(): ReadonlyArray<NavigationSearchResult> {
    const { userSearchDocuments, adminSearchDocuments } = this;
    return [...userSearchDocuments, ...adminSearchDocuments];
  }

  @computed
  get userSearchDocuments(): ReadonlyArray<NavigationSearchResult> {
    // TODO [lliepert]: bring back once we have usergraphs accessible
    return [];
    //   const { flattenedNodes } = this;
    //   return this.convertToDocuments(flattenedNodes);
  }

  @computed
  get adminSearchDocuments(): ReadonlyArray<NavigationSearchResult> {
    // TODO [lliepert]: bring back once we have usergraphs accessible
    return [];
    //   const { isSuAdmin } = UserStore.instance();
    //   if (isSuAdmin) {
    //     // Don't show admin pages when spoofing
    //     return [];
    //   }

    //   const { flattenedAdminNodes } = this;
    //   return this.convertToDocuments(flattenedAdminNodes).map((doc) => ({
    //     ...doc,
    //     type: "admin_page",
    //   }));
  }

  @computed
  get flattenedNodes(): ReadonlyArray<FlattenedNode> {
    // TODO [lliepert]: bring back once we have usergraphs accessible
    return [];
    //   const { userGraph } = this;
    //   if (userGraph == null) {
    //     return [];
    //   }

    //   return flatten(
    //     userGraph.children.map((node) => this.flattenNodes(node, [])),
    //   );
  }

  @computed
  get flattenedAdminNodes(): ReadonlyArray<FlattenedNode> {
    // TODO [lliepert]: bring back once we have usergraphs accessible
    return [];
    //     const { adminGraph } = this;
    // if (adminGraph == null) {
    //   return [];
    // }

    // return flatten(
    //   adminGraph.children.map((node) => this.flattenNodes(node, [])),
    // ).map((node) => {
    //   const updatedNode = {
    //     ...node.node,
    //     url: `/go/me?next=${encodeURIComponent(node.node.url)}`,
    //   };
    //   return {
    //     ...node,
    //     node: updatedNode,
    //   };
    // });
  }

  @computed
  get mostRecentlyVisitedPages(): ReadonlyArray<NavigationSearchResult> {
    const { searchDocuments } = this;
    return sortBy(
      searchDocuments,
      ({ payload }) => -1 * (payload?.node.most_recent_hit || 0),
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
      ({ payload }) => -1 * (payload?.node.total_hits || 0),
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

const SearchStoreContext = createContext(new SearchStore());

export const SearchStoreProvider: React.FC = ({ children }) => {
  const [searchStore] = useState(new SearchStore());

  return (
    <SearchStoreContext.Provider value={searchStore}>
      {children}
    </SearchStoreContext.Provider>
  );
};

export const useSearchStore = (): SearchStore => {
  return useContext(SearchStoreContext);
};
