import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CrmPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CRM</CardTitle>
      </CardHeader>
      <CardContent>
        <p>CRM integrado (seguimiento de clientes y leads).</p>
      </CardContent>
    </Card>
  );
}
