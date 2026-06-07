"use client";

import { ImageFormatTool } from "@/components/tools/image-format-tool";

export default function WebpConverter() {
  return <ImageFormatTool targetMime="image/webp" extension="webp" hasQuality accept="image/*" />;
}
