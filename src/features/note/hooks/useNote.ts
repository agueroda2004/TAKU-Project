import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
  type GetNotesOptions,
} from "../services/noteService";
import type {
  CreateNoteInput,
  Note,
  NoteListItem,
} from "../note";

export const noteKeys = {
  all: ["notes"] as const,
  lists: () => [...noteKeys.all, "list"] as const,
  list: (moduleId: string) => [...noteKeys.lists(), moduleId] as const,
  details: () => [...noteKeys.all, "detail"] as const,
  detail: (id: string) => [...noteKeys.details(), id] as const,
};

export interface CreateNoteVariables {
  moduleId: string;
  input: CreateNoteInput;
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateNoteVariables>({
    mutationFn: ({ moduleId, input }) => createNote(moduleId, input),
    onSuccess: (_data, { moduleId }) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.list(moduleId) });
    },
  });
}

export interface UpdateNoteVariables {
  id: string;
  moduleId: string;
  input: CreateNoteInput;
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateNoteVariables>({
    mutationFn: ({ id, input }) => updateNote(id, input),
    onSuccess: (_data, { id, moduleId }) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: noteKeys.detail(id) });
    },
  });
}

export interface DeleteNoteVariables {
  id: string;
  moduleId: string;
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteNoteVariables>({
    mutationFn: ({ id }) => deleteNote(id),
    onSuccess: (_data, { id, moduleId }) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.list(moduleId) });
      queryClient.removeQueries({ queryKey: noteKeys.detail(id) });
    },
  });
}

export function useNotes(
  moduleId: string | undefined,
  options: GetNotesOptions = {},
) {
  return useQuery<NoteListItem[], Error>({
    queryKey: moduleId
      ? [...noteKeys.list(moduleId), options]
      : noteKeys.lists(),
    queryFn: () => getNotes(moduleId as string, options),
    enabled: Boolean(moduleId),
  });
}

export function useNote(id: string | undefined) {
  return useQuery<Note, Error>({
    queryKey: id ? noteKeys.detail(id) : noteKeys.details(),
    queryFn: () => getNoteById(id as string),
    enabled: Boolean(id),
  });
}