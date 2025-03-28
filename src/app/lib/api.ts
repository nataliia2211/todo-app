import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

export const getTodos = async () => {
  const response = await axios.get(`${API_URL}?_limit=10`);
  return response.data;
};

export const addTodo = async (title: string) => {
  const response = await axios.post(API_URL, { title, completed: false });
  return response.data;
};

export const deleteTodo = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};
