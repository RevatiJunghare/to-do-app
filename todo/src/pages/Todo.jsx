import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';


const ToDo = ()=> {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [todo,setTodo] = useState({
    title:"",
    task_state:"pending"
  })
  const [page,setPage] = useState(1)
  const limit = 6
  const [totalPages, setTotalPages] = useState(1);
  const [total,setTotal] = useState(0)
  
  const BASE_URL = import.meta.env.API_BASE_URL;

  useEffect(() => {
    fetchTodos(page,limit);
  }, [page]);


  const handleChange = (e)=>{
    const {name,value} = e.target;
    setTodo((prev)=>({
        ...prev,
        [name]:value
    }))
  }

  const fetchTodos = async (page,limit) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try{
        const res = await fetch(`${BASE_URL}/todo/get-todos?page=${page}&limit=${limit}`,{
            method:"GET",
            headers:{
                "Authorization": `${token}`,
                "Content-Type":"application/json",

            }
        })
        const data = await res.json()
         console.log(data)
         setTodos(data.todos)
         setTotalPages(data.totalPages);
         setTotal(data.total)
    }catch(err){
        console.log(err)
    }
    setLoading(false);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!todo.title.trim()) return;
    const token = localStorage.getItem("token");
    try{
        const res = await fetch(`${BASE_URL}/todo/create-todo`,{
            method:"POST",
            headers:{
                "Authorization":`${token}`,
                "Content-Type":"application/json",

            },
            body:JSON.stringify({title:todo.title,task_state:todo.task_state})
        })
        const data = await res.json()
        setTodo({title:"",task_state:"pending"})
        setPage(1);
        fetchTodos(1, limit);
        console.log(data)
    }catch(err){
        console.log(err)
    }
  };

  const updateTodoStatus = async (id, task_state) => {
    const token = localStorage.getItem("token");
    
    try{
        const res = await fetch(`${BASE_URL}/todo/update-todo/${id}`,{
            method:"PUT",
            headers:{
                "Authorization":`${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({task_state:task_state})
        })
        const data = await res.json()
        if (data.success || res.ok) {
            setTodos(todos.map(todo => (todo.id === id ? { ...todo, task_state } : todo)));
          } else {
            console.error('Error updating todo:', data);
          }
        console.log(data)
    }
    catch(err){
        console.log(err)
    }
  };



const updateTodoTitle = async (id, title) => {
    if (!title.trim()) return;
  
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`${BASE_URL}/todo/update-todo/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      });
  
      if (res.ok) {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, title } : todo
        ));
        setEditingId(null);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const deleteTodo = async (id) => {
    const token = localStorage.getItem("token");
    
    try{
        const res = await fetch(`${BASE_URL}/todo/delete-todo/${id}`,{
            method:"DELETE",
            headers:{
                "Authorization":`${token}`,
                "Content-Type":"application/json"
            }
        })
        const data = await res.json()
        console.log(data)
        alert("Todo deleted successfully")
        setPage(1);
        fetchTodos(1, limit);
    }
    catch(err){
        console.log(err)
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'inprogress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-red-100 text-red-700 border-red-300';
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">My Todo List</h1>
            <p className="text-blue-100 mt-1">Stay organized and productive</p>
          </div>

          <div className="p-8">
            <form onSubmit={addTodo} className="mb-8">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={todo.title}
                  name="title"
                  onChange={handleChange}
                  placeholder="What needs to be done?"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>
            </form>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading todos...</div>
            ) : todos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No todos yet!</p>
                <p className="text-sm mt-2">Add your first task above to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        {editingId === todo.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={() => updateTodoTitle(todo.id, editingTitle)}
                              className="text-green-600 hover:text-green-700 p-1"
                            >
                              <Check size={20} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-medium text-gray-800">{todo.title}</h3>
                            <button
                             disabled={todo.task_state === 'completed'}
                              onClick={() => {
                                setEditingId(todo.id);
                                setEditingTitle(todo.title);
                              }}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={todo.task_state}
                          disabled={todo.task_state === 'completed'}
                          onChange={(e) => updateTodoStatus(todo.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(todo.task_state)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="inprogress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>

                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {todos.length > 0 && (
              <div className="mt-8 flex justify-between items-center text-sm text-gray-600 border-t pt-6">
                
                <span className="text-gray-500">Total: <strong>{total}</strong></span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-8">
  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
  >
    Prev
  </button>

  <span className="text-gray-600">
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage(page + 1)}
    className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
  >
    Next
  </button>
</div>

      </div>
    </div>
  );
}

export default ToDo;