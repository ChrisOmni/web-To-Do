import './style.css'

const text = document.querySelector<HTMLInputElement>('#todo-input')
const button = document.querySelector<HTMLButtonElement>('#add-todo-button')
const listTodo = document.querySelector<HTMLUListElement>('#list-of-todos')

if (!text || !button || !listTodo) {
  console.error('Missing elements')
} else {
  const store: string[] = []
  text.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      if (text.value === '') {
        return
      }
      store.push(text.value)
      displayTodo(text.value, listTodo, store)
      text.value = ''
    }
  })

  button.addEventListener('click', () => {
    if (text.value === '') {
      return
    }
    store.push(text.value)
    displayTodo(text.value, listTodo, store)
    text.value = ''
  })

  listTodo.addEventListener('click', (e) => {
    // @ts-ignore
    if (e.target?.classList.contains('delete-todo')) {
      const deleteButton = e.target as HTMLButtonElement // because we know
      const deleteStore = deleteButton.parentElement
      if (!deleteStore?.parentNode?.childNodes) {
        console.error('critical error')
      } else {
        store.splice(
          Array.from(deleteStore?.parentNode?.childNodes).indexOf(deleteStore),
          1,
        )
        localStorage.setItem('todo-element', JSON.stringify(store))
      }
      deleteButton.parentElement?.remove()
    }
  })

  window.onload = () => {
    const dataFromStorage = localStorage.getItem('todo-element')
    if (dataFromStorage === null) {
      console.error('no local storage')
    } else {
      const stored: string[] = store.concat(JSON.parse(dataFromStorage))
      if (!listTodo) {
        console.error('Missing elements')
      } else {
        for (let i = 0; i < stored.length; i++) {
          store.push(stored[i])
          displayTodo(stored[i], listTodo, store)
        }
      }
      localStorage.setItem('todo-element', JSON.stringify(stored))
    }
  }
}

function displayTodo(text: string, list: HTMLUListElement, array: string[]) {
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
  localStorage.setItem('todo-element', JSON.stringify(array))
}
