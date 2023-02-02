import React from "react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Dialog, DialogProps, Fade } from "@mui/material";
import { observer } from "mobx-react";
import { css } from "../../toolkit/styling";
import Toast from "../Toast";
import { TransitionProps } from "@mui/material/transitions";

export type ModalProps = Pick<BaseProps, "className" | "style"> &
  Omit<DialogProps, "className" | "style">;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<
      unknown,
      string | React.JSXElementConstructor<unknown>
    >;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade ref={ref} {...props} />;
});

const Modal: React.FC<ModalProps> = ({
  className,
  style,
  children,
  ...props
}) => {
  return (
    <Dialog
      className={css(className, style)}
      TransitionComponent={Transition}
      {...props}
    >
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
