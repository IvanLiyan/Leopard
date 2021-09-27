import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SideMenu } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ErpSignupSections } from "@merchant/model/external/erp-signup/ErpSignupState";

export type ErpSignupSideMenuProps = BaseProps & {
  readonly titles: ErpSignupSections;
};

const ErpSignupSideMenu = (props: ErpSignupSideMenuProps) => {
  const { className, titles } = props;

  return (
    <SideMenu className={css(className)} hideOnSmallScreen={false}>
      {titles.map(({ id, title }) => (
        <SideMenu.Item key={id} title={title} href={`#${id}`} />
      ))}
    </SideMenu>
  );
};
export default observer(ErpSignupSideMenu);
