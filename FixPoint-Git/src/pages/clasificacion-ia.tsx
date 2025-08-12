import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DefaultLayout from "@/config/layout";

export default function ClasificacionIAPage() {
  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <CardTitle>Clasificación IA</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Clasificación automática de incidencias por IA (tipo, urgencia, área
            responsable).
          </p>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
