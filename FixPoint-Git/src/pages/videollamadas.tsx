import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DefaultLayout from "@/config/layout";

export default function VideollamadasPage() {
  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <CardTitle>Videollamadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Videollamadas y screen sharing integrados.</p>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
