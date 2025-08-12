import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KanbanPage from "@/pages/kanban";
import SprintsPage from "@/pages/sprints";
import GanttPage from "@/pages/gantt";
import SubtareasPage from "@/pages/subtareas";
import AutomatizacionesPage from "@/pages/automatizaciones";
import PlantillasPage from "@/pages/plantillas";
import VistasPage from "@/pages/vistas";
import TicketsPage from "@/pages/tickets";
import ClasificacionIAPage from "@/pages/clasificacion-ia";
import IntegracionCodigoPage from "@/pages/integracion-codigo";
import WorkflowsPage from "@/pages/workflows";
import HistorialIncidenciasPage from "@/pages/historial-incidencias";
import SoportePage from "@/pages/soporte";
import EscaladoPage from "@/pages/escalado";
import ChatPage from "@/pages/chat";
import VideollamadasPage from "@/pages/videollamadas";
import ComentariosPage from "@/pages/comentarios";
import DocsPage from "@/pages/docs";
import WikiPage from "@/pages/wiki";
import NoticiasPage from "@/pages/noticias";
import RecursosPage from "@/pages/recursos";
import DisponibilidadPage from "@/pages/disponibilidad";
import CalendariosPage from "@/pages/calendarios";
import HitosPage from "@/pages/hitos";
import PresupuestosPage from "@/pages/presupuestos";
import ProveedoresPage from "@/pages/proveedores";
import ReportesPage from "@/pages/reportes";
import KPIsPage from "@/pages/kpis";
import DashboardPage from "@/pages/dashboard";
import ExportarPage from "@/pages/exportar";
import AnalisisIAPage from "@/pages/analisis-ia";
import HistorialReportesPage from "@/pages/historial-reportes";
import CrmPage from "@/pages/crm";
import ContratosPage from "@/pages/contratos";
import DocumentosPage from "@/pages/documentos";
import InventarioPage from "@/pages/inventario";
import RRHHPage from "@/pages/rrhh";
import ActivosPage from "@/pages/activos";
import LoginPage from "./pages/login/login";
import UsersPage from "./pages/users";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/sprints" element={<SprintsPage />} />
          <Route path="/gantt" element={<GanttPage />} />
          <Route path="/subtareas" element={<SubtareasPage />} />
          <Route path="/automatizaciones" element={<AutomatizacionesPage />} />
          <Route path="/plantillas" element={<PlantillasPage />} />
          <Route path="/vistas" element={<VistasPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/clasificacion-ia" element={<ClasificacionIAPage />} />
          <Route
            path="/integracion-codigo"
            element={<IntegracionCodigoPage />}
          />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route
            path="/historial-incidencias"
            element={<HistorialIncidenciasPage />}
          />
          <Route path="/soporte" element={<SoportePage />} />
          <Route path="/escalado" element={<EscaladoPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/videollamadas" element={<VideollamadasPage />} />
          <Route path="/comentarios" element={<ComentariosPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/wiki" element={<WikiPage />} />
          <Route path="/noticias" element={<NoticiasPage />} />
          <Route path="/recursos" element={<RecursosPage />} />
          <Route path="/disponibilidad" element={<DisponibilidadPage />} />
          <Route path="/calendarios" element={<CalendariosPage />} />
          <Route path="/hitos" element={<HitosPage />} />
          <Route path="/presupuestos" element={<PresupuestosPage />} />
          <Route path="/proveedores" element={<ProveedoresPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/kpis" element={<KPIsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/exportar" element={<ExportarPage />} />
          <Route path="/analisis-ia" element={<AnalisisIAPage />} />
          <Route
            path="/historial-reportes"
            element={<HistorialReportesPage />}
          />
          <Route path="/crm" element={<CrmPage />} />
          <Route path="/contratos" element={<ContratosPage />} />
          <Route path="/documentos" element={<DocumentosPage />} />
          <Route path="/inventario" element={<InventarioPage />} />
          <Route path="/rrhh" element={<RRHHPage />} />
          <Route path="/activos" element={<ActivosPage />} />
          {/* Puedes agregar una ruta por defecto o de error */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
