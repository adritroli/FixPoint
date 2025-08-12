import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DefaultLayout from "@/config/layout";

export default function TicketsPage() {
  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Registro de tickets desde web, correo o chat.</p>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
