"use client";

import { ImageFormatTool } from "@/components/tools/image-format-tool";

export default function PngToJpg() {
  return (
    <ImageFormatTool
      targetMime="image/jpeg"
      extension="jpg"
      hasQuality
      flatten
      accept="image/png"
    />
  );
}
