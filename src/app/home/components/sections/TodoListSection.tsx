import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, H5Markdown } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import TodoListItem from "@home/todo/TodoListItem";
import { useMutation, useRequest } from "@core/toolkit/restApi";
import {
  BasicTodoLayoutType,
  CompleteTodoItemRequest,
  CompleteTodoItemResponse,
  GET_TODOS_ENDPOINT,
  GetTodoItemsResponse,
  MARK_TODO_COMPLETE_ENDPOINT,
  SNOOZE_TODO_ENDPOINT,
  SnoozeTodoItemRequest,
  SnoozeTodoItemResponse,
  TodoItem,
} from "@home/toolkit/todos";
import LoadingIndicatorCard from "../cards/LoadingIndicatorCard";
import sortBy from "lodash/sortBy";
import { useToastStore } from "@core/stores/ToastStore";

export type TodoListSectionProps = BaseProps;

const TodoListSection: React.FC<TodoListSectionProps> = ({
  className,
  style,
}) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const {
    data: todoItemsData,
    isLoading,
    isValidating,
    mutate: refetchTodos,
  } = useRequest<GetTodoItemsResponse>({
    url: GET_TODOS_ENDPOINT,
  });

  const { trigger: dismissTodo } = useMutation<
    CompleteTodoItemResponse,
    CompleteTodoItemRequest
  >({ url: MARK_TODO_COMPLETE_ENDPOINT });

  const { trigger: snoozeTodo } = useMutation<
    SnoozeTodoItemResponse,
    SnoozeTodoItemRequest
  >({ url: SNOOZE_TODO_ENDPOINT });

  const onDismissTodo = async (data: CompleteTodoItemRequest) => {
    await dismissTodo(data);
    await refetchTodos();
  };

  const onSnoozeTodo = async (data: SnoozeTodoItemRequest) => {
    await snoozeTodo(data);
    toastStore.info(i`Okay, we will remind you later`);
    await refetchTodos();
  };

  const todoItems: ReadonlyArray<TodoItem<BasicTodoLayoutType>> =
    useMemo(() => {
      const todoItemsResults = todoItemsData?.results ?? [];

      if (todoItemsResults.length == 0) {
        return [];
      }

      const priority = {
        NEGATIVE: 1,
        WARNING: 2,
        INFO: 3,
        POSITIVE: 4,
      };

      const bySentiment = (item: TodoItem<BasicTodoLayoutType>) => {
        if (item.sentiment in priority) {
          return priority[item.sentiment];
        }
        return Object.keys(priority).length + 1;
      };
      const byPinned = (item: TodoItem<BasicTodoLayoutType>) => {
        if (item.pinned) return 0;
        return 1;
      };

      const sortedItems = sortBy(todoItemsResults, [bySentiment, byPinned]);
      return sortedItems.slice(0, 5);
    }, [todoItemsData]);

  if (isLoading || isValidating) {
    return <LoadingIndicatorCard style={[className, style]} minHeight={240} />;
  }

  if (todoItems.length == 0) {
    return null;
  }

  return (
    <Layout.FlexColumn style={[className, style]} alignItems="stretch">
      <H5Markdown style={styles.headingV2} text={`**${i`Things to do`}**`} />
      {todoItems.map((item) => {
        return (
          <TodoListItem
            item={item}
            key={item.id}
            style={styles.item}
            onDismissTodo={(args) => onDismissTodo({ id: item.id, ...args })}
            onSnoozeTodo={(args) => onSnoozeTodo({ id: item.id, ...args })}
            onRefetchTodos={() => refetchTodos()}
          />
        );
      })}
    </Layout.FlexColumn>
  );
};

export default observer(TodoListSection);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        heading: {
          color: textBlack,
          fontSize: 24,
          lineHeight: "32px",
          marginBottom: 16,
        },
        headingV2: {
          margin: "5px 0px",
        },
        item: {
          boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
          marginBottom: 8,
        },
        loading: {
          marginLeft: 25,
          marginBottom: 25,
          maxWidth: 200,
        },
      }),
    [textBlack],
  );
};
