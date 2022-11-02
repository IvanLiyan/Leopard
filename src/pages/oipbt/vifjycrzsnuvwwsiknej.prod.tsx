import { NextPage } from "next";
import { Button } from "@ContextLogic/atlas-ui";
import { useNavigationStore } from "@core/stores/NavigationStore";

const DemoPageC: NextPage<Record<string, never>> = () => {
  const { back } = useNavigationStore();

  return (
    <>
      <Button
        // @ts-ignore sx is passed down, need to update atlas-ui typing
        sx={{ maxWidth: 280 }}
        onClick={back}
      >
        Go Back
      </Button>
    </>
  );
};

export default DemoPageC;
