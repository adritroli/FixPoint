import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DocumentosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión Documental</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Gestión documental (archivos, permisos, versiones).</p>
      </CardContent>
    </Card>
  );
}
