import React from "react";
import { observer } from "mobx-react";
import { ci18n } from "@core/toolkit/i18n";
import { usePageState } from "@promotions/eligible-products-csv/StateContext";
import { Heading, Text } from "@ContextLogic/atlas-ui";
import SelectEventTable from "./select-event-table/SelectEventTable";

const SelectEventSection: React.FC = () => {
  const state = usePageState();

  return state.promotionType !== "SPEND_MORE_AND_SAVE_MORE" ? null : (
    <>
      <style jsx>{`
        div :global(table div) {
          font-size: 14px;
        }
      `}</style>
      <div>
        <Heading variant="h4" sx={{ marginTop: "24px" }}>
          Select Event
        </Heading>
        <Text>
          You can add products to events until 10 calendar days prior to the
          first day of the event. You cannot cancel an event promotion once
          approved. Products can only appear in one promotion type at a time.
        </Text>
        <Heading variant="h5" sx={{ marginTop: "16px", marginBottom: "12px" }}>
          {ci18n("title for a table", "Sunday Wish")}
        </Heading>
        <SelectEventTable eventTypes={["FLASH_SALE"]} />
        <Heading variant="h5" sx={{ marginTop: "16px", marginBottom: "12px" }}>
          {ci18n("title for a table", "Seasonal Events")}
        </Heading>
        <SelectEventTable eventTypes={["PRICE_DISCOUNT"]} />
      </div>
    </>
  );
};

export default observer(SelectEventSection);
