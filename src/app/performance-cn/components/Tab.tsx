import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiTabs from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";

const Tabs = styled(MuiTabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: "#305bef",
  },
});

const Tab = styled((props: StyledTabProps) => (
  <MuiTab disableRipple {...props} />
))(() => ({
  textTransform: "none",
  minWidth: 0,
  color: "#0000009D",
  fontSize: "16px",
  "&:hover": {
    color: "#305bef",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: "#305bef",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#305bef",
  },
}));

interface StyledTabProps {
  label: string;
}

export { Tabs, Tab };
