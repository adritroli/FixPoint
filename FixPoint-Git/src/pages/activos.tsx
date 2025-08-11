import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ActivosPage() {
  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Gestión de activos (equipos, licencias, vehículos, etc.).</p>
        </CardContent>
      </Card>
    </div>
  );
}
