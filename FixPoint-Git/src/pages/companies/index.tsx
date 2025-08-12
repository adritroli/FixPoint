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
  Pagination,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

type Company = {
  id: number;
  emp_codigo: string;
  is_owner: number;
  owner_name: string;
  company_name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  status: "activa" | "inactiva" | "en_proceso";
  created_at: string;
  user_count?: number;
};

const PAGE_SIZE = 10;

export default function CompaniesPage() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [filtered, setFiltered] = React.useState<Company[]>([]);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  // Modal states
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openDetail, setOpenDetail] = React.useState<Company | null>(null);

  // Form state for create
  const [form, setForm] = React.useState({
    owner_name: "",
    company_name: "",
    country: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    status: "en_proceso" as "activa" | "inactiva" | "en_proceso",
  });
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch companies from API
  React.useEffect(() => {
    fetch("http://localhost:5000/api/companies")
      .then((r) => r.json())
      .then(async (data: Company[]) => {
        // Para cada empresa, obtener la cantidad de usuarios
        const companiesWithUsers = await Promise.all(
          data.map(async (c) => {
            const res = await fetch(
              `http://localhost:5000/api/users/count?company_id=${c.id}`
            );
            const { count } = await res.json();
            return { ...c, user_count: count };
          })
        );
        setCompanies(companiesWithUsers);
      });
  }, []);

  // Filter and search
  React.useEffect(() => {
    let data = companies;
    if (search) {
      data = data.filter(
        (c) =>
          c.company_name.toLowerCase().includes(search.toLowerCase()) ||
          c.owner_name.toLowerCase().includes(search.toLowerCase()) ||
          c.city.toLowerCase().includes(search.toLowerCase()) ||
          c.country.toLowerCase().includes(search.toLowerCase())
      );
    }
    setTotal(data.length);
    setFiltered(data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
  }, [companies, search, page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Crear empresa
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("http://localhost:5000/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsg("Empresa creada correctamente");
        setForm({
          owner_name: "",
          company_name: "",
          country: "",
          city: "",
          address: "",
          phone: "",
          email: "",
          status: "en_proceso",
        });
        setOpenCreate(false);
        fetch("http://localhost:5000/api/companies")
          .then((r) => r.json())
          .then((data) => setCompanies(data));
      } else {
        setMsg("Error al crear empresa");
      }
    } catch {
      setMsg("Error de red");
    }
    setLoading(false);
  };

  // Cambiar estado de empresa desde la tabla
  const handleStatusChange = async (id: number, status: Company["status"]) => {
    await fetch(`http://localhost:5000/api/companies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Empresas</h1>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar por empresa, titular, ciudad o país"
                value={search}
                onChange={handleSearch}
                className="w-64"
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setOpenCreate(true)}
              className="ml-2"
              variant="default"
            >
              <Plus className="w-4 h-4 mr-1" /> Nueva empresa
            </Button>
          </div>
        </div>

        {/* Modal Crear Empresa */}
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Empresa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                name="owner_name"
                placeholder="Nombre del titular"
                value={form.owner_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, owner_name: e.target.value }))
                }
                required
              />
              <Input
                name="company_name"
                placeholder="Nombre de la empresa"
                value={form.company_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, company_name: e.target.value }))
                }
                required
              />
              <Input
                name="country"
                placeholder="País"
                value={form.country}
                onChange={(e) =>
                  setForm((f) => ({ ...f, country: e.target.value }))
                }
                required
              />
              <Input
                name="city"
                placeholder="Localidad/Ciudad"
                value={form.city}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
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
                name="email"
                placeholder="Email de contacto"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as Company["status"] }))
                }
              >
                <SelectTrigger>
                  {form.status === "activa"
                    ? "Activa"
                    : form.status === "inactiva"
                    ? "Inactiva"
                    : "En proceso"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="inactiva">Inactiva</SelectItem>
                  <SelectItem value="en_proceso">En proceso</SelectItem>
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

        {/* Tabla de empresas */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Dueña</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Titular</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Usuarios</TableHead>
                  <TableHead>Creada</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center">
                      No hay empresas.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.emp_codigo}</TableCell>
                    <TableCell>
                      {c.is_owner ? (
                        <span className="text-green-600 font-semibold">Sí</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </TableCell>
                    <TableCell>{c.company_name}</TableCell>
                    <TableCell>{c.owner_name}</TableCell>
                    <TableCell>{c.country}</TableCell>
                    <TableCell>{c.city}</TableCell>
                    <TableCell>{c.address}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>
                      <Select
                        value={c.status}
                        onValueChange={(v) =>
                          handleStatusChange(c.id, v as Company["status"])
                        }
                      >
                        <SelectTrigger className="w-28">
                          {c.status === "activa"
                            ? "Activa"
                            : c.status === "inactiva"
                            ? "Inactiva"
                            : "En proceso"}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activa">Activa</SelectItem>
                          <SelectItem value="inactiva">Inactiva</SelectItem>
                          <SelectItem value="en_proceso">En proceso</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/users?company_id=${c.id}`)}
                      >
                        {c.user_count ?? 0}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {new Date(c.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setOpenDetail(c)}
                        title="Detalles"
                      >
                        <Eye className="w-4 h-4" />
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

        {/* Modal Detalles */}
        <Dialog
          open={!!openDetail}
          onOpenChange={(v) => !v && setOpenDetail(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles de la Empresa</DialogTitle>
            </DialogHeader>
            {openDetail && (
              <div className="space-y-2">
                <div>
                  <b>Código:</b> {openDetail.emp_codigo}
                </div>
                <div>
                  <b>Dueña:</b>{" "}
                  {openDetail.is_owner ? (
                    <span className="text-green-600 font-semibold">Sí</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </div>
                <div>
                  <b>Empresa:</b> {openDetail.company_name}
                </div>
                <div>
                  <b>Titular:</b> {openDetail.owner_name}
                </div>
                <div>
                  <b>País:</b> {openDetail.country}
                </div>
                <div>
                  <b>Ciudad:</b> {openDetail.city}
                </div>
                <div>
                  <b>Dirección:</b> {openDetail.address}
                </div>
                <div>
                  <b>Teléfono:</b> {openDetail.phone}
                </div>
                <div>
                  <b>Email:</b> {openDetail.email}
                </div>
                <div>
                  <b>Estado:</b>{" "}
                  {openDetail.status === "activa"
                    ? "Activa"
                    : openDetail.status === "inactiva"
                    ? "Inactiva"
                    : "En proceso"}
                </div>
                <div>
                  <b>Creada:</b>{" "}
                  {new Date(openDetail.created_at).toLocaleDateString()}
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
      </div>
    </DefaultLayout>
  );
}
