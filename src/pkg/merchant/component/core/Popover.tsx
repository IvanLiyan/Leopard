import React from "react";

import {
  Popover as LegoPopover,
  PopoverProps as LegoPopoverProps,
} from "@ContextLogic/lego";
import { ApolloProvider } from "@apollo/react-hooks";
import { useApolloStore } from "@merchant/stores/ApolloStore";
import { ThemeWrapper as MerchantThemeWrapper } from "@merchant/stores/ThemeStore";

export type PopoverProps = Omit<LegoPopoverProps, "themeWrapper">;

const Popover: React.FC<PopoverProps> = (props: PopoverProps) => {
  const { client } = useApolloStore();
  const ThemeWrapper: React.FC = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => {
    return (
      <ApolloProvider client={client}>
        <MerchantThemeWrapper>{children}</MerchantThemeWrapper>
      </ApolloProvider>
    );
  };
  return <LegoPopover {...props} themeWrapper={ThemeWrapper} />;
};

export default Popover;
