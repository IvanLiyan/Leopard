import { NextPage } from "next";
import Link from "@core/components/Link";

const DemoPageB: NextPage<Record<string, never>> = () => {
  return (
    <>
      <Link href={`${window.location.origin}/iwzzrevqfxvsfoxwmhty`}>
        Merch-FE Page
      </Link>
      <Link href="/gpwatzaexrwtnrbqrhot">Leopard Page</Link>
      <Link
        href={`${window.location.origin}/iwzzrevqfxvsfoxwmhty`}
        openInNewTab
      >
        Merch-FE Page in New Tab
      </Link>
      <Link href="/gpwatzaexrwtnrbqrhot" openInNewTab>
        Leopard Page in New Tab
      </Link>
    </>
  );
};

export default DemoPageB;
