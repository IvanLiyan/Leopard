import React, { useMemo } from "react";
import { LoadingIndicator, Token } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import { observer } from "mobx-react";
import TaxonomyCategoryColumn from "./TaxonomyCategoryColumn";
import { TaxonomyAction, TaxonomyState } from "@core/taxonomy/v2/reducer";

type Props = {
  readonly maxSelection?: number;
  readonly hideToken?: boolean;
  readonly dispatch: React.Dispatch<TaxonomyAction>;
  readonly state: TaxonomyState;
  readonly selectLeafOnly?: boolean;
};

const TaxonomyCategoryColumnViewV2: React.FC<Props> = ({
  maxSelection,
  hideToken,
  state,
  dispatch,
  selectLeafOnly,
}: Props) => {
  const { borderPrimary } = useTheme();

  const maxReached = useMemo(() => {
    return maxSelection != null
      ? state.selectedNodes.size >= maxSelection
      : false;
  }, [maxSelection, state.selectedNodes.size]);

  if (state.categoryTreeMap.size === 0) {
    return <LoadingIndicator />;
  }

  return (
    <div className="category-column-view-root">
      <style jsx>{`
        .category-column-view-root {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }
        .category-column-view-columns {
          display: flex;
          flex-direction: row;
          border: solid 1px ${borderPrimary};
          border-radius: 8px;
          height: 430px;
        }
        .category-column-view-tokens {
          display: flex;
          flex-direction: row;
          gap: 16px;
          flex-wrap: wrap;
        }
      `}</style>
      {!hideToken && state.selectedNodes.size > 0 && (
        <div className="category-column-view-tokens">
          {Array.from(state.selectedNodes).map((id) => {
            const node = state.categoryTreeMap.get(id);
            return (
              node && (
                <Token
                  onDelete={() => {
                    dispatch({ type: "UNCHECK_NODE", id });
                  }}
                  key={id}
                >
                  {`${node.name} (${node.id})`}
                </Token>
              )
            );
          })}
        </div>
      )}
      <div className="category-column-view-columns">
        {state.highlightedPath.map((id, i) => {
          const children = state.categoryTreeMap.get(id)?.childrenIds ?? [];

          return (
            children.length > 0 && (
              <TaxonomyCategoryColumn
                key={id}
                level={i + 1}
                columnItems={children}
                disableAll={maxSelection !== 1 && maxReached}
                dispatch={dispatch}
                state={state}
                singleSelect={maxSelection === 1}
                selectLeafOnly={selectLeafOnly}
              />
            )
          );
        })}
      </div>
    </div>
  );
};

export default observer(TaxonomyCategoryColumnViewV2);
