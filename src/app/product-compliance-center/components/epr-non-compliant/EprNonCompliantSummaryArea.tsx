import React from "react";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { Table, CellInfo } from "@ContextLogic/lego";
import { Stack, Heading, Text } from "@ContextLogic/atlas-ui";
import Skeleton from "@core/components/Skeleton";
import {
  EPR_NON_COMPLIANT_SUMMARY_QUERY,
  EprNonCompliantSummaryQueryResponse,
} from "@product-compliance-center/api/eprNonCompliantQueries";
import { EprNonCompliantSummaryRecordSchema } from "@schema";
import { ci18n } from "@core/toolkit/i18n";

const EprNonCompliantSummaryArea: React.FC = () => {
  const { data, loading: isLoadingData } =
    useQuery<EprNonCompliantSummaryQueryResponse>(
      EPR_NON_COMPLIANT_SUMMARY_QUERY,
    );
  const summary =
    data?.policy?.productCompliance?.extendedProducerResponsibility
      .eprNonCompliantSummary;

  return (
    <Stack direction="column">
      <Heading variant="h3">Summary</Heading>
      {
        // Summary table
        isLoadingData ? (
          <Skeleton height={48} sx={{ margin: "24px 0px" }} />
        ) : (
          <Table
            style={{
              marginTop: "16px",
            }}
            data={summary?.summaryRecords}
          >
            <Table.Column
              title={ci18n("Column title for country", "Country")}
              _key="country"
              columnKey="country"
            >
              {({
                row,
              }: CellInfo<
                React.ReactNode,
                EprNonCompliantSummaryRecordSchema
              >) => <Text>{row.country.name}</Text>}
            </Table.Column>
            <Table.Column
              title={ci18n("Column title for EPR category", "EPR Category")}
              _key="eprCategoryName"
              columnKey="eprCategoryName"
            >
              {({
                row,
              }: CellInfo<
                React.ReactNode,
                EprNonCompliantSummaryRecordSchema
              >) => <Text>{row.eprCategoryName}</Text>}
            </Table.Column>
            <Table.Column
              title={ci18n(
                "Column title for non-compliant product count",
                "Non-compliant Product Count",
              )}
              _key="nonCompliantProductCount"
              columnKey="nonCompliantProductCount"
            >
              {({
                row,
              }: CellInfo<
                React.ReactNode,
                EprNonCompliantSummaryRecordSchema
              >) => <Text>{row.nonCompliantProductCount}</Text>}
            </Table.Column>
          </Table>
        )
      }
    </Stack>
  );
};

export default observer(EprNonCompliantSummaryArea);
