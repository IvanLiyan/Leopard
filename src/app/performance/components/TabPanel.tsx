import { NextPage } from "next";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import Box from "@mui/material/Box";

interface Props {
  readonly children?: ReactNode;
  readonly index?: number;
  readonly value?: number;
  readonly style?: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >["style"];
}

const TabPanel: NextPage<Props> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};
export default TabPanel;
