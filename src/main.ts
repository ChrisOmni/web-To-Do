import './style.css'

const text = document.getElementById('todo-input') as HTMLInputElement
const button = document.getElementById('add-todo-button') as HTMLInputElement
const listTodo = document.getElementById('list-of-todos') as HTMLElement

text.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    if (text.value === '') {
      return
    }
    listTodo.innerHTML += `<li class="todo-element">${text.value}</li>`
    text.value = ''
  }
})

button.addEventListener('click', () => {
  if (text.value === '') {
    return
  }
  listTodo.innerHTML += `<li class="todo-element">${text.value}</li>`
  text.value = ''
})
