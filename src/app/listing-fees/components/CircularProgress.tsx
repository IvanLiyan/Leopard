import React, { useMemo } from "react";
import { Text } from "@ContextLogic/lego";
import { observer } from "mobx-react";
import Box from "@mui/material/Box";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";

const CircularProgressSection: React.FC<{
  currentCount: number;
  freeCount: number;
}> = (props) => {
  const { currentCount, freeCount } = props;

  const process = useMemo(() => {
    const value = freeCount - currentCount;
    if (value <= 0) {
      return "over";
    } else if (value < freeCount / 4) {
      return "more";
    } else {
      return "less";
    }
  }, [currentCount, freeCount]);

  const processType = {
    less: { value: 25, color: "#16A44C" },
    more: {
      value: 75,
      color: "#FF9900",
    },
    over: {
      value: 100,
      color: "#FF0100",
    },
  };

  const color = processType[process].color;
  const value = processType[process].value;
  const number = freeCount - currentCount;
  const numberText = number > 0 ? `+${number}` : number;
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: 120,
        height: 120,
        background: "#fafafa",
        borderRadius: "50%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 100,
          height: 100,
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircularProgress
          variant="determinate"
          sx={{
            color: "#eee",
          }}
          size={100}
          thickness={8}
          value={100}
        />
        <Text
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            fontSize: 14,
            transform: "translate(-50%, -50%)",
          }}
          weight="bold"
        >
          {numberText}
        </Text>
        <CircularProgress
          variant="determinate"
          sx={{
            color: color,
            position: "absolute",
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
          }}
          size={100}
          thickness={8}
          value={value}
        />
      </Box>
    </Box>
  );
};

export default observer(CircularProgressSection);
