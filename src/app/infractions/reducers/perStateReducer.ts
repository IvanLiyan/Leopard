import { Attachment } from "@core/components/SecureFileInput";
import { ProductEditRequestGetPreviousResponse } from "@infractions/api/productEditRequestGetPreviousResponseRequest";

type State = {
  readonly name: string | undefined;
  readonly description: string | undefined;
  readonly mainImages: ReadonlyArray<Partial<Attachment>>;
  readonly additionalImages: ReadonlyArray<Partial<Attachment>>;
  readonly variations: ReadonlyArray<{
    readonly id: string;
    readonly manufacturerId: string | undefined;
    readonly uploadDate: string | undefined;
    readonly currency: string | undefined;
    readonly price: string | undefined;
    readonly color: string | undefined;
    readonly size: string | undefined;
  }>;
  readonly submissionJson: Record<string, string | undefined>;
};

type Action =
  | {
      readonly type: "RESET_STATE";
      readonly currentProduct: ProductEditRequestGetPreviousResponse["result"];
    }
  | { readonly type: "UPDATE_PRODUCT_NAME"; readonly name: string }
  | { readonly type: "UPDATE_DESCRIPTION"; readonly description: string }
  | {
      readonly type: "UPDATE_MAIN_IMAGES";
      readonly images: ReadonlyArray<Partial<Attachment>>;
    }
  | {
      readonly type: "UPDATE_ADDITIONAL_IMAGES";
      readonly images: ReadonlyArray<Partial<Attachment>>;
    }
  | {
      readonly type: "UPDATE_VARIATION_PRICE";
      readonly variationId: string;
      readonly price: string;
    }
  | {
      readonly type: "UPDATE_VARIATION_COLOR";
      readonly variationId: string;
      readonly color: string;
    }
  | {
      readonly type: "UPDATE_VARIATION_SIZE";
      readonly variationId: string;
      readonly size: string;
    };

export const initialState: State = {
  name: undefined,
  description: undefined,
  mainImages: [],
  additionalImages: [],
  variations: [],
  submissionJson: {},
};

const perStateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "RESET_STATE": {
      if (!action.currentProduct) {
        return initialState;
      }

      return {
        name: action.currentProduct.name ?? undefined,
        description: action.currentProduct.description ?? undefined,
        mainImages: action.currentProduct.small_picture
          ? [
              {
                fileName: "mainImage",
                url: action.currentProduct.small_picture,
              },
            ]
          : [],
        additionalImages: action.currentProduct.extra_photos
          ? action.currentProduct.extra_photos.map((url, i) => ({
              fileName: `additionalImage${i}`,
              url: url,
            }))
          : [],
        variations: action.currentProduct.variations
          ? Object.entries(action.currentProduct.variations).map(([k, e]) => ({
              id: k,
              manufacturerId: e.manufacturer_id ?? undefined,
              uploadDate: e.upload_date ?? undefined,
              currency: e.currency ?? undefined,
              price: e.price ?? undefined,
              color: e.color ?? undefined,
              size: e.size ?? undefined,
            }))
          : [],
        submissionJson: {},
      };
    }
    case "UPDATE_PRODUCT_NAME": {
      return {
        ...state,
        name: action.name,
        submissionJson: {
          ...state.submissionJson,
          name: action.name,
        },
      };
    }
    case "UPDATE_DESCRIPTION": {
      return {
        ...state,
        description: action.description,
        submissionJson: {
          ...state.submissionJson,
          description: action.description,
        },
      };
    }
    case "UPDATE_MAIN_IMAGES": {
      return {
        ...state,
        mainImages: action.images,
        submissionJson: {
          ...state.submissionJson,
          "image-main": action.images[0].url,
        },
      };
    }
    case "UPDATE_ADDITIONAL_IMAGES": {
      // TODO: find example of legacy API handling existing additional images
      return state;
    }
    case "UPDATE_VARIATION_PRICE": {
      return {
        ...state,
        variations: state.variations.map((v) =>
          v.id == action.variationId
            ? {
                ...v,
                price: action.price,
              }
            : v,
        ),
        submissionJson: {
          ...state.submissionJson,
          [`variation-price-${action.variationId}`]: action.price,
        },
      };
    }
    case "UPDATE_VARIATION_COLOR": {
      return {
        ...state,
        variations: state.variations.map((v) =>
          v.id == action.variationId
            ? {
                ...v,
                color: action.color,
              }
            : v,
        ),
        submissionJson: {
          ...state.submissionJson,
          [`variation-color-${action.variationId}`]: action.color,
        },
      };
    }
    case "UPDATE_VARIATION_SIZE": {
      return {
        ...state,
        variations: state.variations.map((v) =>
          v.id == action.variationId
            ? {
                ...v,
                size: action.size,
              }
            : v,
        ),
        submissionJson: {
          ...state.submissionJson,
          [`variation-size-${action.variationId}`]: action.size,
        },
      };
    }
  }
};

export default perStateReducer;
