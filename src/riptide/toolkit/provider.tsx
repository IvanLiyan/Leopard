import React from "react";
import { ThemeProvider } from "@riptide/toolkit/theme";

export const RiptideProvider: React.FC = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
