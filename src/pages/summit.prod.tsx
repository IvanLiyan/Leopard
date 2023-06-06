import { Button } from "@ContextLogic/atlas-ui";
import { useToastStore } from "@core/stores/ToastStore";
import { ci18n } from "@core/toolkit/i18n";
import { NextPage } from "next";
import Script from "next/script";

declare global {
  interface Window {
    // Disabling because Salesforce doesn't provide typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EBWidgets: any;
  }
}

const EUSummitPage: NextPage<Record<string, never>> = () => {
  const toastStore = useToastStore();

  return (
    <>
      <Script src="https://www.eventbrite.com/static/widgets/eb_widgets.js" />
      <Button
        id="eventbrite-widget-modal-trigger-638743477937"
        onClick={() => {
          window.EBWidgets.createWidget({
            widgetType: "checkout",
            eventId: "638743477937",
            modal: true,
            modalTriggerElementId:
              "eventbrite-widget-modal-trigger-638743477937",
            onOrderComplete: () =>
              toastStore.positive(
                ci18n(
                  "Merchant has successfully signed up for EU Summit through Eventbrite",
                  "Order complete",
                ),
              ),
          });
        }}
        sx={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        {ci18n("CTA text", "Register Now")}
      </Button>
      <noscript>
        <a
          href="https://www.eventbrite.com/e/test-event-tickets-638743477937"
          rel="noopener noreferrer"
          target="_blank"
        >
          Buy Tickets on Eventbrite
        </a>
      </noscript>
      <iframe
        style={{
          height: `100vh`,
          width: "100%",
          border: 0,
        }}
        src="https://merchantblog.wish.com/ev-test?hs_preview=BKUIbzyb-116084126037"
      ></iframe>
    </>
  );
};

export default EUSummitPage;
