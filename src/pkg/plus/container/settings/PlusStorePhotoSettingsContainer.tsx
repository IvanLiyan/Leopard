import React, { useState } from "react";
import { observer } from "mobx-react";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageGuide from "@plus/component/nav/PageGuide";
import SetStorePhoto from "@plus/component/settings/store-photo-settings/SetStorePhoto";

/* Lego Toolkit */
import { useBoolQueryParam } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Schema */
import StorePhotoSettingsState from "@plus/model/StorePhotoSettingsState";

type Props = BaseProps;

const PlusStorePhotoSettingsContainer: React.FC<Props> = () => {
  const [isOnboarding] = useBoolQueryParam("onboarding");
  const [state] = useState(new StorePhotoSettingsState({ isOnboarding }));

  return (
    <PageRoot>
      <PlusWelcomeHeader title={i`Add a storefront photo`} breadcrumbs={[]} />
      <PageGuide>
        <SetStorePhoto state={state} />
      </PageGuide>
    </PageRoot>
  );
};

export default observer(PlusStorePhotoSettingsContainer);
