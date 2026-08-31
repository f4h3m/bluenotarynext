import React from "react";
import Markdoc, { Config } from "@markdoc/markdoc";
import TableOfContents from "./TableOfContents";

interface MdxContentRendererProps {
  content: string;
  showToc?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Extract headings for Table of Contents
export function extractHeadings(rawText: string): { id: string; title: string }[] {
  const headingRegex = /^##\s+(.+)$/gm;
  const headings: { id: string; title: string }[] = [];
  let match;

  while ((match = headingRegex.exec(rawText)) !== null) {
    const title = match[1].trim().replace(/[*_`]/g, "");
    headings.push({
      id: slugify(title),
      title,
    });
  }

  return headings;
}

export default function MdxContentRenderer({
  content,
  showToc = true,
}: MdxContentRendererProps) {
  if (!content) return null;

  const headings = extractHeadings(content);

  // Custom components for Markdoc rendering
  const markdocComponents = {
    Heading2: ({ children }: { children: React.ReactNode }) => {
      const text = typeof children === "string" ? children : React.Children.toArray(children).join("");
      const id = slugify(text);
      return (
        <h2
          id={id}
          className="text-xl sm:text-2xl font-bold text-[#232222] mt-10 mb-4 tracking-tight scroll-mt-24 first:mt-2"
        >
          {children}
        </h2>
      );
    },
    Heading3: ({ children }: { children: React.ReactNode }) => {
      const text = typeof children === "string" ? children : React.Children.toArray(children).join("");
      const id = slugify(text);
      return (
        <h3
          id={id}
          className="text-lg sm:text-xl font-bold text-[#232222] mt-6 mb-3 tracking-tight scroll-mt-24"
        >
          {children}
        </h3>
      );
    },
    Paragraph: ({ children }: { children: React.ReactNode }) => {
      return (
        <p className="text-sm sm:text-base text-[#2C2B2B] leading-relaxed mb-5">
          {children}
        </p>
      );
    },
    List: ({ children, ordered }: { children: React.ReactNode; ordered?: boolean }) => {
      if (ordered) {
        return (
          <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-[#4A4944] mb-6 pl-2">
            {children}
          </ol>
        );
      }
      return (
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-[#4A4944] mb-6 pl-2">
          {children}
        </ul>
      );
    },
    ListItem: ({ children }: { children: React.ReactNode }) => {
      return <li className="text-[#4A4944] leading-relaxed">{children}</li>;
    },
    Link: ({ href, children }: { href: string; children: React.ReactNode }) => {
      return (
        <a
          href={href}
          className="text-[#3B40D5] font-semibold underline hover:text-[#3035b8] transition-colors"
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
    Strong: ({ children }: { children: React.ReactNode }) => {
      return <strong className="font-bold text-[#232222]">{children}</strong>;
    },
    Blockquote: ({ children }: { children: React.ReactNode }) => {
      return (
        <blockquote className="border-l-4 border-[#3B40D5] bg-[#FAF9F5] p-4 rounded-r-lg my-6 italic text-[#4A4944]">
          {children}
        </blockquote>
      );
    },
  };

  const markdocConfig: Config = {
    nodes: {
      heading: {
        render: "Heading",
        attributes: {
          level: { type: Number, required: true },
        },
        transform(node, config) {
          const attributes = node.transformAttributes(config);
          const children = node.transformChildren(config);
          if (node.attributes.level === 2) {
            return new Markdoc.Tag("Heading2", attributes, children);
          }
          if (node.attributes.level === 3) {
            return new Markdoc.Tag("Heading3", attributes, children);
          }
          return new Markdoc.Tag(`h${node.attributes.level}`, attributes, children);
        },
      },
      paragraph: {
        render: "Paragraph",
      },
      list: {
        render: "List",
        attributes: {
          ordered: { type: Boolean },
        },
      },
      item: {
        render: "ListItem",
      },
      link: {
        render: "Link",
        attributes: {
          href: { type: String, required: true },
        },
      },
      strong: {
        render: "Strong",
      },
      blockquote: {
        render: "Blockquote",
      },
    },
  };

  const ast = Markdoc.parse(content);
  const transformed = Markdoc.transform(ast, markdocConfig);

  return (
    <div className="w-full">
      {/* Dynamic Table of Contents if headings exist */}
      {showToc && headings.length >= 2 && (
        <TableOfContents items={headings} className="mb-8" />
      )}

      {/* Rendered Markdown/MDX Prose */}
      <div className="prose-content">
        {Markdoc.renderers.react(transformed, React, {
          components: markdocComponents,
        })}
      </div>
    </div>
  );
}
