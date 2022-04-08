import { NextPage } from "next";
import { Button, Layout } from "@ContextLogic/lego";
import { useToastStore } from "@stores/ToastStore";

const HelloWorldPage: NextPage<Record<string, never>> = () => {
  const toastStore = useToastStore();

  return (
    <Layout.FlexColumn>
      <Layout.FlexRow>hello world</Layout.FlexRow>
      <Button
        onClick={() => {
          toastStore.positive("triggered");
        }}
      >
        Trigger Toast
      </Button>
    </Layout.FlexColumn>
  );
};

export default HelloWorldPage;
