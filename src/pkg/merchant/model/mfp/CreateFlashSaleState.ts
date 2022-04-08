/* External Libraries */
import { observable, computed } from "mobx";

import { CountryCode } from "@schema/types";
import CreateCampaignState from "@merchant/model/mfp/CreateCampaignState";
import {
  campaignNameError,
  FLASH_SALE_WINDOW_LENGTH,
  EligibleProductInfo,
} from "@toolkit/mfp/tools";
import moment from "moment/moment";

export default class CreateFlashSaleState extends CreateCampaignState {
  @observable
  campaignName?: string;

  @observable
  startDate?: Date;

  @observable
  countries: ReadonlyArray<CountryCode> = [];

  @observable
  showConfigureDetailsErrors: boolean = false;

  @observable
  showSetDiscountsErrors: boolean = false;

  @computed
  get endDate(): Date | undefined {
    return this.startDate == null
      ? undefined
      : moment(this.startDate).add(FLASH_SALE_WINDOW_LENGTH, "days").toDate();
  }

  @computed
  get campaignNameError(): string | null | undefined {
    const { campaignName } = this;
    return campaignNameError({ name: campaignName });
  }

  @computed
  get tooManyVariations(): boolean {
    const {
      initialData: { platformConstants },
    } = this;
    const maxVariations =
      platformConstants?.mfp?.campaign?.maxProductVariations;
    return (
      maxVariations != null && this.numberOfSelectedVariations > maxVariations
    );
  }

  tooFewVariations = (product: EligibleProductInfo): boolean => {
    const {
      initialData: { platformConstants },
    } = this;

    const minimumPercentageRequired =
      platformConstants?.mfp?.flashSaleCampaign?.minimumPercentageRequired || 0;
    const selectedVariationsCount = this.getSelectedVariations(product).length;

    const totalVariations = this.getSelectedProductTotalVariations({
      productId: product.product.id,
    });

    return (
      selectedVariationsCount > 0 &&
      (100 * selectedVariationsCount) / totalVariations <
        minimumPercentageRequired
    );
  };

  @computed
  get productTableError(): string | null | undefined {
    const {
      numberOfSelectedVariations,
      tooManyVariations,
      initialData: { platformConstants },
    } = this;

    if (numberOfSelectedVariations == 0) {
      return i`Please add products to your promotion`;
    }

    const maxVariations =
      platformConstants?.mfp?.campaign?.maxProductVariations;

    if (tooManyVariations && maxVariations != null) {
      const MaxVariationsString = numeral(maxVariations)
        .format("0,0")
        .toString();
      return i`Promotions cannot have over ${MaxVariationsString} variations`;
    }

    if (
      this.selectedProducts.some((productInfo) => {
        return productInfo.variations.some((variation) => {
          return (
            this.getVariationQuantity({
              productId: productInfo.product.id,
              variationId: variation.id,
            }) == 0
          );
        });
      })
    ) {
      return i`Selected products and variations must have quantity greater than ${0}.`;
    }

    if (this.selectedProducts.some((value) => this.tooFewVariations(value))) {
      const minimumPercentageRequired =
        platformConstants?.mfp?.flashSaleCampaign?.minimumPercentageRequired ||
        0;

      if (this.selectedProducts.some((value) => this.tooFewVariations(value))) {
        return minimumPercentageRequired == 100
          ? i`All variations must be selected for each product.`
          : i`At least ${minimumPercentageRequired}% of variations must be selected for each product.`;
      }
    }
  }

  @computed
  get errorMessageConfigureDetails(): string | null | undefined {
    const errors = [this.campaignNameError, this.productTableError];

    // Disabling false positive lint error
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    return errors.find((error) => {
      return error != null;
    });
  }

  @computed
  get errorMessageSetDiscounts(): string | null | undefined {
    const {
      selectedProducts,
      initialData: { platformConstants },
    } = this;

    const minDiscountPercentage =
      platformConstants?.mfp?.flashSaleCampaign?.minDiscountPercentage || 0;
    const maxDiscountPercentage =
      platformConstants?.mfp?.flashSaleCampaign?.maxDiscountPercentage || 100;

    const hasMissingOrSmallDiscount = selectedProducts.some(
      ({ product, variations }) => {
        return variations.some((variation) => {
          const amountSelected = this.getVariationQuantity({
            productId: product.id,
            variationId: variation.id,
          });
          if (amountSelected == null || amountSelected == 0) {
            return false;
          }
          const discount = this.getVariationDiscount({
            productId: product.id,
            variationId: variation.id,
          });
          return (
            discount == null ||
            discount < minDiscountPercentage ||
            discount > maxDiscountPercentage
          );
        });
      }
    );

    if (hasMissingOrSmallDiscount) {
      return i`All discount percentages must be between ${minDiscountPercentage}% and ${maxDiscountPercentage}%`;
    }
  }
}
