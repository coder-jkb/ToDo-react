import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Load environment variables in development
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }



// Use environment variable directly  
// const API_BASE_URL = process.env.REACT_APP_API_URL;
const API_BASE_URL = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [nextId, setNextId] = useState(1); // State to manage next ID

  useEffect(() => {
    axios.get(`${API_BASE_URL}/todos`)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the todos!', error);
      });
  }, []);

  const addTodo = () => {
    if (newTodo.trim() === '') return;

    axios.post(`${API_BASE_URL}/todos`, { text: newTodo })
      .then(response => {
        setTodos([...todos, { text: newTodo, completed: false }]);
        setNewTodo('');
      })
      .catch(error => {
        console.error('There was an error adding the todo!', error);
      });
  };

  const toggleComplete = (id, completed) => {
    axios.put(`${API_BASE_URL}/todos/${id}`, { completed: !completed })
      .then(response => {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        ));
      })
      .catch(error => {
        console.error('There was an error updating the todo!', error);
      });
  };

  const deleteTodo = id => {
    axios.delete(`${API_BASE_URL}/todos/${id}`)
      .then(response => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the todo!', error);
      });
  };

  return (
    <>
    <main style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "3rem"}}>
      <header style={{margin: "1rem", fontSize: "2.5rem", fontWeight: "bold"}} >
        Todo List
      </header>

      <div style={{display: 'flex'}}>
        <input
          style={{
            height: "3rem", width:"20rem", border: "2px solid #5a5a5a", padding: "0.5rem 1rem", color: "#eee",
            borderTopLeftRadius: "25px", borderBottomLeftRadius: "25px", borderRight: "none", fontSize: "1rem",
          }}
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button style={{
            height: "3rem", width: "5rem", border: "2px solid #5a5a5a", padding: "1rem", fontSize: "1rem",
            borderTopRightRadius: "25px", borderBottomRightRadius: "25px", color: "#eee", background: "#0f1932"
          }}
        onClick={addTodo}>Add</button>
      </div>

      <ul style={{display: 'flex', flexDirection: 'column', minWidth: "25rem"}} >
        { Array.isArray(todos) && todos.map((todo, index) => (  
          <li style={{display: 'flex', gap: "0.5rem", justifyContent: "space-between", padding: "0.5rem 1rem", background: index%2==0?"#191e23":"#282d32"}}
           key={todo.id}>
            <div style={{display: "flex", alignItems:"center"}}>
            <input style={{marginRight: "0.5rem",  transform : "scale(140%)"}}
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id, todo.completed)}
            />
            <span style={{textDecoration: todo.completed?"line-through":"none", fontSize: "1rem"}} >{todo.text}</span>
            
            </div>
            <button style={{marginLeft: "0.2rem", border: "1px solid red",color:"red", 
              background: "transparent", padding: "0.5rem", borderRadius: "5px"}} 
              onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
    </>
  );
}

export default App;
