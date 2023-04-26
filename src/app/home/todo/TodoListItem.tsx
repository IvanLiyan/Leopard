import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import {
  MultiSecondaryButton,
  Tip,
  Text,
  Layout,
  SecondaryButtonProps,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import {
  BasicTodoLayoutType,
  CompleteTodoItemRequest,
  SnoozeTodoItemRequest,
  TodoItem,
  TodoLayoutType,
} from "@home/toolkit/todos";
import WishExpressReApplyModal from "./WishExpressReApplyModal";
import { css } from "@core/toolkit/styling";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { useLogger } from "@core/toolkit/logger";
import ConfirmationModal from "@core/components/ConfirmationModal";
import { useUserStore } from "@core/stores/UserStore";
import SpvStatusLabel from "./SpvStatusLabel";
import { merchFeURL } from "@core/toolkit/router";

// This is a deprecated way of doing actions, do not repeat this in the future
const SpecialActionRoutes = [
  "WISH_EXPRESS_REAPPLICATION",
  "CONFIRM_TAX_DECLINE",
] as const;
type SpecialActionRoute = typeof SpecialActionRoutes[number];
const SpecialActionRouteNames: { readonly [T in SpecialActionRoute]: string } =
  {
    WISH_EXPRESS_REAPPLICATION:
      "merchant://wish-express/show-reapplication-modal",
    CONFIRM_TAX_DECLINE: "merchant://tax/confirm-decline",
  };

export type TodoListItemProps = BaseProps & {
  readonly item: TodoItem<BasicTodoLayoutType>;
  readonly onRefetchTodos: () => Promise<unknown>;
  readonly onDismissTodo: (
    args: Omit<CompleteTodoItemRequest, "id">,
  ) => Promise<unknown>;
  readonly onSnoozeTodo: (
    args: Omit<SnoozeTodoItemRequest, "id">,
  ) => Promise<unknown>;
};

const TodoListItem: React.FC<TodoListItemProps> = ({
  className,
  style,
  item,
  onRefetchTodos,
  onDismissTodo,
  onSnoozeTodo,
}) => {
  const styles = useStylesheet();
  const {
    layout: { title, description },
    sentiment,
  } = item;
  const { positiveLight, negativeLight, warningLight, wishBlue } = useTheme();
  const [wishExpressReApplyModalOpen, setWishExpressReApplyModalOpen] =
    useState(false);
  const [declineTaxSettingsModalOpen, setDeclineTaxSettingsModalOpen] =
    useState(false);

  const { merchantId } = useUserStore();

  const merchantTodoLogger = useLogger("MERCHANT_TODO_ITEMS");
  const declineTaxLogger = useLogger("TAX_DECLINE_ENROLLMENT");

  const navigationStore = useNavigationStore();

  const SpecialActionRouteActions: {
    readonly [T in SpecialActionRoute]: () => unknown;
  } = useMemo(
    () => ({
      WISH_EXPRESS_REAPPLICATION: () => {
        setWishExpressReApplyModalOpen(true);
      },
      CONFIRM_TAX_DECLINE: () => {
        setDeclineTaxSettingsModalOpen(true);
      },
    }),
    [],
  );

  const themeColor: string = useMemo(() => {
    const todoThemeColor: {
      readonly [T in TodoItem<TodoLayoutType>["sentiment"]]: string;
    } = {
      POSITIVE: positiveLight,
      WARNING: warningLight,
      NEGATIVE: negativeLight,
      INFO: wishBlue,
    };
    return todoThemeColor[sentiment] ?? wishBlue;
  }, [sentiment, positiveLight, negativeLight, warningLight, wishBlue]);

  const actionProps: ReadonlyArray<SecondaryButtonProps> = useMemo(() => {
    let actions = item.layout.actions.map((action) => ({
      text: action.text,
      onClick: async () => {
        if (action.type === "DECLINE") {
          await onDismissTodo({
            declined: true,
          });
          return;
        }

        const specialActionRoute = Object.entries(SpecialActionRouteNames).find(
          ([, route]) => action.url.includes(route),
        )?.[0] as SpecialActionRoute | undefined;
        if (specialActionRoute !== undefined) {
          SpecialActionRouteActions[specialActionRoute]();
        } else {
          await navigationStore.navigate(merchFeURL(action.url));
        }

        if (action.complete_on_click) {
          await onDismissTodo({ declined: false });
        }

        merchantTodoLogger.info({
          log_action: "clicked",
          _id: item.id,
          user_id: item.user_id,
          merchant_id: item.merchant_id,
          type: item.todo_type,
          completed: item.completed,
          can_snooze: item.can_snooze,
          snooze_count: item.snooze_count,
          snooze_hours: item.snooze_hours,
        });
      },
    }));

    if (item.can_snooze) {
      const snoozeText = item.snooze_text;
      if (snoozeText != null) {
        actions = [
          ...actions,
          {
            text: snoozeText,
            onClick: async () => {
              await onSnoozeTodo({});
            },
          },
        ];
      }
    }

    return actions;
  }, [
    item,
    SpecialActionRouteActions,
    navigationStore,
    merchantTodoLogger,
    onSnoozeTodo,
    onDismissTodo,
  ]);

  if (!title || !description) {
    return null;
  }

  return (
    <Tip className={css(className, style)} color={themeColor}>
      <WishExpressReApplyModal
        open={wishExpressReApplyModalOpen}
        onRefetchTodos={onRefetchTodos}
        onClose={() => setWishExpressReApplyModalOpen(false)}
      />
      <ConfirmationModal
        open={declineTaxSettingsModalOpen}
        onClose={() => setDeclineTaxSettingsModalOpen(false)}
        illustration="todoDeclineTaxSettings"
        title={i`Decline configuring Tax Settings`}
        text={
          i`By declining to configure Tax Settings, you indicate that you do ` +
          i`not elect to provide any tax information to Wish for your store. ` +
          i`Merchants are still ultimately responsible and liable for the ` +
          i`accuracy and remittance of applicable VAT/GST and Sales Taxes due.`
        }
        action={{
          onClick: async () => {
            await onDismissTodo({ declined: false });
            declineTaxLogger.info({
              merchant_id: merchantId,
            });
            setDeclineTaxSettingsModalOpen(false);
          },
          text: i`Confirm`,
          "data-cy": "button-confirm",
        }}
      />
      <div className={css(styles.root)}>
        <div className={css(styles.textContainer)}>
          <Layout.FlexRow>
            <Text weight="bold" className={css(styles.titleText)}>
              {title}
            </Text>
            {item.todo_type == "REAUTHENTICATION_SELLER_PROFILE" && (
              <SpvStatusLabel style={{ marginLeft: 4 }} />
            )}
          </Layout.FlexRow>
          <Text weight="medium" className={css(styles.descriptionText)}>
            {description}
          </Text>
        </div>
        <MultiSecondaryButton
          actions={actionProps}
          padding="7px 25px"
          dropDownContentWidth={155}
          className={css(styles.buttonStyle)}
        />
      </div>
    </Tip>
  );
};

export default observer(TodoListItem);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          alignItems: "center",
          display: "flex",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        },
        textContainer: {
          alignItems: "flex-start",
          color: textBlack,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "68%",
        },
        descriptionText: {
          color: textBlack,
          fontSize: 14,
          lineHeight: "20px",
          marginTop: "4px",
        },
        titleText: {
          fontSize: 20,
          lineHeight: "28px",
        },
        buttonStyle: {
          display: "flex",
          marginLeft: 100,
        },
      }),
    [textBlack],
  );
};
