import type {
  CreateNoteInput,
  Note,
  NoteListItem,
} from "../note";

type NoteFormSource = Pick<Note, "text">;

export function noteToFormState(note: NoteFormSource): CreateNoteInput {
  return {
    text: note.text,
  };
}

/**
 * Mapea un `NoteListItem` a la entrada aceptada por el formulario de
 * creación / edición. Equivalente a `noteToFormState` pero tipado
 * explícitamente para los ítems que devuelve `useNotes`.
 */
export function noteListItemToFormState(note: NoteListItem): CreateNoteInput {
  return noteToFormState(note);
}