import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SprintsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sprints & Scrum</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Gestión de sprints, planificación, retrospectivas y burndown charts.
        </p>
      </CardContent>
    </Card>
  );
}
