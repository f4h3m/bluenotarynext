import React from "react";
import KeystaticApp from "./keystatic";
import { isKeystaticAuthenticated } from "@/lib/keystatic-auth-actions";
import KeystaticPasswordGate from "@/components/keystatic/KeystaticPasswordGate";

export default async function Layout() {
  const authed = await isKeystaticAuthenticated();

  if (!authed) {
    return <KeystaticPasswordGate />;
  }

  return <KeystaticApp />;
}
