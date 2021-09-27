/*
 * CodeInput.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/29/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useEffect, useRef } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import CodeInputElement from "./CodeInputElement";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly numCharacters: number;
  readonly value: string | null | undefined;
  readonly onChange: (newCode: string) => unknown;
  readonly elementClassName?: string | undefined;
};

const CodeInput: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    numCharacters,
    value: valueProp,
    onChange: onChangeProp,
    elementClassName,
  } = props;
  const value = valueProp || "";
  const styles = useStylesheet();
  const curIndex = Math.min(value.length, numCharacters - 1);

  const refs = useRef<Array<HTMLInputElement>>([
    ...Array(numCharacters).fill(React.createRef<HTMLInputElement>()),
  ]);

  const valueArray = [
    ...Array.from(value),
    ...Array(numCharacters - value.length).fill(""),
  ];

  // if you find this please fix the any types (legacy)
  const focus = (index: any) => {
    if (refs.current[index]) {
      refs.current[index].focus();
    }
  };

  useEffect(() => {
    focus(curIndex);
  }, [curIndex]);

  // if you find this please fix the any types (legacy)
  const onChange = (text: any, index: any) => {
    const newValueArray = [...valueArray];
    newValueArray[index] = text;
    const newValue = newValueArray.join("");
    onChangeProp(newValue);
  };

  const onBackspace = () => {
    onChangeProp(value.substr(0, value.length - 1));
  };

  return (
    <div className={css(styles.root, className, style)}>
      {valueArray.map((value, index) => (
        <CodeInputElement
          className={elementClassName}
          value={value}
          index={index}
          onChange={onChange}
          onFocus={() => focus(curIndex)}
          ref={(ref: HTMLInputElement) => (refs.current[index] = ref)}
          onBackspace={onBackspace}
        />
      ))}
    </div>
  );
};

export default observer(CodeInput);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }),
    [],
  );
};
