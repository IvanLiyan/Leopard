import { NextPage } from "next";
import { Button } from "@ContextLogic/atlas-ui";
import Link from "@core/components/Link";
import { useToastStore } from "@core/stores/ToastStore";
import { useNavigationStore } from "@src/app/core/stores/NavigationStore";

const DemoPageA: NextPage<Record<string, never>> = () => {
  const toastStore = useToastStore();
  const { back } = useNavigationStore();

  return (
    <>
      <Button
        // @ts-ignore sx is passed down, need to update atlas-ui typing
        sx={{
          maxWidth: 280,
          marginTop: "60px",
        }}
        onClick={() => {
          toastStore.positive("triggered");
        }}
      >
        Trigger Toast
      </Button>
      <Button
        // @ts-ignore sx is passed down, need to update atlas-ui typing
        sx={{ maxWidth: 280 }}
        onClick={back}
      >
        Go Back
      </Button>
      <Link href={`${window.location.origin}/iwzzrevqfxvsfoxwmhty`}>
        Merch-FE Page
      </Link>
      <Link href="/mhbowxexoiiqwgczbpjd">Leopard Page</Link>
      <Link
        href={`${window.location.origin}/iwzzrevqfxvsfoxwmhty`}
        openInNewTab
      >
        Merch-FE Page in New Tab
      </Link>
      <Link href="/mhbowxexoiiqwgczbpjd" openInNewTab>
        Leopard Page in New Tab
      </Link>
      <Link href="/oipbt/vifjycrzsnuvwwsiknej">Leopard Sub-Page</Link>
      Build #: 4266282991
    </>
  );
};

export default DemoPageA;
