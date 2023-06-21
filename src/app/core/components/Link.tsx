import React from "react";
import { observer } from "mobx-react";

/* External Libraries */
import NextLink from "next/link";

import {
  Link as AtlasLink,
  LinkProps as AtlasLinkProps,
} from "@ContextLogic/atlas-ui";
import { isValidURL } from "@core/toolkit/router";

export type LinkProps = AtlasLinkProps;

const Link = ({ href, ...props }: LinkProps) => {
  // urls of the form `${window.location.origin}/slug` can be used to access
  // Merch-FE pages, while "/slug" can be used to access Leopard pages
  if (!href || (typeof href == "string" && isValidURL(href))) {
    return <AtlasLink href={href} {...props} />;
  }

  return (
    <NextLink href={href} passHref>
      <AtlasLink href={href?.toString()} {...props} />
    </NextLink>
  );
};

export default observer(Link);
