import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Dialog, DialogProps } from "@mui/material";
import { observer } from "mobx-react";
import { css } from "../toolkit/styling";

export type ModalProps = Pick<BaseProps, "className" | "style"> &
  Omit<DialogProps, "className" | "style">;

const Modal: React.FC<ModalProps> = ({ className, style, ...props }) => {
  return <Dialog className={css(className, style)} {...props} />;
};

export default observer(Modal);
