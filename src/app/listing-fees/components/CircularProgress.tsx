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
  size: number;
}> = (props) => {
  const { currentCount, freeCount, size } = props;

  const process = useMemo(() => {
    const value = freeCount - currentCount;
    if (value <= 0) {
      return "over";
    } else {
      return "less";
    }
  }, [currentCount, freeCount]);

  const processType = {
    less: { value: (currentCount / freeCount) * 100, color: "#16A44C" },
    over: {
      value: 100,
      color: "#C8402A",
    },
  };

  const boxSize = size + 20;
  const color = processType[process].color;
  const value = processType[process].value;
  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          width: boxSize,
          height: boxSize,
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
            width: size,
            height: size,
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress
            variant="determinate"
            sx={{
              color: "#eee",
            }}
            size={size}
            thickness={8}
            value={100}
          />

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
            size={size}
            thickness={8}
            value={value}
          />
        </Box>
      </Box>
      <Text
        style={{
          fontSize: 14,
          fontWeight: 700,
          with: boxSize,
          textAlign: "center",
          marginTop: 10,
        }}
        weight="bold"
      >
        {currentCount} / {freeCount}
      </Text>
    </div>
  );
};

export default observer(CircularProgressSection);
