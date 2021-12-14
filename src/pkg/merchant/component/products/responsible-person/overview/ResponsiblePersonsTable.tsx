import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

/* Lego Components */
import {
  FormSelect,
  Table,
  Layout,
  PageIndicator,
  CellInfo,
  EditButton,
  IconButton,
  ThemedLabel,
  LoadingIndicator,
  Popover,
  Text,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import ResponsiblePersonFilter from "@merchant/component/products/responsible-person/widgets/ResponsiblePersonFilter";
import ResponsiblePersonModal from "@merchant/component/products/responsible-person/widgets/ResponsiblePersonModal";

/* Model */
import {
  ResponsiblePersonInitialData,
  PickedResponsiblePerson,
  ReviewStatusLabel,
  ResponsiblePersonsRequestData,
  ResponsiblePersonsResponseData,
  ThemeColor,
} from "@toolkit/products/responsible-person";
import { ResponsiblePersonStatus } from "@schema/types";
import ResponsiblePersonState from "@merchant/model/products/ResponsiblePersonState";
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly initialData: ResponsiblePersonInitialData;
  readonly state: ResponsiblePersonState;
};

const RESPONSIBLE_PERSONS_QUERY = gql`
  query ResponsiblePersons_ResponsiblePersonsTable(
    $offset: Int!
    $limit: Int!
    $states: [ResponsiblePersonStatus!]
  ) {
    policy {
      productCompliance {
        responsiblePersons(
          offset: $offset
          limit: $limit
          states: $states
          complianceType: EU_REGULATION_20191020_MSR
        ) {
          id
          merchantId
          merchant {
            displayName
            countryOfDomicile {
              name
              code
            }
          }
          status
          email
          address {
            phoneNumber
            streetAddress1
            streetAddress2
            city
            state
            zipcode
            country {
              name
              code
            }
            name
          }
        }
        responsiblePersonCount(
          states: $states
          complianceType: EU_REGULATION_20191020_MSR
        )
      }
    }
  }
`;

const ResponsiblePersonsTable = (props: Props) => {
  const { className, style, state } = props;
  const styles = useStylesheet();
  const { primary, textBlack, negative } = useTheme();

  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [states, setStates] = useState<Set<ResponsiblePersonStatus>>(
    new Set([]),
  );
  const statesQueryInput = states.has("COMPLETE")
    ? [...Array.from(states), "ADMIN_APPROVED" as ResponsiblePersonStatus]
    : Array.from(states);

  const { data, loading, refetch } = useQuery<
    ResponsiblePersonsResponseData,
    ResponsiblePersonsRequestData
  >(RESPONSIBLE_PERSONS_QUERY, {
    variables: {
      offset,
      limit,
      states: statesQueryInput,
    },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (data?.policy?.productCompliance?.responsiblePersons == null) {
    return null;
  }

  const rpList = data.policy.productCompliance.responsiblePersons;
  const totalRps = data.policy.productCompliance.responsiblePersonCount;

  const onPageChange = async (currentPage: number) => {
    const nextPage = Math.max(0, currentPage);
    setOffset(nextPage * limit);
    await refetch();
  };

  const onEdit = (rp: PickedResponsiblePerson) => {
    const state = new ResponsiblePersonState(rp);
    new ResponsiblePersonModal({
      isNew: false,
      state,
    }).render();
  };

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <Layout.FlexColumn justifyContent="flex-start">
        <Layout.FlexRow
          justifyContent="space-between"
          className={css(styles.tableControls)}
        >
          <Popover
            position="top center"
            on="click"
            closeOnMouseLeave={false}
            popoverContent={() => (
              <ResponsiblePersonFilter
                states={states}
                style={{ minWidth: 375 }}
                onSetStates={setStates}
                onSubmit={refetch}
              />
            )}
          >
            <IconButton
              icon="filter"
              iconColor={Array.from(states).length > 0 ? primary : textBlack}
            >
              Filter
            </IconButton>
          </Popover>
          <Layout.FlexRow>
            <PageIndicator
              onPageChange={onPageChange}
              hasPrev={offset != 0}
              hasNext={totalRps ? offset + limit < totalRps : false}
              rangeStart={offset + 1}
              rangeEnd={totalRps ? Math.min(totalRps, offset + limit) : 0}
              totalItems={totalRps}
              currentPage={Math.ceil(offset / limit)}
              style={{ marginRight: 12 }}
            />
            <FormSelect
              options={[10, 50, 100].map((v) => ({
                value: v.toString(),
                text: v.toString(),
              }))}
              onSelected={(value: string) => setLimit(parseInt(value))}
              style={{ maxWidth: 50, maxHeight: 30 }}
              selectedValue={limit.toString()}
            />
          </Layout.FlexRow>
        </Layout.FlexRow>

        <Table data={rpList} noDataMessage={i`No Responsible Persons`}>
          <Table.Column columnKey="address.name" title={i`Name`} width={200} />
          <Table.Column columnKey="id" title={i`Address`}>
            {({ row }: CellInfo<string, PickedResponsiblePerson>) => (
              <Layout.FlexColumn>
                <Text>{row.address.streetAddress1}</Text>
                {row.address.streetAddress2 && (
                  <Text>{row.address.streetAddress2}</Text>
                )}
                <Text>{row.address.streetAddress2}</Text>
                <Text>
                  {row.address.city}
                  {row.address.state && `, ${row.address.state}`}
                  {row.address.zipcode && `, ${row.address.zipcode}`}
                </Text>
                {row.address.country && <Text>{row.address.country.name}</Text>}
              </Layout.FlexColumn>
            )}
          </Table.Column>
          <Table.Column columnKey="email" title={i`Email`} />
          <Table.Column columnKey="address.phoneNumber" title={i`Phone`} />
          <Table.Column columnKey="status" title={i`Status`} width={100}>
            {({ row }: CellInfo<string, PickedResponsiblePerson>) => (
              <>
                {row.status != null && (
                  <ThemedLabel theme={ThemeColor[row.status]}>
                    {ReviewStatusLabel[row.status]}
                  </ThemedLabel>
                )}
              </>
            )}
          </Table.Column>
          <Table.Column columnKey="id" title={i`Action`} width={100}>
            {({ row }: CellInfo<string, PickedResponsiblePerson>) => (
              <Layout.FlexRow>
                <EditButton
                  onClick={() => onEdit(row)}
                  className={css(styles.rowButton)}
                />
                <IconButton
                  icon="trash"
                  iconColor={negative}
                  onClick={async () => await state.delete(row.id)}
                  className={css(styles.rowButton)}
                  popoverContent={i`Delete`}
                />
              </Layout.FlexRow>
            )}
          </Table.Column>
        </Table>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        tableControls: {
          padding: 24,
        },
        rowButton: {
          ":not(:last-child)": {
            marginRight: 12,
          },
        },
      }),
    [],
  );
};

export default observer(ResponsiblePersonsTable);
