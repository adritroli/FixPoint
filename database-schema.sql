-- Usuarios y equipos
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    role ENUM(
        'admin',
        'manager',
        'user',
        'guest'
    ) DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    plan VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('owner', 'admin', 'member') DEFAULT 'member',
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Proyectos
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    status ENUM(
        'active',
        'archived',
        'completed'
    ) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE SET NULL
);

-- Tareas y Kanban
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    parent_task_id INT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    status ENUM(
        'todo',
        'in_progress',
        'done',
        'blocked'
    ) DEFAULT 'todo',
    priority ENUM(
        'low',
        'medium',
        'high',
        'urgent'
    ) DEFAULT 'medium',
    due_date DATE,
    wip_limit INT,
    swimlane VARCHAR(50),
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    FOREIGN KEY (parent_task_id) REFERENCES tasks (id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE task_assignees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE task_labels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20)
);

CREATE TABLE task_label_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    label_id INT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES task_labels (id) ON DELETE CASCADE
);

-- Sprints y Scrum
CREATE TABLE sprints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    goal TEXT,
    status ENUM(
        'planned',
        'active',
        'completed',
        'retrospective'
    ) DEFAULT 'planned',
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

CREATE TABLE sprint_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sprint_id INT NOT NULL,
    task_id INT NOT NULL,
    FOREIGN KEY (sprint_id) REFERENCES sprints (id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);

-- Gantt (timeline de tareas)
-- Las tareas ya tienen start_date y due_date

-- Incidencias / Tickets
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    created_by INT,
    assigned_to INT,
    type ENUM(
        'bug',
        'feature',
        'support',
        'other'
    ) DEFAULT 'other',
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status ENUM(
        'open',
        'in_progress',
        'resolved',
        'closed',
        'escalated'
    ) DEFAULT 'open',
    priority ENUM(
        'low',
        'medium',
        'high',
        'urgent'
    ) DEFAULT 'medium',
    sla_hours INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE ticket_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE ticket_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    performed_by INT,
    performed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users (id) ON DELETE SET NULL
);

-- Workflows de incidencias
CREATE TABLE workflows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE workflow_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id INT NOT NULL,
    step_order INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    action VARCHAR(100),
    FOREIGN KEY (workflow_id) REFERENCES workflows (id) ON DELETE CASCADE
);

CREATE TABLE ticket_workflow (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    workflow_id INT NOT NULL,
    current_step INT,
    FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE,
    FOREIGN KEY (workflow_id) REFERENCES workflows (id) ON DELETE CASCADE,
    FOREIGN KEY (current_step) REFERENCES workflow_steps (id) ON DELETE SET NULL
);

-- Chat y comunicación
CREATE TABLE channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    name VARCHAR(100) NOT NULL,
    type ENUM(
        'public',
        'private',
        'project'
    ) DEFAULT 'public',
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE SET NULL
);

CREATE TABLE channel_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    channel_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (channel_id) REFERENCES channels (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    channel_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Documentos colaborativos y wiki
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    name VARCHAR(150) NOT NULL,
    content TEXT,
    type ENUM(
        'doc',
        'wiki',
        'policy',
        'manual'
    ) DEFAULT 'doc',
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);

-- Recursos y planificación
CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM(
        'person',
        'equipment',
        'machine',
        'other'
    ) DEFAULT 'person',
    user_id INT,
    team_id INT,
    availability ENUM(
        'available',
        'busy',
        'vacation',
        'inactive'
    ) DEFAULT 'available',
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE SET NULL
);

CREATE TABLE project_resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    resource_id INT NOT NULL,
    assigned_from DATE,
    assigned_to DATE,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE CASCADE
);

-- Calendarios y eventos
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    start_datetime DATETIME,
    end_datetime DATETIME,
    type ENUM(
        'milestone',
        'meeting',
        'holiday',
        'other'
    ) DEFAULT 'other',
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL
);

-- Proveedores y contratos
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_info TEXT
);

CREATE TABLE contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT,
    project_id INT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    amount DECIMAL(12, 2),
    status ENUM(
        'active',
        'expired',
        'cancelled'
    ) DEFAULT 'active',
    FOREIGN KEY (supplier_id) REFERENCES suppliers (id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL
);

-- Presupuestos y costes
CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

CREATE TABLE costs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    description TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- Reportes y analítica
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    team_id INT,
    user_id INT,
    type ENUM(
        'performance',
        'kpi',
        'custom'
    ) DEFAULT 'performance',
    data JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL,
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- CRM y clientes
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    company VARCHAR(150),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    project_id INT,
    status ENUM(
        'new',
        'contacted',
        'qualified',
        'lost',
        'won'
    ) DEFAULT 'new',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL
);

-- Inventario y activos
CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50),
    serial_number VARCHAR(100),
    assigned_to INT,
    status ENUM(
        'active',
        'maintenance',
        'retired'
    ) DEFAULT 'active',
    FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
);

-- RRHH
CREATE TABLE hr_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM(
        'attendance',
        'vacation',
        'evaluation'
    ) DEFAULT 'attendance',
    details TEXT,
    date DATE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Permisos granulares
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT,
    permission VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);