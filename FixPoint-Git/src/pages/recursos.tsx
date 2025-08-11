import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RecursosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recursos</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Asignación de recursos (personas, equipos, máquinas).</p>
      </CardContent>
    </Card>
  );
}
