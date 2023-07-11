import React from "react";
import { NextPage } from "next";
import Cookies from "js-cookie";
import { GraphiQL } from "graphiql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import "graphiql/graphiql.min.css";
import { useQuery } from "@apollo/client";
import { useApolloStore } from "@core/stores/ApolloStore";
import FullPageError from "@core/components/FullPageError";
import { gql } from "@gql";

const GQLPlaygroundPage: NextPage<Record<string, never>> = () => {
  const { client } = useApolloStore();
  const { data, loading } = useQuery<{
    readonly su?: {
      readonly id: string;
    };
    readonly currentUser?: {
      readonly isAdmin: boolean;
    };
  }>(
    gql(`
      query AdminCheck {
        su {
          id
        }
        currentUser {
          isAdmin
        }
      }
    `),
    { client },
  );

  if (loading) {
    // we don't return a loading indicator to obfuscate we may be loading into a 404 error
    return <div />;
  }

  const isAdmin = data?.su || data?.currentUser?.isAdmin;

  if (!isAdmin) {
    return <FullPageError error="404" />;
  }

  return (
    <div style={{ height: "100vh" }}>
      <GraphiQL
        fetcher={createGraphiQLFetcher({
          url: "/api/graphql",
          headers: {
            "X-XSRFToken": Cookies.get("_xsrf") ?? "",
          },
        })}
        defaultEditorToolsVisibility
      />
    </div>
  );
};

export default GQLPlaygroundPage;
