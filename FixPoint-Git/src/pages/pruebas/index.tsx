import DefaultLayout from "@/config/layout";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ListTodo, BarChart3, AlertTriangle } from "lucide-react";

type GadgetType = "notificaciones" | "tareas" | "progreso" | "alertas";
const GADGETS = [
  { key: "notificaciones", label: "Notificaciones", icon: Bell },
  { key: "tareas", label: "Mis Tareas", icon: ListTodo },
  { key: "progreso", label: "Progreso", icon: BarChart3 },
  { key: "alertas", label: "Alertas", icon: AlertTriangle },
];

type Section = {
  id: number;
  gadget: GadgetType | null;
  size: number; // porcentaje del ancho (horizontal) o alto (vertical)
};

export default function PruebasPage() {
  const [sections, setSections] = useState<Section[]>([
    { id: 1, gadget: null, size: 100 },
  ]);

  // Divide una sección en dos (horizontalmente)
  const splitSection = (id: number) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const section = prev[idx];
      const newId = Math.max(...prev.map((s) => s.id)) + 1;
      const half = section.size / 2;
      const updated = [
        ...prev.slice(0, idx),
        { ...section, size: half },
        { id: newId, gadget: null, size: half },
        ...prev.slice(idx + 1),
      ];
      return updated;
    });
  };

  // Cambia el gadget de una sección
  const setGadget = (id: number, gadget: GadgetType) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, gadget } : s))
    );
  };

  // Renderiza el gadget seleccionado
  const renderGadget = (gadget: GadgetType | null) => {
    if (!gadget)
      return (
        <div className="text-muted-foreground text-center">
          Selecciona un gadget
        </div>
      );
    switch (gadget) {
      case "notificaciones":
        return (
          <div>
            <div className="font-semibold mb-2">Notificaciones</div>
            <ul>
              <li>Notificación 1</li>
              <li>Notificación 2</li>
            </ul>
          </div>
        );
      case "tareas":
        return (
          <div>
            <div className="font-semibold mb-2">Mis Tareas</div>
            <ul>
              <li>Tarea pendiente</li>
              <li>Tarea completada</li>
            </ul>
          </div>
        );
      case "progreso":
        return (
          <div>
            <div className="font-semibold mb-2">Progreso</div>
            <div className="w-full bg-muted rounded h-2 mt-1">
              <div
                className="bg-primary h-2 rounded"
                style={{ width: "60%" }}
              />
            </div>
            <div className="text-xs mt-1">60% completado</div>
          </div>
        );
      case "alertas":
        return (
          <div>
            <div className="font-semibold mb-2">Alertas</div>
            <ul>
              <li className="text-red-600">Alerta importante</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  // Permite arrastrar el borde para redimensionar (solo horizontal para demo)
  const handleResize = (idx: number, delta: number) => {
    setSections((prev) => {
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const left = prev[idx];
      const right = prev[idx + 1];
      const total = left.size + right.size;
      let newLeft = left.size + delta;
      let newRight = right.size - delta;
      // Limita el tamaño mínimo
      if (newLeft < 10) {
        newRight -= 10 - newLeft;
        newLeft = 10;
      }
      if (newRight < 10) {
        newLeft -= 10 - newRight;
        newRight = 10;
      }
      return prev.map((s, i) =>
        i === idx
          ? { ...s, size: newLeft }
          : i === idx + 1
          ? { ...s, size: newRight }
          : s
      );
    });
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4 min-h-svh items-center justify-center">
        <h1 className="text-3xl font-bold mb-2">
          Pruebas: Dividir y Personalizar Secciones
        </h1>
        <div className="flex w-full max-w-5xl h-[400px] border rounded overflow-hidden bg-muted">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              style={{ width: `${section.size}%` }}
              className="relative h-full flex flex-col items-stretch transition-all"
            >
              <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <CardTitle className="text-base flex-1">
                    {section.gadget
                      ? GADGETS.find((g) => g.key === section.gadget)?.label
                      : "Sin gadget"}
                  </CardTitle>
                  <select
                    className="border rounded px-1 py-0.5 text-xs"
                    value={section.gadget || ""}
                    onChange={(e) =>
                      setGadget(section.id, e.target.value as GadgetType)
                    }
                  >
                    <option value="">Seleccionar gadget</option>
                    {GADGETS.map((g) => (
                      <option key={g.key} value={g.key}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2"
                    onClick={() => splitSection(section.id)}
                    title="Dividir sección"
                  >
                    ⬍
                  </Button>
                </CardHeader>
                <CardContent className="flex-1">
                  {renderGadget(section.gadget)}
                </CardContent>
              </Card>
              {/* Handler de resize */}
              {idx < sections.length - 1 && (
                <div
                  className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-10"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const startX = e.clientX;
                    const startSizes = sections.map((s) => s.size);
                    const handleMouseMove = (ev: MouseEvent) => {
                      const dx = ev.clientX - startX;
                      // El ancho total del contenedor
                      const container = (e.target as HTMLElement).parentElement
                        ?.parentElement;
                      const totalPx = container?.clientWidth || 800;
                      const deltaPercent = (dx / totalPx) * 100;
                      handleResize(idx, deltaPercent);
                    };
                    const handleMouseUp = () => {
                      window.removeEventListener("mousemove", handleMouseMove);
                      window.removeEventListener("mouseup", handleMouseUp);
                    };
                    window.addEventListener("mousemove", handleMouseMove);
                    window.addEventListener("mouseup", handleMouseUp);
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Arrastra el borde entre secciones para redimensionar. Haz clic en ⬍
          para dividir una sección.
        </div>
      </div>
    </DefaultLayout>
  );
}
