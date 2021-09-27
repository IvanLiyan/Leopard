import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const noticeText =
  i`This amount may be calculated in the merchant’s local ` +
  i`currency and/or be subject to [Merchant Policy 11](${"#currency"}).`;
const noticeMarkdown = `&ast; ${noticeText}`;

const LocalCurrencyNotice = () => {
  return (
    <PolicySubSection>
      <Markdown text={noticeMarkdown} />
    </PolicySubSection>
  );
};

export default observer(LocalCurrencyNotice);
