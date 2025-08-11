import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NoticiasPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Noticias Internas</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Noticias internas para anuncios de la empresa.</p>
      </CardContent>
    </Card>
  );
}
