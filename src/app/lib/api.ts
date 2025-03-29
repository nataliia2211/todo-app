export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
  if (!response.ok) throw new Error("Failed to fetch todos");
  return response.json();
};

export const addTodo = async (title: string): Promise<Todo> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, completed: false }),
  });

  if (!response.ok) throw new Error("Failed to add todo");
  return response.json();
};

export const deleteTodo = async (id: number): Promise<number> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete todo");

  return id; 
};

