import { Button, Text } from "@ContextLogic/atlas-ui";
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
        size="large"
        id="eventbrite-widget-modal-trigger-648285809307"
        onClick={() => {
          window.EBWidgets.createWidget({
            widgetType: "checkout",
            eventId: "648285809307",
            modal: true,
            modalTriggerElementId:
              "eventbrite-widget-modal-trigger-648285809307",
            onOrderComplete: () =>
              toastStore.positive(
                ci18n(
                  "Merchant has successfully signed up for EU Summit through Eventbrite",
                  "Order complete",
                ),
              ),
          });
        }}
        sx={{
          position: "fixed",
          bottom: "130px",
          left: "10px",
          borderRadius: "21px",
          textTransform: "none",
          color: "black",
          border: "1px solid black",
          fontWeight: "bold",
          backgroundColor: "#DAEE32",
          "&:hover": {
            backgroundColor: "#AEBE28",
          },
        }}
      >
        <Text variant="bodyM">{ci18n("CTA text", "Register Now")}</Text>
      </Button>
      <noscript>
        <a
          href="https://www.eventbrite.com/e/wish-passport-european-merchant-summit-tickets-648285809307"
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
        src="https://merchantblog.wish.com/wish-passport"
      ></iframe>
    </>
  );
};

export default EUSummitPage;
