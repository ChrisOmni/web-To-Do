import './main.ts'
import { changeDateDueColor } from './dates.ts'
import { checkForOverdueDate } from './dates.ts'
import type { Todo } from './types.ts'

export function AddingATodo(
  title: HTMLInputElement,
  list: HTMLUListElement,
  date: HTMLInputElement,
  store: Todo[],
  errorMsg: HTMLParagraphElement,
) {
  if (!errorMsg) {
    throw new Error('Someone got the error p out')
  }
  if (title.value === '' || title.value.length >= 200 || date.value === '') {
    errorMsg.hidden = false
    return
  }
  errorMsg.hidden = true
  displayTodo(title.value, list, date.value, changeDateDueColor(date.value))
  store.push({
    title: title.value,
    date: date.value,
    dateColor: changeDateDueColor(date.value),
    checkbox: false,
  })
  localStorage.setItem('todos', JSON.stringify(store))
  checkForOverdueDate(store)
  title.value = ''
  date.value = ''
}

export function displayTodo(
  text: string,
  list: HTMLUListElement,
  date: string,
  colors: string,
) {
  const listElement = document.createElement('li')
  listElement.classList.add('todo-element')
  list.appendChild(listElement)
  const checkbox = document.createElement('input')
  checkbox.setAttribute('type', 'checkbox')
  checkbox.classList.add('checkbox-todo')
  listElement.appendChild(checkbox)
  const dateInput = document.createElement('p')
  dateInput.classList.add('input-date')
  dateInput.textContent = date
  dateInput.style.color = colors
  listElement.appendChild(dateInput)
  const titleText = document.createElement('h3')
  const deleteButton = document.createElement('button')
  titleText.classList.add('todo-element-title')
  deleteButton.classList.add('delete-todo')
  deleteButton.textContent = 'X'
  titleText.textContent = text
  listElement.appendChild(titleText)
  listElement.appendChild(deleteButton)
}
