import React, { createContext, useContext, useReducer } from "react";
import { MfpCampaignPromotionType } from "@schema";

type PromotionType = "DISCOUNT" | "FLASH_SALE" | "EVENT";

type State = {
  readonly selectedPromotion: PromotionType | null;
  readonly promotionType: MfpCampaignPromotionType | null;
  readonly eventId: string | null;
  readonly isValid: boolean;
};

type Action =
  | { readonly type: "SELECT_DISCOUNT" }
  | { readonly type: "SELECT_FLASH_SALE" }
  | { readonly type: "SELECT_EVENT" }
  | {
      readonly type: "SET_EVENT_ID";
      readonly eventId: string;
      readonly promotionType: MfpCampaignPromotionType;
    };

const initialState: State = {
  selectedPromotion: null,
  promotionType: null,
  eventId: null,
  isValid: false,
};

const getNewState = (state: State): State => ({
  ...state,
  isValid:
    state.selectedPromotion !== null &&
    (state.selectedPromotion !== "EVENT" ||
      (state.eventId !== "" && state.eventId != null)),
});

const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SELECT_DISCOUNT": {
      return state.selectedPromotion === "DISCOUNT"
        ? state
        : getNewState({
            ...state,
            selectedPromotion: "DISCOUNT",
            promotionType: "PRICE_DISCOUNT",
            eventId: null,
          });
    }
    case "SELECT_FLASH_SALE": {
      return state.selectedPromotion === "FLASH_SALE"
        ? state
        : getNewState({
            ...state,
            selectedPromotion: "FLASH_SALE",
            promotionType: "FLASH_SALE",
            eventId: null,
          });
    }
    case "SELECT_EVENT": {
      return state.selectedPromotion === "EVENT"
        ? state
        : getNewState({
            ...state,
            selectedPromotion: "EVENT",
            eventId: null,
          });
    }
    case "SET_EVENT_ID": {
      return getNewState({
        ...state,
        eventId: action.eventId,
        promotionType: action.promotionType,
      });
    }
  }
};

const StateContext = createContext<State>(initialState);

const DispatchContext = createContext<React.Dispatch<Action>>(() => {
  throw Error("reached default dispatch");
});

export const StateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const usePageState = () => {
  return useContext(StateContext);
};

export const useDispatch = () => {
  return useContext(DispatchContext);
};
