import DefaultLayout from "@/config/layout";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Bell,
  ListTodo,
  AlertTriangle,
  BarChart3,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Notification = {
  id: number;
  message: string;
  date: string;
  read: boolean;
};
type Task = {
  id: number;
  title: string;
  status: "pendiente" | "en_progreso" | "completada";
  due: string;
};
type Gadget =
  | "notificaciones"
  | "tareas"
  | "progreso"
  | "alertas"
  | "estadisticas";

const ALL_GADGETS: { key: Gadget; label: string; icon: any }[] = [
  { key: "notificaciones", label: "Notificaciones", icon: Bell },
  { key: "tareas", label: "Mis Tareas", icon: ListTodo },
  { key: "progreso", label: "Progreso", icon: BarChart3 },
  { key: "alertas", label: "Alertas", icon: AlertTriangle },
  { key: "estadisticas", label: "Estadísticas", icon: BarChart3 },
];

export default function HomePage() {
  // Estado de gadgets seleccionados por el usuario
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [navOpen, setNavOpen] = useState(false);
  const [hovered, setHovered] = useState<Gadget | null>(null);
  const [search, setSearch] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  // Datos simulados
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState(0);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [stats, setStats] = useState({ completadas: 0, pendientes: 0 });

  // Obtener usuario logueado
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  // Cargar gadgets personalizados del backend al iniciar
  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/users/${user.id}/gadgets`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.gadgets)) {
          setGadgets(data.gadgets);
        } else {
          setGadgets(["notificaciones", "tareas", "progreso"]);
        }
      })
      .catch(() => setGadgets(["notificaciones", "tareas", "progreso"]));
  }, [user]);

  // Guardar gadgets personalizados en el backend al cambiar
  useEffect(() => {
    if (!user || gadgets.length === 0) return;
    fetch(`http://localhost:5000/api/users/${user.id}/gadgets`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gadgets }),
    });
  }, [gadgets, user]);

  // Simulación de fetch de datos
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        message: "Tienes una nueva tarea asignada",
        date: "2024-06-10",
        read: false,
      },
      {
        id: 2,
        message: "Reunión hoy a las 15:00",
        date: "2024-06-09",
        read: true,
      },
    ]);
    setTasks([
      {
        id: 1,
        title: "Completar reporte semanal",
        status: "pendiente",
        due: "2024-06-12",
      },
      {
        id: 2,
        title: "Revisar incidencias",
        status: "en_progreso",
        due: "2024-06-13",
      },
      {
        id: 3,
        title: "Actualizar perfil",
        status: "completada",
        due: "2024-06-08",
      },
    ]);
    setProgress(66);
    setAlerts(["Tu contraseña caduca en 5 días", "Tienes tareas atrasadas"]);
    setStats({ completadas: 5, pendientes: 2 });
  }, []);

  // Handler para cambiar gadgets activos
  const handleGadgetToggle = (key: Gadget) => {
    setGadgets((prev) =>
      prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key]
    );
  };

  // Miniatura de gadget
  const GadgetMini = ({ gadget }: { gadget: Gadget }) => {
    switch (gadget) {
      case "notificaciones":
        return (
          <div className="p-2 w-48 bg-background rounded shadow text-xs">
            <div className="flex items-center gap-1 mb-1">
              <Bell className="w-4 h-4" /> Notificaciones
            </div>
            <div className="text-muted-foreground">2 nuevas, 1 leída</div>
          </div>
        );
      case "tareas":
        return (
          <div className="p-2 w-48 bg-background rounded shadow text-xs">
            <div className="flex items-center gap-1 mb-1">
              <ListTodo className="w-4 h-4" /> Mis Tareas
            </div>
            <div className="text-muted-foreground">3 tareas, 1 completada</div>
          </div>
        );
      case "progreso":
        return (
          <div className="p-2 w-48 bg-background rounded shadow text-xs">
            <div className="flex items-center gap-1 mb-1">
              <BarChart3 className="w-4 h-4" /> Progreso
            </div>
            <div className="w-full bg-muted rounded h-2 mt-1">
              <div
                className="bg-primary h-2 rounded"
                style={{ width: "66%" }}
              />
            </div>
            <div className="text-muted-foreground mt-1">66% semanal</div>
          </div>
        );
      case "alertas":
        return (
          <div className="p-2 w-48 bg-background rounded shadow text-xs">
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-600" /> Alertas
            </div>
            <div className="text-red-600">2 alertas activas</div>
          </div>
        );
      case "estadisticas":
        return (
          <div className="p-2 w-48 bg-background rounded shadow text-xs">
            <div className="flex items-center gap-1 mb-1">
              <BarChart3 className="w-4 h-4" /> Estadísticas
            </div>
            <div className="text-muted-foreground">
              5 completadas, 2 pendientes
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full py-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Mi Tablero Ágil</h1>
          <div
            className="relative"
            onMouseEnter={() => setNavOpen(true)}
            onMouseLeave={() => {
              setNavOpen(false);
              setHovered(null);
            }}
          >
            <Button
              variant="outline"
              className="flex gap-2 items-center"
              aria-haspopup="menu"
            >
              <Settings2 className="w-5 h-5" />
              <span className="text-sm">Personalizar gadgets</span>
            </Button>
            {navOpen && (
              <div className="absolute right-0 z-50 mt-2 bg-popover border rounded shadow-lg min-w-[220px]">
                <div className="p-2">
                  <div className="font-semibold text-xs mb-2">
                    Selecciona gadgets:
                  </div>
                  {ALL_GADGETS.map((g) => (
                    <div
                      key={g.key}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-muted relative",
                        hovered === g.key && "bg-muted"
                      )}
                      onMouseEnter={() => setHovered(g.key)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handleGadgetToggle(g.key)}
                    >
                      <input
                        type="checkbox"
                        checked={gadgets.includes(g.key)}
                        readOnly
                        className="accent-primary"
                        aria-label={`Seleccionar gadget ${g.label}`}
                      />
                      <g.icon className="w-4 h-4" />
                      <span>{g.label}</span>
                      {/* Miniatura */}
                      {hovered === g.key && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 pointer-events-none">
                          <GadgetMini gadget={g.key} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gadgets.includes("notificaciones") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" /> Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 && (
                  <div>No tienes notificaciones.</div>
                )}
                <ul>
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={
                        n.read ? "text-muted-foreground" : "font-semibold"
                      }
                    >
                      {n.message}{" "}
                      <span className="text-xs text-gray-400">({n.date})</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {gadgets.includes("tareas") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5" /> Mis Tareas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 && <div>No tienes tareas asignadas.</div>}
                <ul>
                  {tasks.map((t) => (
                    <li
                      key={t.id}
                      className="flex justify-between items-center mb-1"
                    >
                      <span>
                        {t.title}{" "}
                        <span className="text-xs text-gray-400">({t.due})</span>
                      </span>
                      <span
                        className={
                          t.status === "completada"
                            ? "text-green-600"
                            : t.status === "en_progreso"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {t.status === "completada"
                          ? "Completada"
                          : t.status === "en_progreso"
                          ? "En progreso"
                          : "Pendiente"}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {gadgets.includes("progreso") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> Progreso semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">Progreso de tareas completadas:</div>
                <Progress value={progress} className="h-3" />
                <div className="text-xs mt-2">
                  {progress}% completado esta semana
                </div>
              </CardContent>
            </Card>
          )}
          {gadgets.includes("alertas") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" /> Alertas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 && <div>No hay alertas.</div>}
                <ul>
                  {alerts.map((a, i) => (
                    <li key={i} className="text-red-600">
                      {a}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {gadgets.includes("estadisticas") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> Estadísticas personales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-1">
                  Tareas completadas: <b>{stats.completadas}</b>
                </div>
                <div>
                  Tareas pendientes: <b>{stats.pendientes}</b>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
