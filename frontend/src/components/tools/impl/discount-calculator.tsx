"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { ToolPanel, Field, Stat } from "@/components/tools/panel";

const money = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";

export default function DiscountCalculator() {
  const [price, setPrice] = React.useState("100");
  const [discount, setDiscount] = React.useState("25");

  const p = Number(price) || 0;
  const d = Number(discount) || 0;
  const saved = (p * d) / 100;
  const final = p - saved;

  return (
    <ToolPanel className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Original price">
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
        <Field label="Discount %">
          <Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="You save" value={money(saved)} />
        <Stat label="Final price" value={money(final)} />
      </div>
    </ToolPanel>
  );
}
