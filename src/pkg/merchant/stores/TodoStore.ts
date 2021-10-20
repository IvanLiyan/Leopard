//
//  stores/TodoStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 2/11/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import { computed } from "mobx";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Merchant API */
import * as todoApi from "@merchant/api/todo";
import * as wishpostApi from "@merchant/api/wishpost";
import { TodoItem, DeclineTodoAction } from "@merchant/api/todo";
import {
  GetBoundWishpostSettingsRequest,
  GetBoundWishpostSettingsResponse,
} from "@merchant/api/wishpost";

/* Toolkit */
import * as logger from "@toolkit/logger";
import { MerchantAPIRequest } from "@toolkit/api";

/* Relative Imports */
import UserStore from "../../stores/UserStore";
import ToastStore from "../../stores/ToastStore";
import EnvironmentStore from "../../stores/EnvironmentStore";

export default class TodoStore {
  @computed
  get todoRequest() {
    return todoApi.getTodoItems();
  }

  @computed
  get wishpostRequest(): MerchantAPIRequest<
    GetBoundWishpostSettingsRequest,
    GetBoundWishpostSettingsResponse
  > {
    return wishpostApi
      .getBoundWishpostSettings()
      .setOptions({ failSilently: true });
  }

  @computed
  get fetchingItems(): boolean {
    return this.todoRequest.isLoading;
  }

  @computed
  get fetchedItems(): boolean {
    return this.todoRequest.response != null;
  }

  @computed
  get baseItems(): ReadonlyArray<TodoItem<unknown>> {
    return this.todoRequest.response?.data?.results || [];
  }

  @computed
  get wishpostItem(): TodoItem<unknown> | null | undefined {
    const { wishpostRequest, canSeeWishpostTodo } = this;
    if (!canSeeWishpostTodo) {
      return null;
    }

    if (!wishpostRequest.isSuccessful) {
      return null;
    }

    const bindInfo = wishpostRequest.response?.data?.bind_info;
    if (bindInfo && bindInfo.length > 0) {
      return null;
    }

    const { loggedInMerchantUser } = UserStore.instance();

    return {
      id: new Date().getTime().toString(),
      layout: {
        title: "请绑定您的WishPost账号",
        actions: [
          {
            url: "https://www.wishpost.cn/login?next=%2Fbind-merchant-page",
            text: "绑定Wishpost",
            complete_on_click: false,
          },
        ],
        description:
          "WishPost是Wish唯一认可的从中国大陆配送Wish订单的" +
          "物流渠道。您可以拥有多个WishPost账号。",
        layout_type: "BasicTodoLayout",
      },
      user_id: loggedInMerchantUser.id,
      merchant_id: loggedInMerchantUser.merchant_id,
      todo_type: "BIND_WISHPOST",
      can_snooze: false,
      sentiment: "INFO",
    };
  }

  @computed
  get canSeeWishpostTodo(): boolean {
    const { loggedInMerchantUser } = UserStore.instance();
    const { isProd } = EnvironmentStore.instance();
    return isProd && loggedInMerchantUser.is_cn_merchant;
  }

  @computed
  get todoItems(): ReadonlyArray<TodoItem<unknown>> {
    const { baseItems, wishpostItem } = this;
    if (wishpostItem != null) {
      return [...baseItems, wishpostItem];
    }
    return baseItems;
  }

  refreshItems() {
    const { loggedInMerchantUser } = UserStore.instance();
    const { isProd } = EnvironmentStore.instance();
    this.todoRequest.refresh();

    if (isProd && loggedInMerchantUser.is_cn_merchant) {
      this.wishpostRequest.refresh();
    }
  }

  @computed
  get visibleTodoItems(): ReadonlyArray<TodoItem<unknown>> {
    const priority = {
      NEGATIVE: 1,
      WARNING: 2,
      INFO: 3,
      POSITIVE: 4,
    };

    const bySentiment = (item: TodoItem<unknown>) => {
      if (item.sentiment in priority) {
        return priority[item.sentiment];
      }
      return Object.keys(priority).length + 1;
    };
    const byPinned = (item: TodoItem<unknown>) => {
      if (item.pinned) return 0;
      return 1;
    };

    const sortedItems = _.sortBy(this.todoItems, [bySentiment, byPinned]);
    return sortedItems.slice(0, 5);
  }

  async markCompleted(args: { id: string; declined?: boolean }): Promise<void> {
    await todoApi
      .completeTodo({ id: args.id, declined: !!args.declined })
      .call();
    this.todoRequest.refresh();
  }

  async snooze(id: string): Promise<void> {
    await todoApi.snoozeTodo({ id }).call();
    this.todoRequest.refresh();
    const toastStore = ToastStore.instance();
    toastStore.info(i`Okay, we will remind you later`);
  }

  logItem(item: TodoItem<unknown>, action: string) {
    logger.log("MERCHANT_TODO_ITEMS", {
      log_action: action,
      _id: item.id,
      user_id: item.user_id,
      merchant_id: item.merchant_id,
      type: item.todo_type,
      completed: item.completed,
      can_snooze: item.can_snooze,
      snooze_count: item.snooze_count,
      snooze_hours: item.snooze_hours,
    });
  }

  async declineTodo(
    item: TodoItem<unknown>,
    action: DeclineTodoAction,
  ): Promise<void> {
    const decline = async () => {
      await this.markCompleted({ id: item.id, declined: true });
    };

    const { confirmation, illustration } = action;
    if (confirmation) {
      new ConfirmationModal(confirmation)
        .setHeader({
          title: i`Confirm`,
        })
        .setCancel(i`Cancel`)
        .setIllustration(illustration)
        .setAction(i`Yes`, async () => {
          await decline();
        })
        .render();
    } else {
      await decline();
    }
  }

  static instance(): TodoStore {
    let { todoStore } = window as any;
    if (todoStore == null) {
      todoStore = new TodoStore();
      (window as any).todoStore = todoStore;
    }
    return todoStore;
  }
}

export const useTodoStore = (): TodoStore => {
  return TodoStore.instance();
};
