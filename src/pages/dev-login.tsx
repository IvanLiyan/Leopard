import { NextPage } from "next";
import { useState } from "react";
import {
  Button,
  H1,
  Layout,
  LegoProvider,
  LoadingIndicator,
  Text,
} from "@ContextLogic/lego";

const DevLoginPage: NextPage<Record<string, never>> = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMerchant, setCurrentMerchant] = useState(null);

  const devLogin = async () => {
    setLoading(true);
    const resp = await fetch("/api/dev-login");
    setLoading(false);
    if (!resp.ok) {
      setError(true);
    }
    void fetchApiGraphql();
  };

  const fetchApiGraphql = async () => {
    const res = await fetch("/api/graphql", {
      body: '{"operationName":null,"variables":{},"query":"{\\n  currentMerchant {\\n    id\\n  }\\n  currentUser {\\n    id\\n  }\\n}\\n"}',
      method: "POST",
      headers: {
        "cache-control": "no-cache",
        "content-type": "application/json",
        accept: "application/json",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      mode: "cors",
      credentials: "include",
    });
    const jsonResponse = await res.json();
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
          <Text>
            An error occurred while logging you in. Please see the console for
            more details.
          </Text>
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
    </LegoProvider>
  );
};

export default DevLoginPage;
