import { IconName } from "@ContextLogic/zeus";
import { useTheme } from "@core/stores/ThemeStore";

export const useTrendIcon = (): ((result: number) => {
  readonly color: string;
  readonly name: Extract<IconName, "arrowUp" | "arrowDown" | "minus">;
}) => {
  const { positiveDark, negative, hoverColor } = useTheme();

  return (result: number) => {
    if (result > 0) {
      return {
        color: positiveDark,
        name: "arrowUp",
      };
    }
    if (result < 0) {
      return { name: "arrowDown", color: negative };
    }
    return { name: "minus", color: hoverColor };
  };
};
