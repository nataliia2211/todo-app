"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, addTodo, deleteTodo } from "./lib/api";
import TodoItem from "./TodoItem/page";


interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface MutateContext {
  previousTodos?: Todo[];
}

const TodoList: React.FC = () => {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");

   const { data: todos = [], isLoading, isError } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const addTodoMutation = useMutation<Todo, Error, string, MutateContext>({
    mutationFn: addTodo,
    onMutate: async (newTitle) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData<Todo[]>(["todos"], (old) => [
        { id: Math.random(), title: newTitle, completed: false },
        ...(old || []),
      ]);

      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodoMutation = useMutation<number, Error, number, MutateContext>({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.filter((todo) => todo.id !== id) || []
      );

      return { previousTodos };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    addTodoMutation.mutate(newTodo);
    setNewTodo("");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>

      <div className="flex mb-4">
        <input
          className="flex-1 px-3 py-2 border rounded-l focus:outline-none"
          type="text"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          placeholder="Add a new todo..."
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          onClick={handleAddTodo}
        >
          Add
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Error loading todos!</p>}

      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={() => deleteTodoMutation.mutate(todo.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
