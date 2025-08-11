import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ExportarPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Exportación en PDF, Excel y API.</p>
      </CardContent>
    </Card>
  );
}
