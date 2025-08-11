import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function KanbanPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kanban</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Tablero Kanban avanzado con WIP limits, swimlanes y automatizaciones.
        </p>
      </CardContent>
    </Card>
  );
}
