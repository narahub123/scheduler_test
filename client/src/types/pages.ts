// ----- notepage ---------
export type NoteType =
  | "none"
  | "struggle"
  | "study"
  | "book"
  | "money"
  | "exercise"
  | "lifelog"
  | "work";

export type StruggleNoteType = {
  title: string;
  background: string;
  reason: string;
  solution: string;
};

export type NoteContentType = StruggleNoteType | {};
