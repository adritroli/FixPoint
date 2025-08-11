import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HistorialReportesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Reportes</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Historial y comparativa de rendimiento a lo largo del tiempo.</p>
      </CardContent>
    </Card>
  );
}
