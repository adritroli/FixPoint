import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function WikiPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wiki Interna</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Wiki interna para manuales, políticas y documentación.</p>
      </CardContent>
    </Card>
  );
}
