import React from "react";
import { ci18n } from "@core/toolkit/i18n";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import { observer } from "mobx-react";
import Section, {
  SectionProps,
} from "@add-edit-product/components/cards/Section";
import { Grid } from "@ContextLogic/atlas-ui";
import AttributeField from "./AttributeField";
import { merchFeUrl } from "@core/toolkit/router";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

/**
 * This section displays variation attributes when user does not explicitly specify any variation
 */
const AdditionalAttributesV2: React.FC<Props> = (props: Props) => {
  const { style, className, state, ...sectionProps } = props;
  const {
    variationAttributes,
    additionalAttributes,
    updateAdditionalAttributes,
  } = state;

  return (
    <Section
      style={[style, className]}
      title={ci18n(
        "Section title, means additional product attributes",
        "**Additional attributes**",
      )}
      tooltip={i`Click [here](${merchFeUrl(
        "/md/products/categories",
      )}) to learn more about additional attribute definitions. `}
      markdown
      {...sectionProps}
    >
      <Grid container spacing={{ xs: 2 }}>
        {variationAttributes.map((attribute) => {
          const attrValue = additionalAttributes[attribute.name];
          return (
            <Grid item xs={6} key={attribute.id}>
              <AttributeField
                state={state}
                attribute={attribute}
                value={attrValue}
                onChange={(value) =>
                  updateAdditionalAttributes({
                    attrName: attribute.name,
                    attrValue: value,
                  })
                }
              />
            </Grid>
          );
        })}
      </Grid>
    </Section>
  );
};

export default observer(AdditionalAttributesV2);
