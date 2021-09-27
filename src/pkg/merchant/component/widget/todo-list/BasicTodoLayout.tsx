import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { MultiSecondaryButton, Tip, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import NavigationStore from "@merchant/stores/NavigationStore";
import { TodoItem, BasicTodoLayoutType } from "@merchant/api/todo";
import TodoStore from "@merchant/stores/TodoStore";
import { SecondaryButtonProps } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type BasicTodoLayoutProps = BaseProps & {
  readonly item: TodoItem<BasicTodoLayoutType>;
};

@observer
export default class BasicTodoLayout extends Component<BasicTodoLayoutProps> {
  @computed
  get actionProps(): ReadonlyArray<SecondaryButtonProps> {
    const { item } = this.props;
    const todoStore: TodoStore = AppStore.instance().todoStore;

    let actions = item.layout.actions.map((action) => ({
      text: action.text,
      onClick: async () => {
        if (action.type === "DECLINE") {
          todoStore.declineTodo(item, action);
          return;
        }

        const navigationStore = NavigationStore.instance();
        await navigationStore.navigate(action.url);

        if (action.complete_on_click) {
          await todoStore.markCompleted({ id: item.id });
        }

        todoStore.logItem(item, "clicked");
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
              await todoStore.snooze(item.id);
            },
          },
        ];
      }
    }

    return actions;
  }

  @computed
  get themeColor(): string {
    const { item } = this.props;
    const { sentiment } = item;
    switch (sentiment) {
      case "POSITIVE":
        return palettes.cyans.LightCyan;
      case "WARNING":
        return palettes.yellows.Yellow;
      case "NEGATIVE":
        return palettes.reds.DarkRed;
      default:
        return palettes.coreColors.WishBlue;
    }
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        alignItems: "center",
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      },
      textContainer: {
        alignItems: "flex-start",
        color: palettes.textColors.Ink,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "68%",
      },
      descriptionText: {
        color: palettes.textColors.DarkInk,
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
    });
  }

  render() {
    const { className, item } = this.props;
    const {
      layout: { title, description },
    } = item;
    return (
      <Tip className={css(className)} color={this.themeColor}>
        <div className={css(this.styles.root)}>
          <div className={css(this.styles.textContainer)}>
            {title && (
              <Text weight="bold" className={css(this.styles.titleText)}>
                {title}
              </Text>
            )}
            <Text weight="medium" className={css(this.styles.descriptionText)}>
              {description}
            </Text>
          </div>
          <MultiSecondaryButton
            actions={this.actionProps}
            padding="7px 25px"
            dropDownContentWidth={155}
            className={css(this.styles.buttonStyle)}
          />
        </div>
      </Tip>
    );
  }
}
