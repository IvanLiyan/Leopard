import React from "react";
import {
  TypeaheadInput as LegoTypeaheadInput,
  TypeaheadInputProps as LegoTypeaheadInputProps,
} from "@ContextLogic/lego";
import { ApolloProvider } from "@apollo/client";
import { useApolloStore } from "@stores/ApolloStore";
import { ThemeWrapper as MerchantThemeWrapper } from "@stores/ThemeStore";

type TypeaheadInputProps = Omit<LegoTypeaheadInputProps, "themeWrapper">;

const TypeaheadInput: React.FC<TypeaheadInputProps> = (
  props: TypeaheadInputProps
) => {
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
  return <LegoTypeaheadInput {...props} themeWrapper={ThemeWrapper} />;
};

export default TypeaheadInput;
