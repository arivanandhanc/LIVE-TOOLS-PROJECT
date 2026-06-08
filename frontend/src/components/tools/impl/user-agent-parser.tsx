"use client";

import { Transformer } from "@/components/tools/transformer";

function parseUserAgent(ua: string): string {
  const s = ua.trim();
  if (!s) throw new Error("Paste a user-agent string.");

  const browser =
    /Edg\/([\d.]+)/.exec(s) ? `Edge ${/Edg\/([\d.]+)/.exec(s)![1]}` :
    /OPR\/([\d.]+)/.exec(s) ? `Opera ${/OPR\/([\d.]+)/.exec(s)![1]}` :
    /Firefox\/([\d.]+)/.exec(s) ? `Firefox ${/Firefox\/([\d.]+)/.exec(s)![1]}` :
    /Chrome\/([\d.]+)/.exec(s) ? `Chrome ${/Chrome\/([\d.]+)/.exec(s)![1]}` :
    /Version\/([\d.]+).*Safari/.exec(s) ? `Safari ${/Version\/([\d.]+)/.exec(s)![1]}` :
    "Unknown";

  const os =
    /Windows NT 10/.test(s) ? "Windows 10/11" :
    /Windows NT ([\d.]+)/.exec(s) ? `Windows NT ${/Windows NT ([\d.]+)/.exec(s)![1]}` :
    /Mac OS X ([\d_]+)/.exec(s) ? `macOS ${/Mac OS X ([\d_]+)/.exec(s)![1].replace(/_/g, ".")}` :
    /Android ([\d.]+)/.exec(s) ? `Android ${/Android ([\d.]+)/.exec(s)![1]}` :
    /iPhone OS ([\d_]+)/.exec(s) ? `iOS ${/iPhone OS ([\d_]+)/.exec(s)![1].replace(/_/g, ".")}` :
    /Linux/.test(s) ? "Linux" : "Unknown";

  const device =
    /Mobile|Android|iPhone/.test(s) ? "Mobile" :
    /iPad|Tablet/.test(s) ? "Tablet" : "Desktop";

  const engine =
    /Gecko\/\d/.test(s) && /Firefox/.test(s) ? "Gecko" :
    /AppleWebKit\/([\d.]+)/.exec(s) ? `WebKit/Blink ${/AppleWebKit\/([\d.]+)/.exec(s)![1]}` :
    "Unknown";

  return [
    `Browser:  ${browser}`,
    `OS:       ${os}`,
    `Device:   ${device}`,
    `Engine:   ${engine}`,
  ].join("\n");
}

export default function UserAgentParser() {
  return (
    <Transformer
      live
      inputLabel="User-Agent string"
      outputLabel="Parsed"
      inputPlaceholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 …"
      sampleInput={typeof navigator !== "undefined" ? navigator.userAgent : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
      actions={[{ label: "Parse", run: parseUserAgent }]}
    />
  );
}
