import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ComentariosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comentarios</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Comentarios con @menciones y reacciones.</p>
      </CardContent>
    </Card>
  );
}
