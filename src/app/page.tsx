"use client";

import React, { useEffect, useState } from "react";
import { getTodos, addTodo, deleteTodo } from "./lib/api";
import TodoItem from "./components/TodoItem";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<{ id: number; title: string; completed: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const data = await getTodos();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    const todo = await addTodo(newTodo);
    setTodos([todo, ...todos]); // Оптимістичне оновлення
    setNewTodo("");
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex mb-4">
        <input
          className="flex-1 px-3 py-2 border rounded-l focus:outline-none"
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          onClick={handleAddTodo}
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onDelete={handleDeleteTodo} />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
