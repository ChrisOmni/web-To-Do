import './style.css'

const text = document.querySelector<HTMLInputElement>('#todo-input')
const button = document.querySelector<HTMLButtonElement>('#add-todo-button')
const listTodo = document.querySelector<HTMLUListElement>('#list-of-todos')
const errorP = document.querySelector<HTMLParagraphElement>(
  '#todo-creation-error',
)
const dateAdd = document.querySelector<HTMLInputElement>('.due-date')
const resetButton = document.querySelector<HTMLButtonElement>('.reset-button')
const overdueMessage =
  document.querySelector<HTMLParagraphElement>('.overdue-message')
type Todo = {
  title: string
  date: string
  dateColor: string
  checkbox: boolean
}

if (!text || !button || !listTodo || !dateAdd) {
  console.error('Missing elements')
} else {
  const todoStored: Todo[] = []
  const checkboxArr: boolean[] = []
  text.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      if (
        text.value === '' ||
        text.value.length >= 200 ||
        dateAdd.value === ''
      ) {
        if (!errorP) {
          console.error('Someone got the error p out')
        } else {
          errorP.hidden = false
        }
        return
      }
      if (!errorP) {
        console.error('Someone got the error p out')
      } else {
        errorP.hidden = true
      }
      const todoStock: Todo = {
        title: text.value,
        date: dateAdd.value,
        dateColor: changeDateDueColor(dateAdd.value),
        checkbox: false,
      }
      displayTodo(
        text.value,
        listTodo,
        dateAdd.value,
        changeDateDueColor(dateAdd.value),
      )
      text.value = ''
      dateAdd.value = ''
      todoStored.push(todoStock)
      localStorage.setItem('todos', JSON.stringify(todoStored))
      checkForOverdueDate(todoStored)
    }
  })

  button.addEventListener('click', () => {
    if (text.value === '' || text.value.length >= 200 || dateAdd.value === '') {
      if (!errorP) {
        console.error('Someone got the error p out')
      } else {
        errorP.hidden = false
      }
      return
    }
    if (!errorP) {
      console.error('Someone got the error p out')
    } else {
      errorP.hidden = true
    }
    const todoStock: Todo = {
      title: text.value,
      date: dateAdd.value,
      dateColor: changeDateDueColor(dateAdd.value),
      checkbox: false,
    }
    displayTodo(
      text.value,
      listTodo,
      dateAdd.value,
      changeDateDueColor(dateAdd.value),
    )
    text.value = ''
    dateAdd.value = ''
    todoStored.push(todoStock)
    localStorage.setItem('todos', JSON.stringify(todoStored))
    checkForOverdueDate(todoStored)
  })

  resetButton?.addEventListener('click', () => {
    localStorage.clear()
    location.reload()
  })

  listTodo.addEventListener('click', (e) => {
    // @ts-ignore
    if (e.target?.classList.contains('delete-todo')) {
      const deleteButton = e.target as HTMLButtonElement // because we know
      const deleteStore = deleteButton.parentElement
      if (!deleteStore?.parentNode?.childNodes) {
        console.error('critical error')
      } else {
        todoStored.splice(
          Array.from(deleteStore?.parentNode?.childNodes).indexOf(deleteStore),
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
      const change = changeCheck?.parentElement
      if (!change?.parentNode?.childNodes) {
        console.error('critical error')
      } else {
        if (
          checkboxArr[
            Array.from(change?.parentNode?.childNodes).indexOf(change)
          ] === false
        ) {
          checkboxArr.splice(
            Array.from(change?.parentNode?.childNodes).indexOf(change),
            1,
            true,
          )
        } else {
          checkboxArr.splice(
            Array.from(change?.parentNode?.childNodes).indexOf(change),
            1,
            false,
          )
        }
      }
      console.log(checkboxArr)
      addCheckboxToObject(todoStored, checkboxArr)
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
      if (!listTodo) {
        console.error('Missing elements')
      } else {
        for (let i = 0; i < stored.length; i++) {
          displayTodo(
            todoStored[i].title,
            listTodo,
            todoStored[i].date,
            changeDateDueColor(dateAdd.value),
          )
        }
        for (let z = 0; z < todoStored.length; z++) {
          checkboxArr.push(todoStored[z].checkbox)
        }
        changeCheckbox(listTodo, checkboxArr) // problème à régler aussi
      }
      localStorage.setItem('todos', JSON.stringify(todoStored))
      reaplyColorOnDueDate(todoStored)
      checkForOverdueDate(todoStored)
    }
  }
}

function displayTodo(
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

function changeCheckbox(list: HTMLUListElement, array: boolean[]) {
  const checkboxTodo = list.querySelectorAll<HTMLInputElement>('.checkbox-todo')
  if (!checkboxTodo) {
    console.error('there is no checkbox to check')
  } else {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === true) {
        checkboxTodo[i].checked = true
      } else {
        checkboxTodo[i].checked = false
      }
    }
  }
}

function checkForOverdueDate(array: Todo[]) {
  const dateArr: string[] = []
  const today = new Date()
  const todayDate = today.toISOString().split('T')[0]
  let val = true
  for (let i = 0; i < array.length; i++) {
    dateArr.push(array[i].date)
  }
  for (let i = 0; i < array.length; i++) {
    if (!overdueMessage) {
      console.error('error in the systeme')
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

function changeDateDueColor(par: string) {
  const today = new Date()
  const afterFourDays2 = new Date()
  afterFourDays2.setDate(today.getDate() + 4)
  const afterFourDaysString = afterFourDays2.toISOString()
  const afterFourDays = Date.parse(afterFourDaysString)
  const todayString = today.toISOString().split('T')[0]
  const todayDate = Date.parse(todayString)
  const due = Date.parse(par)
  let color = ''
  if (due === todayDate) {
    color = 'orange'
  } else if (due < todayDate) {
    color = 'red'
  } else if (due > todayDate && due < afterFourDays) {
    color = 'yellow'
  } else {
    color = 'green'
  }
  return color
}

function reaplyColorOnDueDate(array: Todo[]) {
  const newColor: string[] = []
  for (let i = 0; i < array.length; i++) {
    newColor.push(array[i].dateColor)
  }
  const dates = document.querySelectorAll<HTMLParagraphElement>('.input-date')
  for (let i = 0; i < array.length; i++) {
    dates[i].style.color = newColor[i]
  }
}

function addCheckboxToObject(array: Todo[], array2: boolean[]) {
  for (let i = 0; i < array.length; i++) {
    array[i].checkbox = array2[i]
  }
  localStorage.setItem('todos', JSON.stringify(array))
}
