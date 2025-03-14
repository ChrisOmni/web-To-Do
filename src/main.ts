import './style.css'

const text = document.querySelector<HTMLInputElement>('#todo-input')
const button = document.querySelector<HTMLButtonElement>('#add-todo-button')
const listTodo = document.querySelector<HTMLUListElement>('#list-of-todos')

if (!text || !button || !listTodo) {
  console.error('Missing elements')
} else {
  text.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      if (text.value === '') {
        return
      }
      displayTodo(text.value, listTodo)
      text.value = ''
    }
  })

  button.addEventListener('click', () => {
    if (text.value === '') {
      return
    }
    displayTodo(text.value, listTodo)
    text.value = ''
  })
  listTodo.addEventListener('click', (e) => {
    // @ts-ignore
    if (e.target?.classList.contains('delete-todo')) {
      const deleteButton = e.target as HTMLButtonElement // because we know
      deleteButton.parentElement?.remove()
    }
  })
}

function displayTodo(text: string, list: HTMLUListElement) {
  const listElement = document.createElement('li')
  listElement.classList.add('todo-element')
  list.appendChild(listElement)
  const checkbox = document.createElement('input')
  checkbox.setAttribute('type', 'checkbox')
  checkbox.classList.add('checkbox-todo')
  listElement.appendChild(checkbox)
  const titleText = document.createElement('h3')
  const deleteButton = document.createElement('button')
  titleText.classList.add('todo-element-title')
  deleteButton.classList.add('delete-todo')
  deleteButton.textContent = 'X'
  titleText.textContent = text
  listElement.appendChild(titleText)
  listElement.appendChild(deleteButton)
}
