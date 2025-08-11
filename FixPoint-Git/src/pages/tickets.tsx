import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TicketsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Registro de tickets desde web, correo o chat.</p>
      </CardContent>
    </Card>
  );
}
