import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HistorialIncidenciasPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Incidencias</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Historial completo de cambios en cada incidencia.</p>
      </CardContent>
    </Card>
  );
}
