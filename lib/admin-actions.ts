"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAuthenticated, loginAdmin, logoutAdmin } from "./admin-auth";

const REPO_OWNER = "f4h3m";
const REPO_NAME = "bluenotarynext";

export interface PostFormData {
  title: string;
  slug: string;
  originalSlug?: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
  featured: boolean;
  excerpt: string;
  tags: string[];
  content: string;
}

export async function loginAction(password: string) {
  const success = await loginAdmin(password);
  if (success) {
    redirect("/admin");
  }
  return { error: "Invalid admin password" };
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}

function generateMdxString(data: PostFormData): string {
  const tagsYaml = data.tags.length > 0
    ? `tags:\n${data.tags.map((t) => `  - "${t.replace(/"/g, '\\"')}"`).join("\n")}`
    : "tags: []";

  return `---
title: "${data.title.replace(/"/g, '\\"')}"
category: "${data.category.replace(/"/g, '\\"')}"
author: "${data.author.replace(/"/g, '\\"')}"
date: "${data.date.replace(/"/g, '\\"')}"
imageUrl: "${data.imageUrl.replace(/"/g, '\\"')}"
imageAlt: "${data.imageAlt.replace(/"/g, '\\"')}"
featured: ${data.featured ? "true" : "false"}
excerpt: "${data.excerpt.replace(/"/g, '\\"')}"
${tagsYaml}
---

${data.content.trim()}
`;
}

export async function savePostAction(data: PostFormData) {
  const authed = await isAuthenticated();
  if (!authed) {
    throw new Error("Unauthorized");
  }

  const cleanSlug = data.slug
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const fileContent = generateMdxString({ ...data, slug: cleanSlug });
  const githubToken = process.env.GITHUB_TOKEN || process.env.KEYSTATIC_GITHUB_TOKEN;

  // In production with GitHub Token: commit directly via GitHub API
  if (process.env.NODE_ENV === "production" && githubToken) {
    try {
      const filePath = `content/posts/${cleanSlug}.mdx`;
      const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

      // Check if file exists to obtain its SHA
      let sha: string | undefined;
      const getRes = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      });

      if (getRes.ok) {
        const fileInfo = await getRes.json();
        sha = fileInfo.sha;
      }

      // If renamed from originalSlug, delete old file
      if (data.originalSlug && data.originalSlug !== cleanSlug) {
        const oldPath = `content/posts/${data.originalSlug}.mdx`;
        const oldApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${oldPath}`;
        const oldRes = await fetch(oldApiUrl, {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          cache: "no-store",
        });
        if (oldRes.ok) {
          const oldInfo = await oldRes.json();
          await fetch(oldApiUrl, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${githubToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Remove old post slug: ${data.originalSlug}`,
              sha: oldInfo.sha,
            }),
          });
        }
      }

      // Commit file to GitHub
      const putRes = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Publish post: ${data.title}`,
          content: Buffer.from(fileContent).toString("base64"),
          sha,
        }),
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        throw new Error(`GitHub API Error: ${errText}`);
      }
    } catch (err: any) {
      console.error("GitHub commit failed:", err);
      return { error: `Failed to commit to GitHub: ${err.message}` };
    }
  } else {
    // Local development mode: save to filesystem
    try {
      const postsDir = path.join(process.cwd(), "content/posts");
      if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
      }

      // Remove old file if slug changed
      if (data.originalSlug && data.originalSlug !== cleanSlug) {
        const oldFile = path.join(postsDir, `${data.originalSlug}.mdx`);
        if (fs.existsSync(oldFile)) {
          fs.unlinkSync(oldFile);
        }
      }

      const filePath = path.join(postsDir, `${cleanSlug}.mdx`);
      fs.writeFileSync(filePath, fileContent, "utf8");
    } catch (err: any) {
      console.error("Local save failed:", err);
      return { error: `Failed to save file: ${err.message}` };
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/blog/${cleanSlug}`);

  return { success: true, slug: cleanSlug };
}

export async function deletePostAction(slug: string) {
  const authed = await isAuthenticated();
  if (!authed) {
    throw new Error("Unauthorized");
  }

  const githubToken = process.env.GITHUB_TOKEN || process.env.KEYSTATIC_GITHUB_TOKEN;

  if (process.env.NODE_ENV === "production" && githubToken) {
    const filePath = `content/posts/${slug}.mdx`;
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;
    const getRes = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    });

    if (getRes.ok) {
      const fileInfo = await getRes.json();
      await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Delete post: ${slug}`,
          sha: fileInfo.sha,
        }),
      });
    }
  } else {
    const postsDir = path.join(process.cwd(), "content/posts");
    const targetFile = path.join(postsDir, `${slug}.mdx`);
    if (fs.existsSync(targetFile)) {
      fs.unlinkSync(targetFile);
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
