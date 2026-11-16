import {
  FileImage,
  FileSignature,
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
  /** iOS system color used for the icon tile */
  color: string;
}

export const TOOLS: ToolDefinition[] = [
  {
    slug: "merge",
    name: "Merge PDF",
    description: "Combine multiple PDFs into one, in any order you choose.",
    icon: FileStack,
    color: "#007aff",
  },
  {
    slug: "split",
    name: "Split PDF",
    description: "Extract a page range or split every page into its own file.",
    icon: Scissors,
    color: "#ff9500",
  },
  {
    slug: "rotate",
    name: "Rotate PDF",
    description: "Fix sideways or upside-down pages in seconds.",
    icon: RotateCw,
    color: "#34c759",
  },
  {
    slug: "delete-pages",
    name: "Delete Pages",
    description: "Remove unwanted pages from a PDF.",
    icon: Trash2,
    color: "#ff3b30",
  },
  {
    slug: "reorder-pages",
    name: "Reorder Pages",
    description: "Drag pages into the order you need.",
    icon: FileStack,
    color: "#5856d6",
  },
  {
    slug: "images-to-pdf",
    name: "Images to PDF",
    description: "Turn JPG or PNG photos into a single PDF document.",
    icon: Images,
    color: "#af52de",
  },
  {
    slug: "pdf-to-images",
    name: "PDF to Images",
    description: "Export any page as a high-quality PNG or JPEG.",
    icon: FileImage,
    color: "#30b0c7",
  },
  {
    slug: "sign",
    name: "Sign PDF",
    description: "Add text and signatures to fill out and sign forms.",
    icon: FileSignature,
    color: "#ff2d55",
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}
