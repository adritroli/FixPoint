import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DisponibilidadPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disponibilidad</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Control de disponibilidad y carga de trabajo por usuario.</p>
      </CardContent>
    </Card>
  );
}
