import React, { useEffect, useState } from 'react'
import TaskForms from './TaskForms'
import Task from './Task'
import {toast} from 'react-toastify'
import axios from 'axios'
import loader from '../assets/loader.gif'
import { URL } from '../App'
function TaskList() {
  const [formData, setFormData] = useState({
    name: "",
    completed: false
  })
  const name = formData.name
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [taskID, setTaskID] = useState("")
  const [completedTasks, setCompletedTasks] = useState([])
  const getTasks = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${URL}/api/tasks`)
      const data = response.data
      setTasks(data)
      setIsLoading(false)
    } catch (error) {
      toast.error(error.message)
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getTasks()
  }, [])
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const createTask = async (e) => {
    e.preventDefault()
    if (name === "") {
      return toast.error("Input field can't be empty!")
    }
    try {
      await axios.post(`${URL}/api/tasks`, formData)
      setFormData({ ...formData, name: "" })
      toast.success("Task Added Suucessfuy :)")
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`)
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }
  const getSingleTask = (task) => {
    setFormData({ name: task.name, completed: false })
    setIsEditing(true)
    setTaskID(task._id)
  }
  const updateTask = async (e) => {
    e.preventDefault()
    if (name === "") {
      toast.error("Please write something to update!")
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData)
      //  setTaskID("");
      setFormData({ ...formData, name: "" })
      setIsEditing(false)
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true
    }
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    const ctasks = tasks.filter((task) => {
      return task.completed === true
    }
    )
    setCompletedTasks(ctasks)
  }, [tasks])

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForms name={name} handleInputChange={handleInputChange} createTask={createTask} isEditing={isEditing} updateTask={updateTask} />

      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks: </b>{tasks.length}
          </p>
          <p>
            <b>Completed Tasks: </b>{completedTasks.length}
          </p>
        </div>)}
      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loader} alt="Loading..." />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No tasks added. Plz add a task!</p>
      ) : (
        tasks.map((task, index) => {
          return <Task key={task._id} index={index} task={task} deleteTask={deleteTask} getSingleTask={getSingleTask} setToComplete={setToComplete} />
        })
      )}
    </div>
  )
}

export default TaskList
