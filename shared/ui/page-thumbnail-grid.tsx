"use client";

import { GripVertical } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/utils/cn";

export interface PageThumbnail {
  index: number;
  dataUrl: string;
  rotation?: number;
}

interface PageThumbnailGridProps {
  pages: PageThumbnail[];
  selectable?: boolean;
  selected?: Set<number>;
  onToggleSelect?: (index: number) => void;
  reorderable?: boolean;
  onReorder?: (newOrder: number[]) => void;
}

export function PageThumbnailGrid({
  pages,
  selectable = false,
  selected,
  onToggleSelect,
  reorderable = false,
  onReorder,
}: PageThumbnailGridProps) {
  const [dragPosition, setDragPosition] = useState<number | null>(null);

  function handleDrop(targetPosition: number) {
    if (dragPosition === null || !onReorder) return;
    const order = pages.map((page) => page.index);
    const [moved] = order.splice(dragPosition, 1);
    order.splice(targetPosition, 0, moved);
    onReorder(order);
    setDragPosition(null);
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {pages.map((page, position) => {
        const isSelected = selected?.has(page.index) ?? false;
        return (
          <div
            key={page.index}
            draggable={reorderable}
            onDragStart={() => setDragPosition(position)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(position)}
            onClick={() => onToggleSelect?.(page.index)}
            className={cn(
              "group relative flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-2 transition-shadow",
              (selectable || reorderable) && "cursor-pointer",
              isSelected && "ring-2 ring-primary",
            )}
          >
            {reorderable && (
              <GripVertical className="absolute left-1 top-1 size-4 cursor-grab text-muted-foreground/60" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.dataUrl}
              alt={`Page ${page.index + 1}`}
              style={{ transform: `rotate(${page.rotation ?? 0}deg)` }}
              className="aspect-[3/4] w-full rounded-md object-contain shadow-sm transition-transform"
            />
            <span className="text-xs text-muted-foreground">
              {page.index + 1}
            </span>
            {selectable && (
              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="absolute right-1 top-1 size-4 accent-primary"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
