import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AddEditProductState, {
  Variation,
} from "@add-edit-product/AddEditProductState";
import { Layout, Text } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import CustomCustomsLogisticsModal from "./CustomCustomsLogisticsModal";
import Link from "@core/components/Link";
import Icon from "@core/components/Icon";

type Props = BaseProps & {
  readonly state: AddEditProductState;
  readonly variation: Variation;
};

const CustomsLogisticsCell: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, state, variation } = props;
  const { primary } = useTheme();
  const [isCustomsModalOpen, setIsCustomsModalOpen] = useState<boolean>(false);

  return (
    <>
      <CustomCustomsLogisticsModal
        open={isCustomsModalOpen}
        state={state}
        variation={variation}
        onClose={() => {
          setIsCustomsModalOpen(false);
        }}
      />
      <Link
        style={[style, className]}
        onClick={() => {
          setIsCustomsModalOpen(true);
        }}
      >
        <Layout.FlexRow alignItems="center" style={styles.customLogisticsLink}>
          <Icon
            size={14}
            name={variation.customCustomsLogistics == null ? "plus" : "edit"}
            color={primary}
          />
          <Text weight="semibold">
            {variation.customCustomsLogistics != null
              ? i`Edit info`
              : i`Add info`}
          </Text>
        </Layout.FlexRow>
      </Link>
    </>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        customLogisticsLink: {
          gap: 4,
        },
      }),
    [],
  );
};

export default observer(CustomsLogisticsCell);
