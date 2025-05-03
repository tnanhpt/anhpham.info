import { NoteFormValues } from "../@types/note";
import axios from "../ultis/axios";

const getNote = (url: string) => {
  return axios.get(`/note/${url}`);
};

const createNote = () => {
  return axios.post(`/note/create`);
};

const updateNote = (payload: NoteFormValues) => {
  return axios.put(`/note/${payload.url}`, {
    title: payload?.title ?? "",
    content: payload.content,
  });
};

const deleteNote = (url: string) => {
  return axios.delete(`/note/${url}`);
};

const NoteAPI = {
  createNote,
  updateNote,
  getNote,
  deleteNote,
};
export default NoteAPI;
