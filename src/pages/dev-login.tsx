import { NextPage } from "next";
import { useState, useEffect } from "react";

const DevLoginPage: NextPage<Record<string, never>> = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    void fetch("/api/dev-login").then((resp) => {
      setLoading(false);
      if (!resp.ok) {
        setError(true);
      }
    });
  });

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {error
        ? "An error occurred while logging you in. Please see the console for more details."
        : "You have been successfully logged in to the Merchant Dashboard."}
    </div>
  );
};

export default DevLoginPage;
