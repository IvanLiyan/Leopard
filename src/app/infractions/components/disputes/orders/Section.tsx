import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, ChevronButton, H6 } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly title: string;
  readonly collapsible?: boolean;
  readonly isOpen?: boolean;
};

const Section = (props: Props) => {
  const {
    className,
    style,
    title,
    collapsible = false,
    isOpen = true,
    children,
  } = props;
  const [open, setOpen] = useState(isOpen);
  const styles = useStylesheet();

  return (
    <Card
      title={() => (
        <>
          {collapsible && (
            <ChevronButton
              direction={open ? "down" : "right"}
              size={14}
              onClick={() => setOpen(!open)}
              style={styles.chevron}
            />
          )}
          <H6 style={styles.title}>{title}</H6>
        </>
      )}
      style={[className, style]}
    >
      {open ? children : null}
    </Card>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          lineHeight: "20px",
          size: 14,
        },
        chevron: {
          marginRight: 8,
        },
      }),
    [],
  );
};

export default observer(Section);
