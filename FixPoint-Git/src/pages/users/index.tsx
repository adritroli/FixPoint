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
import { BsFillPersonVcardFill } from "react-icons/bs";
import { MdTableRows } from "react-icons/md";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
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
  is_logged_in: number;
  last_login_at: string | null;
  last_logout_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  deleted_at: string | null;
  emp_codigo: number;
  phone?: string;
  address?: string;
  status?: "activo" | "inactivo";
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
  const [empCodigo, setEmpCodigo] = useState<string | null>(() => {
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        return null;
      }
    })();
    return user?.emp_codigo || localStorage.getItem("emp_codigo") || null;
  });

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
    phone: "",
    address: "",
    status: "activo" as "activo" | "inactivo",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const navigate = useNavigate();

  // Fetch users from API (filtrado por emp_codigo si existe)
  useEffect(() => {
    let url = "http://localhost:5000/api/users";
    if (empCodigo) url += `?emp_codigo=${empCodigo}`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Error al obtener usuarios");
        return r.json();
      })
      .then((data) => {
        console.log("Usuarios recibidos:", data);
        setUsers(data);
        // Si empCodigo no está en localStorage pero viene en los datos, lo guardamos
        if (!empCodigo && data.length > 0 && data[0].emp_codigo) {
          localStorage.setItem("emp_codigo", data[0].emp_codigo);
          setEmpCodigo(data[0].emp_codigo);
          console.log("empCodigo recuperado y guardado:", data[0].emp_codigo);
        }
      })
      .catch((err) => {
        console.error("Error en fetch usuarios:", err);
        setUsers([]);
      });
  }, [empCodigo]);

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

  // Tomar foto con cámara
  const handleStartCamera = async () => {
    setCameraActive(true);
    if (navigator.mediaDevices?.getUserMedia && videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 160, 160);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `avatar_${Date.now()}.png`, {
              type: "image/png",
            });
            setAvatarFile(file);
            setCameraActive(false);
            // Detener cámara
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach((track) => track.stop());
          }
        }, "image/png");
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Crear usuario (con avatar)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    console.log("empCodigo usado para crear usuario:", empCodigo);

    if (!empCodigo) {
      setMsg(
        "No se encontró el código de empresa. Reloguea o contacta al admin."
      );
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("last_name", form.last_name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("status", form.status);
      formData.append("emp_codigo", empCodigo);
      formData.append("created_by", "1"); // Ajusta según usuario logueado
      if (avatarFile) formData.append("avatar", avatarFile);

      // Log para ver el contenido de formData
      for (let [key, value] of formData.entries()) {
        console.log("formData:", key, value);
      }

      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setMsg("Usuario creado correctamente");
        setForm({
          name: "",
          last_name: "",
          email: "",
          password: "",
          role: "user",
          phone: "",
          address: "",
          status: "activo",
        });
        setAvatarFile(null);
        setOpenCreate(false);
        fetch(`http://localhost:5000/api/users?emp_codigo=${empCodigo}`)
          .then((r) => r.json())
          .then((data) => setUsers(data));
      } else {
        const errorText = await res.text();
        setMsg("Error al crear usuario: " + errorText);
        console.error("Error al crear usuario:", errorText);
      }
    } catch (err) {
      setMsg("Error de red");
      console.error("Error de red:", err);
    }
    setLoading(false);
  };

  // Eliminar usuario
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Editar usuario (incluye campos nuevos)
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openEdit) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${openEdit.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (res.ok) {
        setMsg("Usuario actualizado");
        setOpenEdit(null);
        fetch(`http://localhost:5000/api/users?emp_codigo=${empCodigo}`)
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
      phone: user.phone || "",
      address: user.address || "",
      status: user.status || "activo",
    });
    setOpenEdit(user);
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6  mx-auto w-full">
        {/* Elimina el selector de empresa */}
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
                <TabsTrigger value="table">
                  <MdTableRows />
                </TabsTrigger>
                <TabsTrigger value="cards">
                  <BsFillPersonVcardFill />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              onClick={() => setOpenCreate(true)}
              className="ml-2"
              variant="default"
            >
              <Plus className="w-4 h-4 mr-1" /> Add User
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
              <Input
                name="phone"
                placeholder="Teléfono"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                required
              />
              <Input
                name="address"
                placeholder="Dirección"
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
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
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as "activo" | "inactivo" }))
                }
              >
                <SelectTrigger>
                  {form.status === "activo" ? "Activo" : "Inactivo"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              {/* Avatar uploader */}
              <div>
                <label className="block font-medium mb-1">Avatar</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleStartCamera}
                    disabled={cameraActive}
                  >
                    Tomar foto
                  </Button>
                </div>
                {avatarFile && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(avatarFile)}
                      alt="avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                )}
                {cameraActive && (
                  <div className="mt-2 flex flex-col items-center">
                    <video
                      ref={videoRef}
                      width={160}
                      height={160}
                      autoPlay
                      className="rounded"
                    />
                    <canvas
                      ref={canvasRef}
                      width={160}
                      height={160}
                      style={{ display: "none" }}
                    />
                    <Button
                      type="button"
                      className="mt-2"
                      onClick={handleTakePhoto}
                    >
                      Capturar foto
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setCameraActive(false);
                        const stream = videoRef.current
                          ?.srcObject as MediaStream;
                        stream?.getTracks().forEach((track) => track.stop());
                      }}
                    >
                      Cancelar cámara
                    </Button>
                  </div>
                )}
              </div>
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
                <div>Teléfono: {openDetail.phone || "-"}</div>
                <div>Dirección: {openDetail.address || "-"}</div>
                <div>
                  Estado:{" "}
                  {openDetail.status === "activo" ? (
                    <span className="text-green-600 font-semibold">Activo</span>
                  ) : (
                    <span className="text-gray-500">Inactivo</span>
                  )}
                </div>
                <div>
                  Estado de sesión:{" "}
                  {openDetail.is_logged_in ? (
                    <span className="text-green-600 font-semibold">Online</span>
                  ) : (
                    <span className="text-gray-500">Offline</span>
                  )}
                </div>
                <div>
                  Última conexión:{" "}
                  {openDetail.last_login_at
                    ? new Date(openDetail.last_login_at).toLocaleString()
                    : "-"}
                </div>
                <div>
                  Última desconexión:{" "}
                  {openDetail.last_logout_at
                    ? new Date(openDetail.last_logout_at).toLocaleString()
                    : "-"}
                </div>
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
              <Input
                name="phone"
                placeholder="Teléfono"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                required
              />
              <Input
                name="address"
                placeholder="Dirección"
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
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
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as "activo" | "inactivo" }))
                }
              >
                <SelectTrigger>
                  {form.status === "activo" ? "Activo" : "Inactivo"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
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
                    <TableHead>Empresa</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Últ. Login</TableHead>
                    <TableHead>Últ. Logout</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
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
                      <TableCell>{u.emp_codigo}</TableCell>
                      <TableCell>
                        {u.is_logged_in ? (
                          <span className="text-green-600 font-semibold">
                            Online
                          </span>
                        ) : (
                          <span className="text-gray-500">Offline</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {u.last_login_at
                          ? new Date(u.last_login_at).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {u.last_logout_at
                          ? new Date(u.last_logout_at).toLocaleString()
                          : "-"}
                      </TableCell>
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
                    <div className="text-xs text-muted-foreground">
                      Empresa: {u.emp_codigo}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm mb-1">Rol: {u.role}</div>
                  <div className="text-xs text-muted-foreground">
                    Estado:{" "}
                    {u.is_logged_in ? (
                      <span className="text-green-600 font-semibold">
                        Online
                      </span>
                    ) : (
                      <span className="text-gray-500">Offline</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Últ. Login:{" "}
                    {u.last_login_at
                      ? new Date(u.last_login_at).toLocaleString()
                      : "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Últ. Logout:{" "}
                    {u.last_logout_at
                      ? new Date(u.last_logout_at).toLocaleString()
                      : "-"}
                  </div>
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
