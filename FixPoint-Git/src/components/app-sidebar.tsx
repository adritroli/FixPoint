import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  KanbanSquare,
  Bug,
  Users,
  CalendarDays,
  BarChart3,
  Building2,
  MessageCircle,
  FileText,
  FileStack,
  UserCog,
  DollarSign,
  Briefcase,
  FileCheck2,
  FileSearch2,
  FilePieChart,
  FileSpreadsheet,
  FileSignature,
  FileClock,
  FileBarChart2,
  FileCog,
  FileInput,
  FileOutput,
  FileQuestion,
  FileWarning,
  FileX2,
  FilePlus2,
  FileMinus2,
  FileEdit,
  FileLock,
  FileUp,
  FileDown,
  CircleArrowUp,
  ArrowDown,
  FileArchive,
  FileAudio2,
  FileVideo2,
  FileImage,
  FileCode2,
  FileDiff,
  FileSymlink,
  FileTerminal,
  FileType,
  FileText as FileTextIcon,
  FileSearch,
  FileHeart,
  FileCheck,
  FileClock as FileClockIcon,
  FileBarChart,
  FileCog as FileCogIcon,
  FileInput as FileInputIcon,
  FileOutput as FileOutputIcon,
  FileQuestion as FileQuestionIcon,
  FileWarning as FileWarningIcon,
  FileX as FileXIcon,
  FilePlus as FilePlusIcon,
  FileMinus as FileMinusIcon,
  FileEdit as FileEditIcon,
  FileLock as FileLockIcon,
  FileLock as FileUnlockIcon,
  FileUp as FileUpIcon,
  FileDown as FileDownIcon,
  CircleArrowUp as FileArrowUpIcon,
  ArrowDown as FileArrowDownIcon,
  FileArchive as FileArchiveIcon,
  FileAudio as FileAudioIcon,
  FileVideo as FileVideoIcon,
  FileImage as FileImageIcon,
  FileCode as FileCodeIcon,
  FileDiff as FileDiffIcon,
  FileSymlink as FileSymlinkIcon,
  FileTerminal as FileTerminalIcon,
  FileType as FileTypeIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "DESARROLLO",
      url: "#",
      icon: KanbanSquare,
      isActive: true,
      items: [
        { title: "Home", url: "/home" },
        { title: "Users Manager", url: "/users" },
        { title: "Pruebas", url: "/pruebas" },
        { title: "Enterprise", url: "/companies" },
      ],
    },
    {
      title: "Gestión de Proyectos",
      url: "#",
      icon: KanbanSquare,
      isActive: false,
      items: [
        { title: "Kanban", url: "/kanban" },
        { title: "Sprints & Scrum", url: "/sprints" },
        { title: "Gantt", url: "/gantt" },
        { title: "Subtareas & Dependencias", url: "/subtareas" },
        { title: "Automatizaciones", url: "/automatizaciones" },
        { title: "Plantillas", url: "/plantillas" },
        { title: "Vistas", url: "/vistas" },
      ],
    },
    {
      title: "Incidencias & Bugs",
      url: "#",
      icon: Bug,
      items: [
        { title: "Tickets", url: "/tickets" },
        { title: "Clasificación IA", url: "/clasificacion-ia" },
        { title: "Integración Código", url: "/integracion-codigo" },
        { title: "Workflows", url: "/workflows" },
        { title: "Historial", url: "/historial-incidencias" },
        { title: "Soporte Cliente", url: "/soporte" },
        { title: "Escalado", url: "/escalado" },
      ],
    },
    {
      title: "Colaboración",
      url: "#",
      icon: MessageCircle,
      items: [
        { title: "Chat Interno", url: "/chat" },
        { title: "Videollamadas", url: "/videollamadas" },
        { title: "Comentarios", url: "/comentarios" },
        { title: "Docs Colaborativos", url: "/docs" },
        { title: "Wiki", url: "/wiki" },
        { title: "Noticias", url: "/noticias" },
      ],
    },
    {
      title: "Planificación & Recursos",
      url: "#",
      icon: CalendarDays,
      items: [
        { title: "Recursos", url: "/recursos" },
        { title: "Disponibilidad", url: "/disponibilidad" },
        { title: "Calendarios", url: "/calendarios" },
        { title: "Hitos & Eventos", url: "/hitos" },
        { title: "Presupuestos", url: "/presupuestos" },
        { title: "Proveedores", url: "/proveedores" },
      ],
    },
    {
      title: "Reportes & Analítica",
      url: "#",
      icon: BarChart3,
      items: [
        { title: "Reportes", url: "/reportes" },
        { title: "KPIs & Métricas", url: "/kpis" },
        { title: "Dashboard", url: "/dashboard" },
        { title: "Exportar", url: "/exportar" },
        { title: "Análisis IA", url: "/analisis-ia" },
        { title: "Historial", url: "/historial-reportes" },
      ],
    },
    {
      title: "Gestión Empresarial",
      url: "#",
      icon: Building2,
      items: [
        { title: "CRM", url: "/crm" },
        { title: "Contratos & Facturación", url: "/contratos" },
        { title: "Documentos", url: "/documentos" },
        { title: "Inventario", url: "/inventario" },
        { title: "RRHH", url: "/rrhh" },
        { title: "Activos", url: "/activos" },
      ],
    },
    // ...puedes agregar más módulos aquí si es necesario...
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
