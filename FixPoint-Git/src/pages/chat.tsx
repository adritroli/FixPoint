import DefaultLayout from "@/config/layout";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ChatPage() {
  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <CardTitle>Chat Interno</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chat interno tipo Slack/Teams (canales por equipo/proyecto).</p>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
