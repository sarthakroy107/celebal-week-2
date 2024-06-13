import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

function App() {
  const [todos, setTodos] = useState<{ text: string; isCompleted: boolean }[]>(
    []
  );
  const [newTask, setNewTask] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<
    "all" | "done" | "not done"
  >("all");

  const addTodo = () => {
    if (!newTask) {
      setError("Task cannot be empty");
      return;
    }
    setTodos([...todos, { text: newTask, isCompleted: false }]);
    localStorage.setItem(
      "todos",
      JSON.stringify([...todos, { text: newTask, isCompleted: false }])
    );
    setNewTask("");
  };

  const deleteTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const editTodo = (index: number, editedTodo: string) => {
    if (!editedTodo) {
      setError("Task cannot be empty");
      return;
    }
    const newTodos = todos.map((todo, i) => {
      if (i === index)
        return {
          text: editedTodo,
          isCompleted: todo.isCompleted,
        };
      return todo;
    });

    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const markAsDone = (index: number) => {
    const newTodos = todos.map((todo, i) => {
      if (i === index)
        return {
          text: todo.text,
          isCompleted: !todo.isCompleted,
        };
      return todo;
    });
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const moveTop = (index: number) => {
    if (index === 0) return;
    const goingUpTodo = todos[index];
    const goingDownTodo = todos[index - 1];
    const newTodos = todos.map((todo, i) => {
      if (i === index)
        return {
          text: goingDownTodo.text,
          isCompleted: goingDownTodo.isCompleted,
        };
      if (i === index - 1)
        return {
          text: goingUpTodo.text,
          isCompleted: goingUpTodo.isCompleted,
        };
      return todo;
    });
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const moveDown = (index: number) => {
    if (index === todos.length - 1) return;
    const goingUpTodo = todos[index];
    const goingDownTodo = todos[index + 1];
    const newTodos = todos.map((todo, i) => {
      if (i === index)
        return {
          text: goingDownTodo.text,
          isCompleted: goingDownTodo.isCompleted,
        };
      if (i === index + 1)
        return {
          text: goingUpTodo.text,
          isCompleted: goingUpTodo.isCompleted,
        };
      return todo;
    });
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  useEffect(() => {
    console.log(localStorage.getItem("todos"));
    setTodos(JSON.parse(localStorage.getItem("todos") || "[]"));
  }, []);

  useEffect(() => {
    if (error) setError(null);
  }, [newTask]);
  useEffect(() => {}, [error]);

  return (
    <main className="w-[100vw] h-screen flex justify-center items-center bg-purple-500">
      <div className="bg-purple-950 p-3 rounded-sm max-w-2xl">
        <h2 className="text-center mb-5 mt-1 font-medium text-xl">
          CELEBAL TODO APP
        </h2>
        <div className="w-full flex gap-x-1">
          <input
            onChange={(e) => setNewTask(e.target.value)}
            type="text"
            value={newTask}
            placeholder="Get things done"
            className="p-2 px-3 w-80 rounded-sm"
          />
          <button
            onClick={addTodo}
            className="bg-purple-500 p-2 px-6 rounded-sm"
          >
            Add
          </button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div>
          {todos
            .filter((todo) =>
              filteredTodos === "all"
                ? true
                : filteredTodos === "done"
                ? todo.isCompleted
                : !todo.isCompleted
            )
            .map((todo, index) => (
              <div key={index} className="mt-3">
                <DisPlayTextComponent
                  moveUp={moveTop}
                  moveDown={moveDown}
                  markAsDone={markAsDone}
                  editTodo={editTodo}
                  todo={todo}
                  index={index}
                  deleteTodo={deleteTodo}
                />
              </div>
            ))}
        </div>
        <div className="flex gap-x-1 justify-around mt-5">
          <button
            onClick={() => setFilteredTodos("all")}
            className={`${ filteredTodos === "all" ? "bg-purple-800" : "bg-purple-600"} p-1.5 rounded-sm w-32`}
          >
            All
          </button>
          <button
            onClick={() => setFilteredTodos("done")}
            className={`${ filteredTodos === "done" ? "bg-purple-800" : "bg-purple-600"} p-1.5 rounded-sm w-32`}
          >
            Done
          </button>
          <button
            onClick={() => setFilteredTodos("not done")}
            className={`${ filteredTodos === "not done" ? "bg-purple-800" : "bg-purple-600"} p-1.5 rounded-sm w-32`}
          >
            Not Done
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;

function DisPlayTextComponent({
  todo,
  index,
  editTodo,
  deleteTodo,
  markAsDone,
  moveUp,
  moveDown,
}: {
  todo: {
    text: string;
    isCompleted: boolean;
  };
  index: number;
  deleteTodo: (index: number) => void;
  editTodo: (index: number, editedTodo: string) => void;
  markAsDone: (index: number) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
}) {
  console.log(todo);
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [editedTodo, setEditedTodo] = useState<string>(todo.text);
  return (
    <>
      {!isModifying ? (
        <div
          className={`${
            todo.isCompleted ? "bg-green-400" : "bg-purple-500"
          } p-1.5 px-2.5 rounded-sm font-medium flex justify-between items-center`}
        >
          <p>{todo.text}</p>
          <div className="flex gap-x-2 items-center">
            <MdEdit
              onClick={() => setIsModifying(true)}
              title="Edit"
              className="text-white cursor-pointer w-5 h-5"
            />
            <FaTrash
              onClick={() => deleteTodo(index)}
              title="Delete"
              className="text-red-500 cursor-pointer w-4 h-4"
            />
            <MdDone
              onClick={() => {
                markAsDone(index);
              }}
              title="Mark as done"
              className={`text-white cursor-pointer w-5 h-5 ${
                !todo.isCompleted ? "text-green-500" : "opacity-75 text-white"
              }`}
            />
            <FaArrowUp
              onClick={() => moveUp(index)}
              title="Move up"
              className="text-white cursor-pointer w-5 h-5"
            />
            <FaArrowDown
              onClick={() => moveDown(index)}
              title="Move down"
              className="text-white cursor-pointer w-5 h-5"
            />
          </div>
        </div>
      ) : (
        <div className="w-full flex gap-x-1">
          <input
            onChange={(e) => setEditedTodo(e.target.value)}
            type="text"
            value={editedTodo}
            placeholder="Get things done"
            className="p-2 px-3 w-80 rounded-sm"
          />
          <button
            onClick={() => {
              editTodo(index, editedTodo);
              setIsModifying(false);
            }}
            className="bg-purple-500 p-2 px-6 rounded-sm"
          >
            Save
          </button>
        </div>
      )}
    </>
  );
}
