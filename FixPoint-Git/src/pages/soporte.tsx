import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SoportePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Soporte al Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Integración con soporte al cliente (chat en vivo, bots, correo).</p>
      </CardContent>
    </Card>
  );
}
