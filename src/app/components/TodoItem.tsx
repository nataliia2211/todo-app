import React from "react";

interface TodoItemProps {
  todo: { id: number; title: string; completed: boolean };
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow">
      <span className={`text-lg ${todo.completed ? "line-through text-gray-500" : ""}`}>
        {todo.title}
      </span>
      <button
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </button>
    </div>
  );
};

export default TodoItem;
