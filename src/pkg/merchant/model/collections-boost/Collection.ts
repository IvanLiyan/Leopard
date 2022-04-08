/* External Libraries */
import { observable } from "mobx";

/* Merchant API */
import {
  CollectionsProduct,
  CollectionsBoostCollectionState,
  CollectionsBoostSource,
} from "@merchant/api/collections-boost";

export default class Collection {
  @observable
  name: string | undefined;

  @observable
  logoUrl: string | undefined;

  @observable
  products: Array<CollectionsProduct> = [];

  @observable
  searchQueries: string | undefined;

  @observable
  relatedProducts: string | undefined;

  @observable
  state: CollectionsBoostCollectionState = "PENDING";

  // Old copy of field values
  @observable
  oldName: string | undefined;

  @observable
  oldLogoUrl: string | undefined;

  @observable
  oldProducts: Array<CollectionsProduct> = [];

  @observable
  oldSearchQueries: string | undefined;

  @observable
  source: CollectionsBoostSource = "MANUAL";

  requireResetState(): boolean {
    const compareProducts = (
      p1: CollectionsProduct,
      p2: CollectionsProduct
    ): number => {
      return p1.product_id > p2.product_id ? 1 : -1;
    };
    const sortedProducts = JSON.stringify(
      [...this.products].sort(compareProducts)
    );
    const sortedOldProducts = JSON.stringify(
      [...this.oldProducts].sort(compareProducts)
    );
    const productChanged = sortedProducts !== sortedOldProducts;

    return (
      this.name !== this.oldName ||
      this.logoUrl !== this.oldLogoUrl ||
      this.searchQueries !== this.oldSearchQueries ||
      productChanged
    );
  }
}
