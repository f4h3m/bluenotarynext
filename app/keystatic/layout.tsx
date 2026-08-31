import React, { Suspense } from "react";
import KeystaticApp from "./keystatic";
import { isGoogleAdminAuthenticated } from "@/lib/google-auth";
import KeystaticGoogleGate from "@/components/keystatic/KeystaticGoogleGate";

export default async function Layout() {
  const authed = await isGoogleAdminAuthenticated();

  if (!authed) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#fffcf1]" />}>
        <KeystaticGoogleGate />
      </Suspense>
    );
  }

  return <KeystaticApp />;
}
