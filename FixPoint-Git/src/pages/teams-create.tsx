import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TeamCreatePage() {
  const [form, setForm] = useState({ name: "", logo: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsg("Equipo creado correctamente");
        setForm({ name: "", logo: "" });
      } else {
        setMsg("Error al crear equipo");
      }
    } catch {
      setMsg("Error de red");
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Equipo</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Input
            name="name"
            placeholder="Nombre del equipo"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="logo"
            placeholder="URL del logo (opcional)"
            value={form.logo}
            onChange={handleChange}
            style={{ marginTop: 12 }}
          />
          {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
