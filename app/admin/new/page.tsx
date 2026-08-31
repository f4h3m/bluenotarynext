import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import PostEditor from "@/components/admin/PostEditor";

export default async function NewPostPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return <PostEditor isEditing={false} />;
}
