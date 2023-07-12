import { gql } from "@gql";

export const EXISTING_COMPLIANCE_DOCUMENTS = gql(`
  query EXISTING_COMPLIANCE_DOCUMENTS($id: String!) {
    productCatalog {
      product(id: $id) {
        productComplianceDocuments {
          fileName
          fileUrl
          documentLabel
        }
      }
    }
  }
`);

export const UPDATE_COMPLIANCE_DOCUMENTS = gql(`
  mutation UPDATE_COMPLIANCE_DOCUMENTS(
    $input: [ProductComplianceDocumentInput!]!
  ) {
    productCatalog {
      uploadProductComplianceDocument(input: $input) {
        ok
        failure
        fileUrls
      }
    }
  }
`);
