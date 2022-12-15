import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Dialog, DialogProps } from "@mui/material";
import { observer } from "mobx-react";
import { css } from "../toolkit/styling";
import Toast from "./Toast";

export type ModalProps = Pick<BaseProps, "className" | "style"> &
  Omit<DialogProps, "className" | "style">;

const Modal: React.FC<ModalProps> = ({
  className,
  style,
  children,
  ...props
}) => {
  return (
    <Dialog className={css(className, style)} {...props}>
      <>
        <Toast
          style={{
            position: "relative",
            alignSelf: "stretch",
          }}
        />
        {children}
      </>
    </Dialog>
  );
};

export default observer(Modal);
