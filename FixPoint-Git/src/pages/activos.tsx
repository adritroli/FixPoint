import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DefaultLayout from "@/config/layout";

export default function ActivosPage() {
  return (
    <div className="">
      <DefaultLayout>
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gestión de activos (equipos, licencias, vehículos, etc.).</p>
          </CardContent>
        </Card>
      </DefaultLayout>
    </div>
  );
}
