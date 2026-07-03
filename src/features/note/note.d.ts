export interface Note {
  id: string;
  moduleId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteListItem {
  id: string;
  moduleId: string;
  text: string;
}

export interface CreateNoteInput {
  text: string;
}