export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}
export interface NoteFormValues {
  title: string;
  content: string;
  url: string;
}