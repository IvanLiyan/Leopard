import { TopBarHeight } from "@chrome/components/chrome/ChromeTopBar";
import { NextPage } from "next";

const EUSummitPage: NextPage<Record<string, never>> = () => {
  return (
    <iframe
      style={{
        height: `calc(100vh - ${TopBarHeight}px)`,
        width: "100%",
        border: 0,
      }}
      src="https://merchantblog.wish.com/ev-test?hs_preview=BKUIbzyb-116084126037"
    ></iframe>
  );
};

export default EUSummitPage;
