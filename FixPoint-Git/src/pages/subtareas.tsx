import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SubtareasPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subtareas & Dependencias</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Gestión de subtareas y dependencias entre tareas.</p>
      </CardContent>
    </Card>
  );
}
