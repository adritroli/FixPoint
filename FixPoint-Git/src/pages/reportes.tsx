import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ReportesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Reportes personalizables por proyecto, equipo o cliente.</p>
      </CardContent>
    </Card>
  );
}
