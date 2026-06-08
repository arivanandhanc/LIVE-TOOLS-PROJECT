"use client";

import { Transformer } from "@/components/tools/transformer";
import { formatSql } from "@/lib/format";

export default function SqlFormatter() {
  return (
    <Transformer
      inputLabel="SQL"
      outputLabel="Formatted"
      inputPlaceholder="select * from users where active = 1"
      downloadName="query.sql"
      downloadMime="text/plain"
      sampleInput={"select id, name, email from users u join orders o on o.user_id = u.id where u.active = 1 order by name"}
      actions={[{ label: "Format SQL", run: formatSql }]}
    />
  );
}
