/* External Libraries */
import { observable } from "mobx";

/* Lego Toolkit */
import { CurrencyCode } from "@toolkit/currency";

/* Merchant API */
import {
  CollectionsBoostSearchQuery,
  CollectionsBoostPriceDropExistingOverlap,
} from "@merchant/api/collections-boost";

export default class Campaign {
  @observable
  name: string = "";

  @observable
  collectionId: string = "";

  @observable
  campaignId: string = "";

  @observable
  conversionRate: number = 1;

  @observable
  conversionTableId: string = "";

  @observable
  isAutoRenew: boolean = false;

  @observable
  localizedCurrency: CurrencyCode = "USD";

  @observable
  startDate: Date = new Date();

  @observable
  searchQueries: Array<CollectionsBoostSearchQuery> = [];

  @observable
  campaignDropPercentage: number = 0;

  @observable
  campaignPriceDropEnabled: boolean = false;

  @observable
  productsWithOverlappedPriceDropRecords: Array<
    CollectionsBoostPriceDropExistingOverlap
  > = [];

  constructor({
    name = "",
    collectionId = "",
    campaignId = "",
    conversionRate = 1,
    conversionTableId = "",
    startDate = new Date(),
    searchQueries = [],
    isAutoRenew = false,
    localizedCurrency = "USD",
    campaignDropPercentage = 0,
    campaignPriceDropEnabled = false,
    productsWithOverlappedPriceDropRecords = [],
  }: {
    readonly name?: string;
    readonly collectionId?: string;
    readonly campaignId?: string;
    readonly conversionRate?: number;
    readonly conversionTableId?: string;
    readonly startDate?: Date;
    readonly searchQueries?: Array<CollectionsBoostSearchQuery>;
    readonly isAutoRenew?: boolean;
    readonly localizedCurrency?: CurrencyCode;
    readonly campaignDropPercentage?: number;
    readonly campaignPriceDropEnabled?: boolean;
    readonly productsWithOverlappedPriceDropRecords?: Array<
      CollectionsBoostPriceDropExistingOverlap
    >;
  } = {}) {
    this.name = name;
    this.collectionId = collectionId;
    this.campaignId = campaignId;
    this.conversionRate = conversionRate;
    this.conversionTableId = conversionTableId;
    this.startDate = startDate;
    this.searchQueries = searchQueries;
    this.isAutoRenew = isAutoRenew;
    this.localizedCurrency = localizedCurrency;
    this.campaignDropPercentage = campaignDropPercentage;
    this.campaignPriceDropEnabled = campaignPriceDropEnabled;
    this.productsWithOverlappedPriceDropRecords = productsWithOverlappedPriceDropRecords;
  }
}
