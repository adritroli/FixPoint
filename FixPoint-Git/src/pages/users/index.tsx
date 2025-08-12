import * as React from "react";
import DefaultLayout from "@/config/layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Si tienes un componente Textarea de shadcn/ui, puedes importarlo aquí si lo necesitas para editar

type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: string;
  avatar?: string;
  created_at: string;
};

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | undefined>(undefined);
  const [view, setView] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal states
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState<User | null>(null);
  const [openEdit, setOpenEdit] = useState<User | null>(null);

  // Form states for create/edit
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch users from API
  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  // Filter and search
  useEffect(() => {
    let data = users;
    if (search) {
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.last_name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (role && role !== "all") {
      data = data.filter((u) => u.role === role);
    }
    setTotal(data.length);
    setFiltered(data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
  }, [users, search, role, page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleRole = (value: string) => {
    setRole(value === "all" ? undefined : value);
    setPage(1);
  };

  const handleView = (value: string) => {
    setView(value as "table" | "cards");
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Crear usuario
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsg("Usuario creado correctamente");
        setForm({
          name: "",
          last_name: "",
          email: "",
          password: "",
          role: "user",
        });
        setOpenCreate(false);
        // Refrescar usuarios
        fetch("/api/users")
          .then((r) => r.json())
          .then((data) => setUsers(data));
      } else {
        setMsg("Error al crear usuario");
      }
    } catch {
      setMsg("Error de red");
    }
    setLoading(false);
  };

  // Eliminar usuario
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Editar usuario (solo nombre, apellido, email, role)
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openEdit) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/users/${openEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsg("Usuario actualizado");
        setOpenEdit(null);
        // Refrescar usuarios
        fetch("/api/users")
          .then((r) => r.json())
          .then((data) => setUsers(data));
      } else {
        setMsg("Error al actualizar usuario");
      }
    } catch {
      setMsg("Error de red");
    }
    setLoading(false);
  };

  // Abrir modal de editar con datos del usuario
  const openEditModal = (user: User) => {
    setForm({
      name: user.name,
      last_name: user.last_name || "",
      email: user.email,
      password: "",
      role: user.role,
    });
    setOpenEdit(user);
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Usuarios</h1>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar por nombre, apellido o email"
                value={search}
                onChange={handleSearch}
                className="w-64"
              />
              <Select onValueChange={handleRole} defaultValue="all">
                <SelectTrigger className="w-40">
                  {role
                    ? role.charAt(0).toUpperCase() + role.slice(1)
                    : "Todos los roles"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Tabs value={view} onValueChange={handleView}>
              <TabsList>
                <TabsTrigger value="table">Tabla</TabsTrigger>
                <TabsTrigger value="cards">Tarjetas</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              onClick={() => setOpenCreate(true)}
              className="ml-2"
              variant="default"
            >
              <Plus className="w-4 h-4 mr-1" /> Nuevo usuario
            </Button>
          </div>
        </div>

        {/* Modal Crear Usuario */}
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
              <Input
                name="last_name"
                placeholder="Apellido"
                value={form.last_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, last_name: e.target.value }))
                }
                required
              />
              <Input
                name="email"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
              <Input
                name="password"
                placeholder="Contraseña"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                required
              />
              <Select
                value={form.role}
                onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}
              >
                <SelectTrigger>
                  {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
              {msg && <div className="text-sm text-red-500">{msg}</div>}
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creando..." : "Crear"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal Detalles */}
        <Dialog
          open={!!openDetail}
          onOpenChange={(v) => !v && setOpenDetail(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles del Usuario</DialogTitle>
            </DialogHeader>
            {openDetail && (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  {openDetail.avatar ? (
                    <img
                      src={openDetail.avatar}
                      alt={openDetail.name}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                      {openDetail.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-lg">
                      {openDetail.name} {openDetail.last_name}
                    </div>
                    <div className="text-sm">{openDetail.email}</div>
                  </div>
                </div>
                <div>Rol: {openDetail.role}</div>
                <div>
                  Creado: {new Date(openDetail.created_at).toLocaleDateString()}
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Editar */}
        <Dialog open={!!openEdit} onOpenChange={(v) => !v && setOpenEdit(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <Input
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
              <Input
                name="last_name"
                placeholder="Apellido"
                value={form.last_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, last_name: e.target.value }))
                }
                required
              />
              <Input
                name="email"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
              <Select
                value={form.role}
                onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}
              >
                <SelectTrigger>
                  {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
              {msg && <div className="text-sm text-red-500">{msg}</div>}
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {view === "table" ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No hay usuarios.
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {u.name} {u.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setOpenDetail(u)}
                          title="Detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditModal(u)}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(u.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <div className="flex justify-end p-4">
              <Pagination>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={page === 1}
                  />
                </PaginationItem>
                <span className="px-4 py-2">
                  {page} / {totalPages || 1}
                </span>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-disabled={page === totalPages || totalPages === 0}
                  />
                </PaginationItem>
              </Pagination>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  No hay usuarios.
                </CardContent>
              </Card>
            )}
            {filtered.map((u) => (
              <Card key={u.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <CardTitle>
                      {u.name} {u.last_name}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {u.email}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm mb-1">Rol: {u.role}</div>
                  <div className="text-xs text-muted-foreground">
                    Creado: {new Date(u.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setOpenDetail(u)}
                    title="Detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditModal(u)}
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(u.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
