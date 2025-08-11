import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function GanttPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gantt</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Vista de proyectos en cascada (Gantt) para metodologías tradicionales.
        </p>
      </CardContent>
    </Card>
  );
}
