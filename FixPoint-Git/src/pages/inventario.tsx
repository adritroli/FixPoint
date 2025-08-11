import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function InventarioPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventario</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Control de inventario y logística.</p>
      </CardContent>
    </Card>
  );
}
