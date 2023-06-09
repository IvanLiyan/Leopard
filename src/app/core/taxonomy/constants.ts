import { useDeciderKey } from "@core/stores/ExperimentStore";
import { useEffect, useState } from "react";

export const Constants = {
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
    maxMultiselectCategory: 5,
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

export const SelfClassifyAllowedL1 = [
  Constants.TAXONOMY.fashionCategoryId,
  4047, // Jewelry & Accessories
  4166, // Men’s Clothing
  2, // Apparel Accessories
  4740, // Shoes
  4120, // Luggage & Bags
  2329, // Home & Garden
  3391, // Home Improvement
  4787, // Entertainment
  4878, // Sports
  5706, // Toys & Hobbies
  1244, // Cellphones & Telecommunications
  1495, // Consumer Electronics
  1317, // Computer & Office
];
