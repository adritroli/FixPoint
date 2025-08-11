import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function VistasPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vistas</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Vistas múltiples: tabla, lista, calendario, timeline.</p>
      </CardContent>
    </Card>
  );
}
