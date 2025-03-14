import './style.css'

const text = document.querySelector<HTMLInputElement>('#todo-input')
const button = document.querySelector<HTMLButtonElement>('add-todo-button')
const listTodo = document.querySelector<HTMLUListElement>('list-of-todos')

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
}

function displayTodo(text: string, list: HTMLUListElement) {
  const listElement = document.createElement('li')
  listElement.classList.add('todo-element')
  listElement.textContent = text
  list.appendChild(listElement)
}
