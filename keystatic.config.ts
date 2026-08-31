import { config, fields, collection } from "@keystatic/core";

export const BLOG_CATEGORIES = [
  "All",
  "API",
  "Autolending",
  "Business",
  "Document Templates",
  "Eclosing",
  "Estate Planning",
  "Forms",
  "How To Become A Notary",
  "Law Firms",
  "Lenders",
  "Online Notarization",
  "Online Notary",
  "Real Estate",
  "Title Escrow",
  "Will Trust",
  "Identity Authentication",
] as const;

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        category: fields.select({
          label: "Category",
          options: BLOG_CATEGORIES.filter((c) => c !== "All").map((cat) => ({
            label: cat,
            value: cat,
          })),
          defaultValue: "Online Notarization",
        }),
        author: fields.text({ label: "Author", defaultValue: "Om Rathod" }),
        date: fields.text({ label: "Date", defaultValue: "August 6, 2026" }),
        imageUrl: fields.text({
          label: "Image URL",
          defaultValue:
            "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
        }),
        imageAlt: fields.text({
          label: "Image Alt Text",
          defaultValue: "Notary public stamping legal document",
        }),
        featured: fields.checkbox({
          label: "Featured Post",
          defaultValue: false,
        }),
        excerpt: fields.text({ label: "Excerpt", multiline: true }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        content: fields.mdx({
          label: "Content",
        }),
      },
    }),
  },
});
