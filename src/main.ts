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
      displayTodo(text, listTodo)
      text.value = ''
    }
  })

  button.addEventListener('click', () => {
    if (text.value === '') {
      return
    }
    displayTodo(text, listTodo)
    text.value = ''
  })
}

function displayTodo(textInput: HTMLInputElement, list: HTMLUListElement) {
  list.innerHTML += `<li class="todo-element">${textInput.value}</li>`
}
