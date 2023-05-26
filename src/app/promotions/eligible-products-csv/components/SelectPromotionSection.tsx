import React from "react";
import { observer } from "mobx-react";
import RadioCard from "@core/components/RadioCard";
import { ci18n } from "@core/toolkit/i18n";
import {
  usePageState,
  useDispatch,
} from "@promotions/eligible-products-csv/StateContext";
import SelectEventSection from "./SelectEventSection";

const SelectPromotionSection: React.FC = () => {
  const state = usePageState();
  const dispatch = useDispatch();

  return (
    <>
      <style jsx>{`
        .radio-container {
          display: grid;
          grid-template-columns: 200px 200px 200px;
          gap: 24px;
        }
        @media (max-width: 650px) {
          .radio-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="radio-container">
        <RadioCard
          checked={state.selectedPromotion === "DISCOUNT"}
          text={ci18n("a type of promotion", "Discount")}
          onChange={() => {
            dispatch({ type: "SELECT_DISCOUNT" });
          }}
        />
        <RadioCard
          checked={state.selectedPromotion === "FLASH_SALE"}
          text={ci18n("a type of promotion", "Flash Sale")}
          onChange={() => {
            dispatch({ type: "SELECT_FLASH_SALE" });
          }}
        />
        <RadioCard
          checked={state.selectedPromotion === "EVENT"}
          text={ci18n("a type of promotion", "Event")}
          onChange={() => {
            dispatch({ type: "SELECT_EVENT" });
          }}
        />
      </div>
      <SelectEventSection />
    </>
  );
};

export default observer(SelectPromotionSection);
