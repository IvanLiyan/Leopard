//
//  toolkit/products/constants
//  Project-Lego
//
//  Created by @pbao on 04/24/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//

import { useDeciderKey } from "@core/stores/ExperimentStore";
import { useEffect, useState } from "react";

export const Constants = {
  DEFAULT_DIMENSIONS: [
    "neck",
    "shoulder",
    "sleeve",
    "bust",
    "waist",
    "hip",
    "inseam",
  ],
  DIMENSIONS_TO_DISPLAY: {
    neck: i`Neck`,
    shoulder: i`Shoulder`,
    sleeve: i`Sleeve`,
    bust: i`Bust/Chest`,
    waist: i`Waist`,
    hip: i`Hip`,
    inseam: i`Inseam`,
  },
  TAXONOMY: {
    // disabled because this attribute name is hardcoded on BE side and not localized
    // it also sits outside the taxonomy tree for unknown reason
    // eslint-disable-next-line local-rules/unwrapped-i18n
    sizeChartImgAttrName: "Size Chart Image",
    treeVersion: "v3.0.1",
    fashionCategoryId: 6023, // Women's Clothing
    rootCategoryId: 1,
    printAttributeID: 3338,
    primaryColorAttributeID: 3345,
  },
};

export const useTreeVersion = () => {
  const { decision, isLoading } = useDeciderKey(
    "enable_taxonomy_version_upgrade",
  );
  const [loading, setLoading] = useState<boolean>(isLoading);
  const [version, setVersion] = useState<string | undefined>();

  useEffect(() => {
    setLoading(isLoading);
    if (!isLoading) {
      setVersion(decision ? "v3.0.1" : "v3.0.0");
    }
  }, [decision, isLoading]);

  return { version, loading };
};
