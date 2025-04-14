import './style.css'
import { changeCheckbox } from './checkbox.ts'
import { checkForOverdueDate } from './dates.ts'
import { changeDateDueColor } from './dates.ts'
import { reaplyColorOnDueDate } from './dates.ts'
import { displayTodo } from './newTodo.ts'
import { AddingATodo } from './newTodo.ts'
import { removeTodosOrCheckbox } from './removeTodo.ts'
import type { Todo } from './types.ts'

export const errorP = document.querySelector<HTMLParagraphElement>(
  '#todo-creation-error',
)
export const overdueMessage =
  document.querySelector<HTMLParagraphElement>('.overdue-message')
const text = document.querySelector<HTMLInputElement>('#todo-input')
const button = document.querySelector<HTMLButtonElement>('#add-todo-button')
const listTodo = document.querySelector<HTMLUListElement>('#list-of-todos')
const dateAdd = document.querySelector<HTMLInputElement>('.due-date')
const resetButton = document.querySelector<HTMLButtonElement>('.reset-button')

if (!text || !button || !listTodo || !dateAdd || !errorP) {
  throw new Error('Missing elements')
}
const todoStored: Todo[] = []

text.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    AddingATodo(text, listTodo, dateAdd, todoStored, errorP)
  }
})

button.addEventListener('click', () => {
  AddingATodo(text, listTodo, dateAdd, todoStored, errorP)
})

resetButton?.addEventListener('click', () => {
  todoStored.splice(0, todoStored.length)
  localStorage.setItem('todos', JSON.stringify(todoStored))
  listTodo.innerHTML = ''
  checkForOverdueDate(todoStored)
})

listTodo.addEventListener('click', (e) => {
  // @ts-ignore
  if (e.target?.classList.contains('delete-todo')) {
    removeTodosOrCheckbox(e, todoStored, 'delete-todo')
    checkForOverdueDate(todoStored)
  }
  // @ts-ignore
  if (e.target?.classList.contains('checkbox-todo')) {
    removeTodosOrCheckbox(e, todoStored, 'checkbox-todo')
  }
  localStorage.setItem('todos', JSON.stringify(todoStored))
})

window.onload = () => {
  const todoFromStorage = localStorage.getItem('todos')
  if (todoFromStorage === null) {
    throw new Error('no local storage')
  }
  const stored = JSON.parse(todoFromStorage)
  for (let u = 0; u < stored.length; u++) {
    const todoStocked: Todo = {
      title: stored[u].title,
      date: stored[u].date,
      dateColor: stored[u].dateColor,
      checkbox: stored[u].checkbox,
    }
    todoStored.push(todoStocked)
  }
  for (let i = 0; i < stored.length; i++) {
    displayTodo(
      todoStored[i].title,
      listTodo,
      todoStored[i].date,
      changeDateDueColor(dateAdd.value),
    )
  }
  changeCheckbox(listTodo, todoStored)
  reaplyColorOnDueDate(todoStored)
  checkForOverdueDate(todoStored)
}
