"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolPanel, Field } from "@/components/tools/panel";
import { downloadBlob } from "@/lib/utils";

export default function QrGenerator() {
  const [text, setText] = React.useState("https://convertflow.app");
  const [fg, setFg] = React.useState("#171717");
  const [bg, setBg] = React.useState("#ffffff");
  const [dataUrl, setDataUrl] = React.useState("");

  React.useEffect(() => {
    if (!text) {
      setDataUrl("");
      return;
    }
    QRCode.toDataURL(text, {
      width: 512,
      margin: 2,
      color: { dark: fg, light: bg },
      errorCorrectionLevel: "M",
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [text, fg, bg]);

  async function download() {
    const blob = await (await fetch(dataUrl)).blob();
    downloadBlob(blob, "qr-code.png");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ToolPanel className="space-y-4">
        <Field label="Content" hint="URL, text, Wi-Fi config, vCard — anything.">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-28 font-sans"
            placeholder="https://example.com"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Foreground">
            <Input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 p-1" />
          </Field>
          <Field label="Background">
            <Input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 p-1" />
          </Field>
        </div>
      </ToolPanel>

      <ToolPanel className="flex flex-col items-center justify-center gap-4">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="Generated QR code" className="size-56 rounded-lg" />
        ) : (
          <div className="grid size-56 place-items-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            Enter content
          </div>
        )}
        <Button onClick={download} disabled={!dataUrl}>
          <Download /> Download PNG
        </Button>
      </ToolPanel>
    </div>
  );
}
