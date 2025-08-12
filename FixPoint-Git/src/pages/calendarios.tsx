import DefaultLayout from "@/config/layout";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CalendariosPage() {
  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <CardTitle>Calendarios</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Calendarios sincronizados con Google, Outlook, etc.</p>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
