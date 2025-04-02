import './style.css'
import { displayTodo } from './function'
import { changeCheckbox } from './function'
import { checkForOverdueDate } from './function'
import { changeDateDueColor } from './function'
import { reaplyColorOnDueDate } from './function'
import { AddingATodo } from './function'
import { spliceBooleanArrays } from './function'

const text = document.querySelector<HTMLInputElement>('#todo-input')
const button = document.querySelector<HTMLButtonElement>('#add-todo-button')
const listTodo = document.querySelector<HTMLUListElement>('#list-of-todos')
export const errorP = document.querySelector<HTMLParagraphElement>(
  '#todo-creation-error',
)
const dateAdd = document.querySelector<HTMLInputElement>('.due-date')
const resetButton = document.querySelector<HTMLButtonElement>('.reset-button')
export const overdueMessage =
  document.querySelector<HTMLParagraphElement>('.overdue-message')
export type Todo = {
  title: string
  date: string
  dateColor: string
  checkbox: boolean
}

if (!text || !button || !listTodo || !dateAdd || !errorP) {
  console.error('Missing elements')
} else {
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
      const deleteButton = e.target as HTMLButtonElement // because we know
      const deleteBtnPar = deleteButton.parentElement
      const deleteChildsParent = deleteBtnPar?.parentNode?.childNodes
      if (!deleteChildsParent) {
        console.error('critical error')
      } else {
        todoStored.splice(
          Array.from(deleteChildsParent).indexOf(deleteBtnPar),
          1,
        )
      }
      deleteButton.parentElement?.remove()
      checkForOverdueDate(todoStored)
      localStorage.setItem('todos', JSON.stringify(todoStored))
    }
    // @ts-ignore
    if (e.target?.classList.contains('checkbox-todo')) {
      const changeCheck = e.target as HTMLInputElement // we just know it
      const changeCheckPar = changeCheck?.parentElement
      const checkChildsParent = changeCheckPar?.parentNode?.childNodes
      if (!checkChildsParent) {
        console.error('critical error')
      } else {
        spliceBooleanArrays(todoStored, checkChildsParent, changeCheckPar)
      }
      localStorage.setItem('todos', JSON.stringify(todoStored))
    }
  })
  window.onload = () => {
    const todoFromStorage = localStorage.getItem('todos')
    if (todoFromStorage === null) {
      console.error('no local storage')
    } else {
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
  }
}
