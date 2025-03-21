import './main'
import type { Todo } from './main'
import { overdueMessage } from './main'

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

export function changeCheckbox(list: HTMLUListElement, array: Todo[]) {
  const checkboxArray: boolean[] = []
  for (let i = 0; i < array.length; i++) {
    checkboxArray.push(array[i].checkbox)
  }
  const checkboxTodo = list.querySelectorAll<HTMLInputElement>('.checkbox-todo')
  if (!checkboxTodo) {
    console.error('there is no checkbox to check')
  } else {
    for (let i = 0; i < array.length; i++) {
      if (checkboxArray[i] === true) {
        checkboxTodo[i].checked = true
      } else {
        checkboxTodo[i].checked = false
      }
    }
  }
}

export function checkForOverdueDate(array: Todo[]) {
  const dateArr: string[] = []
  const today = new Date()
  const todayDate = today.toISOString().split('T')[0]
  let val = true
  for (let i = 0; i < array.length; i++) {
    dateArr.push(array[i].date)
  }
  for (let i = 0; i < array.length; i++) {
    if (!overdueMessage) {
      console.error('error systeme')
    } else {
      if (todayDate > dateArr[i]) {
        overdueMessage.hidden = false
        val = false
      }
      if (todayDate <= dateArr[i] && val) {
        overdueMessage.hidden = true
      }
    }
  }
}

export function changeDateDueColor(par: string) {
  const today = new Date()
  const afterFourDays = new Date()
  afterFourDays.setDate(today.getDate() + 4)
  const afterFourDays2 = Date.parse(afterFourDays.toISOString())
  const todayDate = Date.parse(today.toISOString().split('T')[0])
  const due = Date.parse(par)
  let color = ''
  if (due === todayDate) {
    color = 'orange'
  } else if (due < todayDate) {
    color = 'red'
  } else if (due > todayDate && due < afterFourDays2) {
    color = 'yellow'
  } else {
    color = 'green'
  }
  return color
}

export function reaplyColorOnDueDate(array: Todo[]) {
  const newColor: string[] = []
  for (let i = 0; i < array.length; i++) {
    newColor.push(array[i].dateColor)
  }
  const dates = document.querySelectorAll<HTMLParagraphElement>('.input-date')
  for (let i = 0; i < array.length; i++) {
    dates[i].style.color = newColor[i]
  }
}

export function AddingATodo(
  title: HTMLInputElement,
  list: HTMLUListElement,
  date: HTMLInputElement,
  store: Todo[],
  errorMsg: HTMLParagraphElement,
) {
  if (!errorMsg) {
    console.error('Someone got the error p out')
    return
  }
  if (title.value === '' || title.value.length >= 200 || date.value === '') {
    errorMsg.hidden = false
  } else {
    errorMsg.hidden = true
  }
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

export function spliceBooleanArrays(
  array: Todo[],
  nodeList: NodeList,
  preNodeList: HTMLElement,
) {
  if (array[Array.from(nodeList).indexOf(preNodeList)].checkbox === false) {
    array[Array.from(nodeList).indexOf(preNodeList)].checkbox = true
  } else {
    array[Array.from(nodeList).indexOf(preNodeList)].checkbox = false
  }
}
