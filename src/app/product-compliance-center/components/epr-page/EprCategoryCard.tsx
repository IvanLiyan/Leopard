import React, { useState } from "react";
import { observer } from "mobx-react";
import ActionCard from "@core/components/ActionCard";
import { Button, Text } from "@ContextLogic/atlas-ui";
import { EprStatus } from "@schema";
import { Divider } from "@ContextLogic/lego";
import css from "styled-jsx/css";
import { useTheme } from "@core/stores/ThemeStore";
import { CountryCode } from "@schema";
import StatusTag from "./StatusTag";
import AddEprModal from "./AddEprModal";
import EditEprModal from "./EditEprModal";
import DeleteEprModal from "./DeleteEprModal";

const { className, styles } = css.resolve`
  div :global(.content) {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
`;

export type Props = {
  readonly id: Maybe<string>;
  readonly category: number;
  readonly categoryName: string;
  readonly uin: Maybe<string>;
  readonly responsibleEntityName: Maybe<string>;
  readonly status: Maybe<EprStatus>;
  readonly country: CountryCode;
};

const EprCategoryCard: React.FC<Props> = ({
  id,
  category,
  categoryName,
  uin,
  responsibleEntityName,
  status,
  country,
}) => {
  const { surfaceLighter } = useTheme();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      <AddEprModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
        }}
        category={category}
        categoryName={categoryName}
        country={country}
      />
      <EditEprModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
        }}
        categoryName={categoryName}
        epr={uin || ""} // invariant: modal will only be opened if UIN exists
        pro={responsibleEntityName || ""} // invariant: modal will only be opened if responsibleEntityName exists
        id={id || ""} // invariant: modal wil only be opened if id exists
      />
      <DeleteEprModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        id={id || ""} // invariant: modal will only be opened if ID exists
        categoryName={categoryName}
      />
      <ActionCard
        title={categoryName}
        className={className}
        ctaButtons={
          <>
            {id == null && (
              <Button
                secondary
                onClick={() => {
                  setAddModalOpen(true);
                }}
              >
                Add
              </Button>
            )}
            {id != null && (
              <>
                <Button
                  secondary
                  onClick={() => {
                    setEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  secondary
                  onClick={() => {
                    setDeleteModalOpen(true);
                  }}
                >
                  Remove
                </Button>
              </>
            )}
          </>
        }
        sx={{ backgroundColor: surfaceLighter }}
      >
        {styles}
        <Divider />
        <Text component="div" variant="bodyMStrong" sx={{ marginTop: "16px" }}>
          EPR Registration Number
        </Text>
        <Text component="div">{uin || "-"}</Text>
        <Text component="div" variant="bodyMStrong" sx={{ marginTop: "16px" }}>
          Producer Responsibility Organizations (PRO)
        </Text>
        <Text component="div">{responsibleEntityName || "-"}</Text>
        <Text component="div" variant="bodyMStrong" sx={{ marginTop: "16px" }}>
          Status
        </Text>
        <Text component="div" sx={{ marginTop: "8px", marginBottom: "16px" }}>
          <StatusTag status={status} />
        </Text>
        <Divider />
      </ActionCard>
    </>
  );
};

export default observer(EprCategoryCard);
