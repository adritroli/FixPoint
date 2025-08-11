import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function KPIsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>KPIs & Métricas</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          KPI y métricas clave (velocidad de equipo, tiempo de resolución,
          costos).
        </p>
      </CardContent>
    </Card>
  );
}
