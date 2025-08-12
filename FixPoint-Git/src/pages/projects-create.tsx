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
import { Textarea } from "@/components/ui/textarea";

export default function ProjectCreatePage() {
  const [form, setForm] = useState({ name: "", description: "", team_id: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsg("Proyecto creado correctamente");
        setForm({ name: "", description: "", team_id: "" });
      } else {
        setMsg("Error al crear proyecto");
      }
    } catch {
      setMsg("Error de red");
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Proyecto</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Input
            name="name"
            placeholder="Nombre del proyecto"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            style={{ marginTop: 12 }}
          />
          <Input
            name="team_id"
            placeholder="ID del equipo"
            value={form.team_id}
            onChange={handleChange}
            required
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
