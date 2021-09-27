import React from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import BasicTodoLayout from "./BasicTodoLayout";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { TodoItem, BasicTodoLayoutType } from "@merchant/api/todo";

export type TodoListItemProps = BaseProps & {
  readonly item: TodoItem<unknown>;
};

const TodoListItem = (props: TodoListItemProps) => {
  const { item, className } = props;
  if (
    typeof item == "object" &&
    (item as TodoItem<BasicTodoLayoutType>).layout?.layout_type ===
      "BasicTodoLayout"
  ) {
    return (
      <BasicTodoLayout
        className={css(className)}
        item={item as TodoItem<BasicTodoLayoutType>}
      />
    );
  }

  return null;
};

export default observer(TodoListItem);
