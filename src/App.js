import React, { useEffect } from 'react';
import {useState} from 'react'
import {firestore} from './index'
import Task from './Task'

function App() {

  const [tasks, setTasks] = useState([])

  const [name, setName] = useState('')

  useEffect(()=>{
    retriveData()
  }, [])

  const retriveData = () => {
    firestore.collection("tasks").onSnapshot( (value) => {
      console.log(value.docs)
      let myTask = value.docs.map( index => {
        const {id, name} = index.data()
        console.log("data", id, name)
        return {id, name}
      })
      setTasks(myTask)
    })
  }

  const deleteTask = (id) => {
    firestore.collection('tasks').doc(id+'').delete()
  }

  const editTask = (id) => {
    firestore.collection('tasks').doc(id+'').set({id, name})
  }

  const renderTask = () => {
    if( tasks && tasks.length){
      return (
        tasks.map( (task, index) => {
          return (
            <Task key={index} task={task} deleteTask={deleteTask} editTask={editTask} />
          )
        } )
      )
    }else{
      return (<li> No task</li>)
    }

  }

  const addTask = () => {
    let id = (tasks.length === 0)?1:tasks[tasks.length-1].id + 1
    firestore.collection('tasks').doc(id+'').set({id, name})
  }

  return (
    <div>
      <h1>Todo List</h1>
      <input type="text" name="name" onChange={(e) => setName(e.target.value)} />
      <button onClick = {addTask}> submit </button>
      <ul style={{ display: 'flex', listStyle: 'none'}}>
       { renderTask() }
      </ul>
    </div>
  );
}

export default App;
