import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DefaultLayout from "@/config/layout";

export default function AnalisisIAPage() {
  return (
    <DefaultLayout>
      <Card>
        <CardHeader>
          <CardTitle>Análisis IA</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Análisis predictivo por IA para anticipar retrasos y riesgos.</p>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
