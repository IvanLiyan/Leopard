import React, { useState } from "react";
import { observer } from "mobx-react";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageGuide from "@plus/component/nav/PageGuide";
import SetStoreHours from "@plus/component/settings/store-hours-settings/SetStoreHours";

/* Lego Toolkit */
import { useBoolQueryParam } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Schema */
import StoreHoursSettingsState from "@plus/model/StoreHoursSettingsState";

type Props = BaseProps;

const PlusStoreHoursSettingsContainer: React.FC<Props> = () => {
  const [isOnboarding] = useBoolQueryParam("onboarding");
  const [state] = useState(new StoreHoursSettingsState({ isOnboarding }));

  return (
    <PageRoot>
      <PlusWelcomeHeader title={i`Set store hours`} breadcrumbs={[]} />
      <PageGuide>
        <SetStoreHours state={state} />
      </PageGuide>
    </PageRoot>
  );
};

export default observer(PlusStoreHoursSettingsContainer);
