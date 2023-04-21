const TaskForms = (props) => {
  return (
    <form className='task-form'  onSubmit={props.isEditing ? props.updateTask : props.createTask}>
      <input type="text" placeholder="Add a Task" name="name" value={props.name} onChange={props.handleInputChange}  />
      <button type='submit'>{props.isEditing ? "Edit" : "Add"}</button>
    </form>
  )
}
// name="name" value={name} onChange={handleInputChange}
//createTask,name,handleInputChange
export default TaskForms