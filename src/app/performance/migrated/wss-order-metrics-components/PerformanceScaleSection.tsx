import { Accordion } from "@ContextLogic/lego";
import { ci18n } from "@core/toolkit/i18n";
import { useTheme } from "@core/stores/ThemeStore";
import { observer } from "mobx-react";
import React, { useState } from "react";

const PerformanceScaleSection: React.FC = ({ children }) => {
  const [open, setOpen] = useState(true);
  const { surfaceLightest } = useTheme();
  return (
    <Accordion
      chevronLocation="left"
      chevronSize={10}
      isOpen={open}
      hideLines
      backgroundColor={surfaceLightest}
      onOpenToggled={(isOpen) => {
        setOpen(isOpen);
      }}
      header={ci18n(
        "A diagram showing where merchant's current metric stands on the WSS scale from Bronze to Platinum",
        "Performance scale",
      )}
    >
      {children}
    </Accordion>
  );
};

export default observer(PerformanceScaleSection);
