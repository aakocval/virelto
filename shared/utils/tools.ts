import {
  FileImage,
  FileStack,
  Images,
  RotateCw,
  Scissors,
  Trash2,
  type LucideIcon,
} from "lucide-react";

export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const TOOLS: ToolDefinition[] = [
  {
    slug: "merge",
    name: "Merge PDF",
    description: "Combine multiple PDFs into one, in any order you choose.",
    icon: FileStack,
  },
  {
    slug: "split",
    name: "Split PDF",
    description: "Extract a page range or split every page into its own file.",
    icon: Scissors,
  },
  {
    slug: "rotate",
    name: "Rotate PDF",
    description: "Fix sideways or upside-down pages in seconds.",
    icon: RotateCw,
  },
  {
    slug: "delete-pages",
    name: "Delete Pages",
    description: "Remove unwanted pages from a PDF.",
    icon: Trash2,
  },
  {
    slug: "reorder-pages",
    name: "Reorder Pages",
    description: "Drag pages into the order you need.",
    icon: FileStack,
  },
  {
    slug: "images-to-pdf",
    name: "Images to PDF",
    description: "Turn JPG or PNG photos into a single PDF document.",
    icon: Images,
  },
  {
    slug: "pdf-to-images",
    name: "PDF to Images",
    description: "Export any page as a high-quality PNG or JPEG.",
    icon: FileImage,
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}
