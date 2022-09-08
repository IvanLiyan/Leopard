import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Card,
  Layout,
  H5,
  Table,
  CellInfo,
  ThemedLabel,
  PrimaryButton,
  IconButton,
  EditButton,
  Text,
} from "@ContextLogic/lego";

import Icon from "@merchant/component/core/Icon";
import UinDeleteModal from "@merchant/component/products/compliance/widgets/UinDeleteModal";
import UinUpdateModal from "@merchant/component/products/compliance/widgets/UinUpdateModal";
import FranceEprAgreementModalContent from "@merchant/component/products/compliance/widgets/FranceEprAgreementModal";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Model */
import {
  CategoryStatusLabel,
  CategoryStatusThemeColor,
  PickedFranceUinSchema,
  useUinDataByCategory,
  ORDERED_CATEGORIES,
  ProductCategoryLabel,
  FranceEprContainerInitialData,
} from "@toolkit/products/france-epr";
import FranceEprState from "@merchant/model/products/FranceEprState";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly uinData: ReadonlyArray<PickedFranceUinSchema>;
  readonly initialData: FranceEprContainerInitialData;
};

const ManageCategoryEprSection = (props: Props) => {
  const { className, style, uinData, initialData } = props;
  const styles = useStylesheet();
  const { negative, negativeDarker } = useTheme();

  const uinDataByCategory = useUinDataByCategory(uinData);

  const noDataMessage = "-";

  const needsToAcceptTerms =
    !initialData.currentMerchant.merchantTermsAgreed?.agreedToFrComplianceTos;

  const tableData = uinDataByCategory
    ? ORDERED_CATEGORIES.map((category) => ({
        id: uinDataByCategory[category]?.id,
        category,
        uniqueIdentificationNumber:
          uinDataByCategory[category]?.uniqueIdentificationNumber,
        status: uinDataByCategory[category]?.status,
        productResponsibilityOrganization:
          uinDataByCategory[category]?.productResponsibilityOrganization,
      }))
    : [];

  const onDelete = (row: PickedFranceUinSchema) => {
    const state = new FranceEprState(row);
    new UinDeleteModal({ state }).render();
  };

  const onEdit = (row: PickedFranceUinSchema) => {
    const state = new FranceEprState(row);
    new UinUpdateModal({ isEdit: true, state }).render();
  };

  const onAdd = (row: PickedFranceUinSchema) => {
    const state = new FranceEprState(row);
    if (needsToAcceptTerms) {
      new FranceEprAgreementModalContent({
        state,
      }).render();
    } else {
      new UinUpdateModal({ isEdit: false, state }).render();
    }
  };

  const renderActions = ({ row }: CellInfo<string, PickedFranceUinSchema>) => {
    if (row.uniqueIdentificationNumber == null) {
      return <PrimaryButton onClick={() => onAdd(row)}>Add</PrimaryButton>;
    }
    return (
      <Layout.FlexRow>
        <EditButton onClick={() => onEdit(row)} style={styles.rowButton} />
        <IconButton
          icon="trash"
          iconColor={negative}
          onClick={() => onDelete(row)}
          style={styles.rowButton}
          popoverContent={i`Delete`}
        />
      </Layout.FlexRow>
    );
  };

  return (
    <Layout.FlexColumn style={[className, style]}>
      <H5>EPR Registration Numbers</H5>
      <Card style={styles.card}>
        <Text style={styles.body}>
          Add an EPR registration number and PRO for each of the categories
          below. Wish will validate your EPR registration number after you
          submit.
        </Text>
        <Table data={tableData}>
          <Table.Column
            _key={undefined}
            columnKey="category"
            title={i`Category`}
          >
            {({ row }: CellInfo<string, PickedFranceUinSchema>) =>
              row.category && ProductCategoryLabel[row.category]
            }
          </Table.Column>
          <Table.Column
            _key={undefined}
            columnKey="uniqueIdentificationNumber"
            title={i`EPR Registration Number`}
            noDataMessage={noDataMessage}
          />
          <Table.Column
            _key={undefined}
            columnKey="productResponsibilityOrganization"
            title={i`Producer Responsibility Organizations (PRO)`}
            noDataMessage={noDataMessage}
          />
          <Table.Column
            _key={undefined}
            columnKey="status"
            title={i`Status`}
            width={100}
            align="center"
            noDataMessage={noDataMessage}
          >
            {({ row }: CellInfo<string, PickedFranceUinSchema>) => (
              <>
                {row.status != null && (
                  <ThemedLabel theme={CategoryStatusThemeColor[row.status]}>
                    <Layout.FlexRow>
                      {CategoryStatusLabel[row.status]}
                      {/* TBD */}
                      {false && row.status === "REJECTED" && (
                        <Icon
                          name="info"
                          size={14}
                          color={negativeDarker}
                          style={styles.icon}
                        />
                      )}
                    </Layout.FlexRow>
                  </ThemedLabel>
                )}
              </>
            )}
          </Table.Column>
          <Table.Column
            _key={undefined}
            columnKey="category"
            title={i`Actions`}
            align="center"
          >
            {renderActions}
          </Table.Column>
        </Table>
      </Card>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        rowButton: {
          ":not(:last-child)": {
            marginRight: 12,
          },
        },
        body: {
          padding: "16px 24px",
        },
        card: {
          marginTop: 16,
        },
        icon: {
          marginLeft: 4,
        },
      }),
    []
  );
};

export default observer(ManageCategoryEprSection);
