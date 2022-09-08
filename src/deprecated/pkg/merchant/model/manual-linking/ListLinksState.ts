import { observable, action } from "mobx";

/* Types */
import {
  LinkedStoreListData,
  ManualMerchantConnectionsQueryResponseType,
  MANUAL_MERCHANT_CONNECTIONS_QUERY,
} from "@toolkit/manual-linking/list-links";

/* Stores */
import ApolloStore from "@stores/ApolloStore";

/**
 * Manual linking - list links state
 */
export default class ListLinksState {
  @observable
  linkedStoreList: ReadonlyArray<LinkedStoreListData> = [];

  @observable
  linkedStoreNum: number = 0;

  @observable
  isLoading: boolean = false;

  constructor() {
    this.fetchLinkedStores();
  }

  /**
   * fetchLinkedStores - fetch all manually linked stores
   */
  @action
  fetchLinkedStores = async () => {
    const { client } = ApolloStore.instance();

    this.isLoading = true;

    const { data } = await client.query<
      ManualMerchantConnectionsQueryResponseType,
      {}
    >({
      query: MANUAL_MERCHANT_CONNECTIONS_QUERY,
      fetchPolicy: "no-cache",
    });

    const currentMerchantId = data?.currentUser?.merchantId;
    const connectionList = data?.currentUser?.manualMerchantConnections;

    // No data is returned
    if (!connectionList || !currentMerchantId) {
      this.linkedStoreList = [];
      this.linkedStoreNum = 0;
      this.isLoading = false;
      return;
    }

    // Format store data
    const formattedStoreList = connectionList.map((connection) => {
      // For manual connections, there will only be 2 merchants inside each connection.
      // One is the current merchant, and the other is the linked merchant.
      const merchant = connection.merchants.filter(
        (merchant) => merchant.id !== currentMerchantId
      );

      return {
        id: merchant[0].id,
        email: merchant[0].email,
        displayName: merchant[0].displayName,
        displayPictureUrl: merchant[0].displayPictureUrl,
      };
    });

    this.linkedStoreList = formattedStoreList;
    this.linkedStoreNum = formattedStoreList.length;
    this.isLoading = false;
  };
}
