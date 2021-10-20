import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components*/
import CodeWrapper from "@merchant/component/external/release-notes/CodeWrapper";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import {
  EndpointDetail,
  ParamDetail,
  ActionType,
  PropDetail,
  ResponseDetail,
  RequiredPropDetail,
} from "@merchant/api/release-notes";

type DetailSectionProps = {
  readonly detail: EndpointDetail;
};

type ParamSectionProps = {
  readonly paramDetail: ParamDetail;
};

type PropSectionProps = {
  readonly propDetail: PropDetail;
};

type RespSectionProps = {
  readonly respDetail: ResponseDetail;
};

/* eslint-disable local-rules/unnecessary-list-usage */
/* eslint-disable local-rules/use-markdown */
const RespSection = ({ respDetail }: RespSectionProps) => {
  const styles = useStylesheet();
  const {
    status_code: code,
    property_list: propList,
    required_properties: requiredProps,
    new_schema: newSchema,
  } = respDetail;

  const renderRequired = (requiredProps: RequiredPropDetail) => {
    const { added, removed } = requiredProps;
    return (
      <>
        {added && added.length !== 0 && (
          <li>
            Added required properties to schema&nbsp;
            <CodeWrapper>{added}</CodeWrapper>
          </li>
        )}
        {removed && removed.length !== 0 && (
          <li>
            Removed required properties from schema&nbsp;
            <CodeWrapper>{removed}</CodeWrapper>
          </li>
        )}
      </>
    );
  };

  return (
    <li>
      {newSchema && i`New schema definition added for `}
      {code >= 200 && code < 400 ? (
        <strong className={css(styles.codeSuccess)}>{code}</strong>
      ) : (
        <strong className={css(styles.codeFailure)}>{code}</strong>
      )}
      <ul className={css(styles.list)}>
        {propList &&
          propList.map((paramDetail) => (
            <ParamSection key={paramDetail.name} paramDetail={paramDetail} />
          ))}
        {requiredProps && renderRequired(requiredProps)}
      </ul>
    </li>
  );
};

const ParamSection = ({ paramDetail }: ParamSectionProps) => {
  const styles = useStylesheet();
  const { name, type, prop_detail: propDetail } = paramDetail;

  const actionToVerb = (action: ActionType) => {
    switch (action) {
      case ActionType.add:
        return i`Added`;
      case ActionType.change:
        return i`Updated`;
      case ActionType.delete:
        return i`No longer needed`;
    }
  };

  if (type !== ActionType.change) {
    return (
      <li>
        <p>
          {actionToVerb(type)} property&nbsp;
          <CodeWrapper>{name}</CodeWrapper>
        </p>
      </li>
    );
  }

  return (
    <li>
      <p>
        {actionToVerb(type)}&nbsp;
        <CodeWrapper>{name}</CodeWrapper>
      </p>
      {propDetail && (
        <ul className={css(styles.list)}>
          {propDetail.map((propDetail) => (
            <PropSection key={propDetail.type} propDetail={propDetail} />
          ))}
        </ul>
      )}
    </li>
  );
};

const PropSection = ({ propDetail }: PropSectionProps) => {
  const {
    action,
    type,
    old_value_str: oldValue,
    new_value_str: newValue,
  } = propDetail;

  switch (action) {
    case ActionType.add:
      return (
        <li>
          <p>
            Set&nbsp;
            <CodeWrapper>{type}</CodeWrapper>
            &nbsp;to&nbsp;
            <CodeWrapper>{newValue}</CodeWrapper>
          </p>
        </li>
      );
    case ActionType.delete:
      return (
        <li>
          <p>
            Removed restriction of &nbsp;<CodeWrapper>{type}</CodeWrapper>{" "}
          </p>
        </li>
      );
    case ActionType.change:
      return (
        <li>
          <p>
            Updated &nbsp;
            <CodeWrapper>{type}</CodeWrapper>
            <br />
            &nbsp;from&nbsp;
            <CodeWrapper>{oldValue}</CodeWrapper>
            <br />
            &nbsp;to&nbsp;
            <CodeWrapper>{newValue}</CodeWrapper>
          </p>
        </li>
      );

    default:
      return null;
  }
};

const DetailSection = ({ detail }: DetailSectionProps) => {
  const styles = useStylesheet();
  const { paths, requests, responses } = detail;

  return (
    <>
      {paths && paths.length > 0 && (
        <>
          <h4>Changes on path parameters:</h4>
          <ul className={css(styles.list)}>
            {paths.map((paramDetail) => (
              <ParamSection key={paramDetail.name} paramDetail={paramDetail} />
            ))}
          </ul>
        </>
      )}
      {requests && requests.length > 0 && (
        <>
          <h4>Changes on request schema:</h4>
          <ul className={css(styles.list)}>
            {requests.map((paramDetail) => (
              <ParamSection key={paramDetail.name} paramDetail={paramDetail} />
            ))}
          </ul>
        </>
      )}
      {responses && responses.length > 0 && (
        <>
          <h4>Changes on responses schema:</h4>
          <ul className={css(styles.list)}>
            {responses.map((respDetail) => (
              <RespSection
                key={respDetail.status_code}
                respDetail={respDetail}
              />
            ))}
          </ul>
        </>
      )}
    </>
  );
};

const useStylesheet = () => {
  const { positive, negative } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        list: {
          listStyleType: "disc",
        },
        codeSuccess: {
          color: positive,
        },
        codeFailure: {
          color: negative,
        },
      }),
    [positive, negative],
  );
};

export default DetailSection;
