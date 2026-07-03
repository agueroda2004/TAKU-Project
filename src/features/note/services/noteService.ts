import { supabase } from "../../../config/supabase";
import type {
  CreateNoteInput,
  Note,
  NoteListItem,
} from "../note";

type NotePayload = CreateNoteInput;

export async function createNote(
  moduleId: string,
  input: CreateNoteInput,
): Promise<void> {
  const payload: NotePayload = input;

  const { error } = await supabase.rpc("create_note", {
    p_module_id: moduleId,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function updateNote(
  id: string,
  input: CreateNoteInput,
): Promise<void> {
  const payload: NotePayload = input;

  const { error } = await supabase.rpc("update_note", {
    target_id: id,
    payload,
  });

  if (error) {
    throw error;
  }
}

export async function deleteNote(id: string): Promise<void> {
  // RLS se encarga del ownership. No hay tablas hijas todavía; si en el
  // futuro se agregan (comentarios, adjuntos, etc.) deberían tener
  // ON DELETE CASCADE hacia notes para borrarse solas.
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

interface NoteDetailRow {
  id: string;
  module_id: string;
  text: string;
  created_at: string;
  updated_at: string;
}

function mapNoteDetail(row: NoteDetailRow): Note {
  return {
    id: row.id,
    moduleId: row.module_id,
    text: row.text,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getNoteById(id: string): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .select("id, module_id, text, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Nota no encontrada.");
  }

  return mapNoteDetail(data as unknown as NoteDetailRow);
}

export interface GetNotesOptions {
  limit?: number;
}

export async function getNotes(
  moduleId: string,
  options: GetNotesOptions = {},
): Promise<NoteListItem[]> {
  let query = supabase
    .from("notes")
    .select("id, module_id, text")
    .eq("module_id", moduleId)
    .order("created_at", { ascending: false });

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
    text: row.text,
  }));
}