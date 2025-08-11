import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DocsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos Colaborativos</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Documentos colaborativos en tiempo real (tipo Google Docs).</p>
      </CardContent>
    </Card>
  );
}
