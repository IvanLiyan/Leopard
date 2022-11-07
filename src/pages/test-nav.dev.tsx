import { NextPage } from "next";
import { Layout } from "@ContextLogic/lego";

const TestNav: NextPage<Record<string, never>> = () => {
  return (
    <Layout.FlexColumn style={{ margin: 48 }}>
      I am a test page to ensure the app chrome works
    </Layout.FlexColumn>
  );
};

export default TestNav;
