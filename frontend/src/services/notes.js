import axios from "axios";

const baseUrl = "/api/notes";

const getAll = () => axios.get(baseUrl).then((res) => res.data.concat({
  id:1000,
  important: true,
  content: 'This note is not saved to server',
}));

const create = (newNote) =>
  axios.post(baseUrl, newNote).then((res) => res.data);

const update = (id, newNote) =>
  axios.put(`${baseUrl}/${id}`, newNote).then((res) => res.data);

export default {
  getAll,
  create,
  update,
};
