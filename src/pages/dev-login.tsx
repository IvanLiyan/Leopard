// dev page, not exposed to merchants
/* eslint-disable no-console */
import { NextPage } from "next";
import { useState } from "react";
import Cookies from "js-cookie";
import {
  Button,
  H1,
  Layout,
  LegoProvider,
  LoadingIndicator,
  Text,
} from "@ContextLogic/lego";

const useError = (
  initialState: string | null,
): [
  error: string | null,
  setError: (error: string, ...rest: unknown[]) => void,
] => {
  const [error, setError] = useState<string | null>(initialState);

  const onError = (errorProp: string, ...rest: unknown[]) => {
    setError(errorProp);
    console.log(errorProp, ...rest);
  };

  return [error, onError];
};

const DevLoginPage: NextPage<Record<string, never>> = () => {
  // use numbers to emulate a stack of requests that need to complete before
  // loading is finished
  const [loading, setLoading] = useState(0);
  const [error, setError] = useError(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMerchant, setCurrentMerchant] = useState(null);

  const devLogin = async () => {
    setLoading((cur) => cur + 1);
    try {
      const resp = await fetch("/api/dev-login");
      if (!resp.ok) {
        setError(
          "An error occurred while logging you in. Please see the console for more details.",
          resp,
        );
        return;
      }
      void fetchApiGraphql();
    } finally {
      setLoading((cur) => cur - 1);
    }
  };

  const fetchApiGraphql = async () => {
    setLoading((cur) => cur + 1);
    try {
      const xsrf = Cookies.get("_xsrf");

      if (xsrf === undefined) {
        setError(
          "XSRF cookie is missing, aborting /api/graphql fetch. Have you logged into the dashboard via dev-login yet? If not, try that.",
        );
        return;
      }

      const resp = await fetch("/api/graphql", {
        body: '{"operationName":null,"variables":{},"query":"{\\n  currentMerchant {\\n    id\\n  }\\n  currentUser {\\n    id\\n  }\\n}\\n"}',
        method: "POST",
        headers: {
          "cache-control": "no-cache",
          "content-type": "application/json",
          accept: "application/json",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-xsrftoken": xsrf,
        },
        mode: "cors",
        credentials: "include",
      });
      const jsonResponse = await resp.json();
      setCurrentUser(
        jsonResponse.data.currentUser
          ? jsonResponse.data.currentUser.id
          : "User not logged in",
      );
      setCurrentMerchant(
        jsonResponse.data.currentMerchant
          ? jsonResponse.data.currentMerchant.id
          : "Merchant not logged in",
      );
    } catch (e) {
      setError(
        "An error occurred while fetching api/graphql. Have you logged into the dashboard via dev-login yet? If not, try that. (You can view the full error in the console.)",
        e,
      );
    } finally {
      setLoading((cur) => cur - 1);
    }
  };

  if (loading) {
    return (
      <LegoProvider locale="en">
        <Layout.FlexRow alignItems="center" justifyContent="center">
          <LoadingIndicator type="swinging-bar" />
        </Layout.FlexRow>
      </LegoProvider>
    );
  }

  return (
    <LegoProvider locale="en">
      <Layout.FlexRow alignItems="center" justifyContent="center">
        <H1>dev-login</H1>
      </Layout.FlexRow>
      <Layout.FlexRow>
        {error ? (
          <Text>{error}</Text>
        ) : (
          <Text>
            You have been successfully logged in to the Merchant Dashboard.
          </Text>
        )}
      </Layout.FlexRow>
      <Layout.FlexRow>
        <Button onClick={devLogin}>Dev Login</Button>
        <Button onClick={fetchApiGraphql}>Fetch api/graphql</Button>
      </Layout.FlexRow>
      <Layout.FlexRow>
        <Text>Current User ID:</Text>
        <Text
          style={{
            marginLeft: 10,
          }}
        >
          {currentUser}
        </Text>
      </Layout.FlexRow>
      <Layout.FlexRow>
        <Text>Current Merchant ID: </Text>
        <Text
          style={{
            marginLeft: 10,
          }}
        >
          {currentMerchant}
        </Text>
      </Layout.FlexRow>
      <Layout.FlexRow>
        <Text>Merch-FE Target: </Text>
        <Text
          style={{
            marginLeft: 10,
          }}
        >
          {process.env.NEXT_PUBLIC_MD_URL}
        </Text>
      </Layout.FlexRow>
    </LegoProvider>
  );
};

export default DevLoginPage;
