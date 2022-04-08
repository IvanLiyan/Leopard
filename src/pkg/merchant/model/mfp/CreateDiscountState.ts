/* External Libraries */
import { computed, observable } from "mobx";
import numeral from "numeral";

import { CountryCode } from "@schema/types";
import CreateCampaignState from "@merchant/model/mfp/CreateCampaignState";
import {
  discountEndTimeError,
  discountStartTimeError,
  campaignNameError,
  EligibleProductInfo,
} from "@toolkit/mfp/tools";

export default class CreateDiscountState extends CreateCampaignState {
  @observable
  campaignName?: string;

  @observable
  startDate?: Date;

  @observable
  startHour?: number;

  @observable
  endDate?: Date;

  @observable
  endHour?: number;

  @observable
  countries: ReadonlyArray<CountryCode> = [];

  @observable
  showConfigureDetailsErrors: boolean = false;

  @observable
  showSetDiscountsErrors: boolean = false;

  @computed
  get campaignNameError(): string | null | undefined {
    const { campaignName } = this;
    return campaignNameError({ name: campaignName });
  }

  @computed
  get startDateError(): string | null | undefined {
    const {
      startDate,
      startHour,
      initialData: { platformConstants },
    } = this;

    const minCampaignDelayInHour =
      platformConstants == null ||
      platformConstants.mfp == null ||
      platformConstants.mfp.campaign == null
        ? null
        : platformConstants.mfp.campaign.minCampaignDelayInHour;

    const maxCampaignDelayInHour =
      platformConstants == null ||
      platformConstants.mfp == null ||
      platformConstants.mfp.campaign == null
        ? null
        : platformConstants.mfp.campaign.maxCampaignDelayInHour;

    return discountStartTimeError({
      startDate,
      startHour,
      minCampaignDelayInHour,
      maxCampaignDelayInHour,
    });
  }

  @computed
  get endDateError(): string | null | undefined {
    const {
      startDate,
      startHour,
      endDate,
      endHour,
      initialData: { platformConstants },
    } = this;
    const maxCampaignDurationInDays =
      platformConstants == null ||
      platformConstants.mfp == null ||
      platformConstants.mfp.campaign == null
        ? null
        : platformConstants.mfp.campaign.maxCampaignDurationInDays;

    return discountEndTimeError({
      startDate,
      startHour,
      endDate,
      endHour,
      maxCampaignDurationInDays,
    });
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
      platformConstants?.mfp?.discountCampaign?.minimumPercentageRequired || 0;
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
        platformConstants?.mfp?.discountCampaign?.minimumPercentageRequired ||
        0;

      return minimumPercentageRequired == 100
        ? i`All variations must be selected for each product.`
        : i`At least ${minimumPercentageRequired}% of variations must be selected for each product.`;
    }
  }

  @computed
  get errorMessageConfigureDetails(): string | null | undefined {
    const errors = [
      this.campaignNameError,
      this.startDateError,
      this.endDateError,
      this.productTableError,
    ];

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
      platformConstants?.mfp?.discountCampaign?.minDiscountPercentage || 0;
    const maxDiscountPercentage =
      platformConstants?.mfp?.discountCampaign?.maxDiscountPercentage || 100;

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
