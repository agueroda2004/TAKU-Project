export type BugPriority = "baja" | "media" | "alta";

export type BugStatus = "abierto" | "en_proceso" | "resuelto" | "cerrado";

export interface Bug {
  id: string;
  moduleId: string;
  name: string;
  description: string | null;
  status: BugStatus;
  priority: BugPriority;
  createdAt: string;
  updatedAt: string;
}

export interface BugListItem {
  id: string;
  moduleId: string;
  name: string;
  description: string | null;
  status: BugStatus;
  priority: BugPriority;
}

export interface CreateBugInput {
  name: string;
  description?: string | null;
  status: BugStatus;
  priority: BugPriority;
}