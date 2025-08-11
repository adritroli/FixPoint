import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EscaladoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escalado</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Escalado automático según tiempos o prioridad.</p>
      </CardContent>
    </Card>
  );
}
