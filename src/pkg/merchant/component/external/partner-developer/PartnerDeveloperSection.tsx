import React, { ReactNode, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@toolkit/styling";

type PartnerDeveloperSectionProps = BaseProps & {
  readonly childWrapperStyle?: any;
  readonly children: ReactNode;
};

const PartnerDeveloperSection = ({
  childWrapperStyle,
  children,
  className,
  style,
}: PartnerDeveloperSectionProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.child, childWrapperStyle)}>{children}</div>
    </div>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          alignItems: "center",
        },
        child: {
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          margin: "40px 20px",
        },
      }),
    []
  );

export default PartnerDeveloperSection;
