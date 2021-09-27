import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SearchBox } from "@ContextLogic/lego";

/* Lego Toolkit */
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type VerifyBrandsSearchProps = BaseProps & {
  readonly initialQuery: string | null | undefined;
  readonly onQueryUpdate: (newQuery: string | null | undefined) => void;
};

const VerifyBrandsSearch = (props: VerifyBrandsSearchProps) => {
  const { initialQuery, onQueryUpdate } = props;

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebouncer(query, 500);

  useEffect(() => {
    onQueryUpdate(debouncedQuery);
  }, [onQueryUpdate, debouncedQuery]);

  return (
    <SearchBox
      placeholder={i`Search by brand name`}
      onChange={({ text }) => setQuery(text)}
      height={38}
      value={query}
    />
  );
};

export default observer(VerifyBrandsSearch);
