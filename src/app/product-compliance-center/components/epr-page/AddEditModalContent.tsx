import React from "react";
import { observer } from "mobx-react";
import { Text } from "@ContextLogic/atlas-ui";
import { TextInput } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import Checkbox from "@mui/material/Checkbox";

export type Props = {
  readonly categoryName: string;
  readonly epr: string | undefined;
  readonly setEpr: (arg0: string) => unknown;
  readonly pro: string | undefined;
  readonly setPro: (arg0: string) => unknown;
  readonly confirmationChecked: boolean;
  readonly setConfirmationChecked: (arg0: boolean) => unknown;
};

const AddEditModalContent: React.FC<Props> = ({
  categoryName,
  epr,
  setEpr,
  pro,
  setPro,
  confirmationChecked,
  setConfirmationChecked,
}) => {
  const { textDark } = useTheme();

  return (
    <>
      <style jsx>{`
        .root {
          padding: 20px 25px;
        }
        .checkbox-row {
          margin-top: 15px;
          margin-bottom: -9px; // account for effect border on Checkbox
          display: flex;
          align-items: center;
        }
      `}</style>
      <div className="root">
        <Text variant="bodyMStrong" component="div">
          Category:
        </Text>
        <Text variant="bodyMStrong" component="div" sx={{ marginTop: "8px" }}>
          {categoryName}
        </Text>
        <Text
          variant="bodyMStrong"
          color={textDark}
          component="div"
          sx={{ marginTop: "24px" }}
        >
          EPR Registration Number
        </Text>
        <TextInput
          style={{ marginTop: "8px" }}
          value={epr}
          onChange={({ text }) => {
            setEpr(text);
          }}
        />
        <Text
          variant="bodyMStrong"
          color={textDark}
          component="div"
          sx={{ marginTop: "24px" }}
        >
          Producer Responsibility Organizations (PRO)
        </Text>
        <TextInput
          style={{ marginTop: "8px" }}
          value={pro}
          onChange={({ text }) => {
            setPro(text);
          }}
        />
        <div className="checkbox-row">
          <Checkbox
            sx={{ marginLeft: " -9px" }} // account for effect border on Checkbox
            checked={confirmationChecked}
            onChange={(event) => {
              setConfirmationChecked(event.target.checked);
            }}
            data-cy="product-incorrectly-taken-down-check"
          />
          <Text>I confirm that all details I provided are correct</Text>
        </div>
      </div>
    </>
  );
};

export default observer(AddEditModalContent);
