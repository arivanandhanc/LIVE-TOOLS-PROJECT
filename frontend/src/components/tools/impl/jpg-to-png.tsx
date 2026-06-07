"use client";

import { ImageFormatTool } from "@/components/tools/image-format-tool";

export default function JpgToPng() {
  return <ImageFormatTool targetMime="image/png" extension="png" accept="image/jpeg,image/jpg" />;
}
