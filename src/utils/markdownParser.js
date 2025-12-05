import { marked } from "marked";

function parseMarkdown(markdown) {
  try {
    return marked.parse(markdown);
  } catch (error) {
    console.error("Erreur lors du parsing du Markdown:", error);
    return markdown;
  }
}

function replaceBlockPlaceholders(content, blocks) {
  return content.replace(/{{block\(([^)]+)\)}}/g, (match, p1) => {
    return blocks.find((block) => block.id === p1)?.content || "";
  });
}

function replaceImagePlaceholders(content, images) {
  return content.replace(/{{image\(([^)]+)\)}}/g, (match, p1) => {
    const image = images.find((image) => image.id === p1);
    if (!image) return "";

    if (image.data) {
      return `![${image.name || "image"}](${image.data})`;
    }
    if (image.url) {
      return `![${image.name || "image"}](${image.url})`;
    }
    return "";
  });
}

function extractBlockReferences(content) {
  return content.match(/{{block\(([^)]+)\)}}/g) || [];
}

export {
  parseMarkdown,
  replaceBlockPlaceholders,
  replaceImagePlaceholders,
  extractBlockReferences,
};
