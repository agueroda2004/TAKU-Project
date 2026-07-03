import { supabase } from "../../../config/supabase";
import type {
  CreateDocumentationInput,
  Documentation,
  DocumentationListItem,
} from "../documentation";

type DocumentationPayload = CreateDocumentationInput;

export async function createDocumentation(
  moduleId: string,
  input: CreateDocumentationInput
): Promise<void> {
  const payload: DocumentationPayload = input;

  const { error } = await supabase.rpc("create_documentation", {
    p_module_id: moduleId,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function updateDocumentation(
  id: string,
  input: CreateDocumentationInput
): Promise<void> {
  const payload: DocumentationPayload = input;

  const { error } = await supabase.rpc("update_documentation", {
    target_id: id,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function deleteDocumentation(id: string): Promise<void> {
  // RLS se encarga del ownership. No hay tablas hijas todavía; si en el
  // futuro se agregan (versiones, adjuntos, etc.) deberían tener
  // ON DELETE CASCADE hacia documentations para borrarse solas.
  const { error } = await supabase
    .from("documentations")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

interface DocumentationDetailRow {
  id: string;
  module_id: string;
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
}

function mapDocumentationDetail(row: DocumentationDetailRow): Documentation {
  return {
    id: row.id,
    moduleId: row.module_id,
    title: row.title,
    text: row.text,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getDocumentationById(id: string): Promise<Documentation> {
  const { data, error } = await supabase
    .from("documentations")
    .select("id, module_id, title, text, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Documentación no encontrada.");
  }

  return mapDocumentationDetail(data as unknown as DocumentationDetailRow);
}

export interface GetDocumentationsOptions {
  limit?: number;
}

export async function getDocumentations(
  moduleId: string,
  options: GetDocumentationsOptions = {}
): Promise<DocumentationListItem[]> {
  let query = supabase
    .from("documentations")
    .select("id, module_id, title, text")
    .eq("module_id", moduleId)
    .order("updated_at", { ascending: false });

  if (options.limit !== undefined) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    moduleId: row.module_id,
    title: row.title,
    text: row.text,
  }));
}