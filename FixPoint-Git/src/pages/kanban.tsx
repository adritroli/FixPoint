import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DefaultLayout from "@/config/layout";

export default function KanbanPage() {
  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <CardTitle>Kanban</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Tablero Kanban avanzado con WIP limits, swimlanes y
            automatizaciones.
          </p>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
