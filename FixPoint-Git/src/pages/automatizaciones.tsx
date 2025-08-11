import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AutomatizacionesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automatizaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Automatizaciones: si se cumple X condición → hacer Y acción.</p>
      </CardContent>
    </Card>
  );
}
