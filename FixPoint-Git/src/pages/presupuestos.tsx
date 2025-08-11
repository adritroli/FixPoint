import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PresupuestosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presupuestos</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Presupuestos y costes asociados a proyectos.</p>
      </CardContent>
    </Card>
  );
}
