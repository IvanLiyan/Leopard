import { IllustrationName } from "@core/components/Illustration";

// ==============================================
// todos
// ==============================================

export const GET_TODOS_ENDPOINT = "/api/todos";

export type TodoActionType = "BASIC" | "DECLINE";

export type BasicTodoAction = {
  readonly url: string;
  readonly text: string;
  readonly complete_on_click?: boolean;
  readonly type: "BASIC";
};

export type DeclineTodoAction = {
  readonly text: string;
  readonly confirmation?: string | null | undefined;
  readonly type: "DECLINE";
  readonly illustration?: IllustrationName | null | undefined;
};

export type TodoAction = BasicTodoAction | DeclineTodoAction;

export type BasicTodoLayoutType = {
  readonly title: string;
  readonly actions: ReadonlyArray<TodoAction>;
  readonly sentiment: "positive" | "negative" | "warning" | "info";
  readonly todoItemId: string;
  readonly description: string;
  readonly layout_type: "BasicTodoLayout";
};

export type TodoLayoutType = BasicTodoLayoutType;

export type TodoItem<L extends TodoLayoutType> = {
  readonly id: string;
  readonly layout: L;
  readonly can_snooze?: boolean;
  readonly user_id?: string;
  readonly merchant_id?: string;
  readonly todo_type?: string;
  readonly completed?: boolean;
  readonly snooze_text?: string | null | undefined;
  readonly snooze_count?: number | null | undefined;
  readonly snooze_hours?: number | null | undefined;
  readonly sentiment: "POSITIVE" | "NEGATIVE" | "WARNING" | "INFO";
  readonly pinned?: boolean;
};

export type GetTodoItemsResponse = {
  readonly results: ReadonlyArray<TodoItem<TodoLayoutType>>;
};

// ==============================================
// todos/complete
// ==============================================

export const MARK_TODO_COMPLETE_ENDPOINT = "/api/todos/complete";

export type CompleteTodoItemRequest = {
  readonly id: string;
  readonly declined: boolean;
};

export type CompleteTodoItemResponse = {
  readonly success: boolean;
};

// ==============================================
// todos/snooze
// ==============================================

export const SNOOZE_TODO_ENDPOINT = "/api/todos/snooze";

export type SnoozeTodoItemRequest = {
  readonly id: string;
};

export type SnoozeTodoItemResponse = {
  readonly success: boolean;
};
