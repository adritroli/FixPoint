import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ClasificacionIAPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clasificación IA</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Clasificación automática de incidencias por IA (tipo, urgencia, área
          responsable).
        </p>
      </CardContent>
    </Card>
  );
}
