import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function IntegracionCodigoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integración Código</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Gestión de bugs con integración a repositorios de código (GitHub,
          GitLab, Bitbucket).
        </p>
      </CardContent>
    </Card>
  );
}
