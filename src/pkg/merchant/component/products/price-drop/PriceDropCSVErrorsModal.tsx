import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import numeral from "numeral";

import { H7, H4, Table } from "@ContextLogic/lego";

import Modal from "@merchant/component/core/modal/Modal";
import { useTheme } from "@merchant/stores/ThemeStore";
import { ci18n } from "@legacy/core/i18n";
import { UploadPriceDropCampaignCsvResponse } from "@merchant/api/price-drop";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

export type PriceDropCSVErrorsModalProps = {
  readonly response: UploadPriceDropCampaignCsvResponse;
};

const PriceDropCSVErrorsModalContent: React.FC<PriceDropCSVErrorsModalProps> = (
  props: PriceDropCSVErrorsModalProps
) => {
  const {
    response: { errors, created_count: createdCount },
  } = props;
  const styles = useStylesheet();

  const data: ReadonlyArray<CSVError> = useMemo(() => {
    return errors.map((errorStr) => {
      const [sku, , time, errorMessage] = errorStr.split(",");
      return { sku, time, errorMessage };
    });
  }, [errors]);

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.overviewContainer)}>
        <div className={css(styles.overview)}>
          <H7 className={css(styles.overviewTitle)}>
            {ci18n(
              "label for the number rows that have been succesfully processed",
              "Rows Successfully Processed"
            )}
          </H7>
          <H4>{numeral(createdCount).format("0,0").toString()}</H4>
        </div>

        <div className={css(styles.overview)}>
          <H7 className={css(styles.overviewTitle)}>
            {ci18n(
              "label for the number rows that have failed processing",
              "Rows Failed"
            )}
          </H7>
          <H4>
            <span className={css(styles.errorText)}>
              {numeral(errors.length).format("0,0").toString()}
            </span>
          </H4>
        </div>
      </div>
      <Table data={data}>
        <Table.Column columnKey="time" title={i`Date`} />
        <Table.Column columnKey="sku" title={i`SKU`} />
        <Table.Column columnKey="errorMessage" title={i`Error`} />
      </Table>
    </div>
  );
};

type CSVError = {
  readonly sku: string;
  readonly time: string;
  readonly errorMessage: string;
};

const useStylesheet = () => {
  const { negative, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 24,
        },
        overviewContainer: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: 5,
          marginBottom: 24,
        },
        overview: {
          display: "flex",
          flexDirection: "column",
          ":not(:last-child)": {
            borderRight: `1px dashed ${borderPrimary}`,
            marginRight: 15,
          },
        },
        overviewTitle: {
          marginBottom: 10,
        },
        errorText: {
          color: negative,
        },
      }),
    [borderPrimary, negative]
  );
};

export default class PriceDropCSVErrorsModal extends Modal {
  constructor(props: PriceDropCSVErrorsModalProps) {
    super((onClose) => <PriceDropCSVErrorsModalContent {...props} />);

    this.setHeader({
      title: i`Upload Errors`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.5);
  }
}
