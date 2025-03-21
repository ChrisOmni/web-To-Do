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
  const todoStored: object[] = []
  const todoStock: Todo = {
    title: '',
    date: '',
    dateColor: '',
    checkbox: false,
  }
  const store: string[] = []
  const checkedbox: boolean[] = []
  const dates: string[] = []
  const datesColor: string[] = []
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
      dates.push(dateAdd.value)
      datesColor.push(changeDateDueColor(dateAdd.value))
      checkedbox.push(false)
      store.push(text.value)
      displayTodo(
        text.value,
        listTodo,
        dateAdd.value,
        changeDateDueColor(dateAdd.value),
      )
      text.value = ''
      dateAdd.value = ''
      putEverythingInObject(
        todoStock,
        todoStored,
        store,
        dates,
        datesColor,
        checkedbox,
      )
      checkForOverdueDate(dates)
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
    dates.push(dateAdd.value)
    checkedbox.push(false)
    store.push(text.value)
    datesColor.push(changeDateDueColor(dateAdd.value))
    displayTodo(
      text.value,
      listTodo,
      dateAdd.value,
      changeDateDueColor(dateAdd.value),
    )
    text.value = ''
    dateAdd.value = ''
    putEverythingInObject(
      todoStock,
      todoStored,
      store,
      dates,
      datesColor,
      checkedbox,
    )
    checkForOverdueDate(dates)
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
        store.splice(
          Array.from(deleteStore?.parentNode?.childNodes).indexOf(deleteStore),
          1,
        )
        dates.splice(
          Array.from(deleteStore?.parentNode?.childNodes).indexOf(deleteStore),
          1,
        )
        datesColor.splice(
          Array.from(deleteStore?.parentNode?.childNodes).indexOf(deleteStore),
          1,
        )
        todoStored.splice(
          Array.from(deleteStore?.parentNode?.childNodes).indexOf(deleteStore),
          1,
        )
      }
      const checkBtn = e.target as HTMLInputElement // we just know it
      const deleteCheck = checkBtn.parentElement
      if (!deleteCheck?.parentNode?.childNodes) {
        console.error('critical error')
      } else {
        checkedbox.splice(
          Array.from(deleteCheck?.parentNode?.childNodes).indexOf(deleteCheck),
          1,
        )
      }
      deleteButton.parentElement?.remove()
      checkForOverdueDate(dates)
      putEverythingInObject(
        todoStock,
        todoStored,
        store,
        dates,
        datesColor,
        checkedbox,
      )
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
          checkedbox[
            Array.from(change?.parentNode?.childNodes).indexOf(change)
          ] === false
        ) {
          checkedbox.splice(
            Array.from(change?.parentNode?.childNodes).indexOf(change),
            1,
            true,
          )
        } else {
          checkedbox.splice(
            Array.from(change?.parentNode?.childNodes).indexOf(change),
            1,
            false,
          )
        }
      }
      putEverythingInObject(
        todoStock,
        todoStored,
        store,
        dates,
        datesColor,
        checkedbox,
      )
    }
  })

  window.onload = () => {
    const todoFromStorage = localStorage.getItem('todos')
    if (todoFromStorage === null) {
      console.error('no local storage')
    } else {
      const stored = JSON.parse(todoFromStorage)
      for (let u = 0; u < stored.length; u++) {
        store.push(stored[u].title)
        dates.push(stored[u].date)
        checkedbox.push(stored[u].checkbox)
        datesColor.push(stored[u].dateColor)
      }
      if (!listTodo) {
        console.error('Missing elements')
      } else {
        for (let i = 0; i < stored.length; i++) {
          displayTodo(
            store[i],
            listTodo,
            dates[i],
            changeDateDueColor(dateAdd.value),
          )
        }
        changeCheckbox(listTodo, checkedbox)
        putEverythingInObject(
          todoStock,
          todoStored,
          store,
          dates,
          datesColor,
          checkedbox,
        )
      }
      localStorage.setItem('todos', JSON.stringify(todoStored))
      reaplyColorOnDueDate(datesColor)
      checkForOverdueDate(dates)
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

function checkForOverdueDate(array: string[]) {
  const today = new Date()
  const todayDate = today.toISOString().split('T')[0]
  let val = true
  for (let i = 0; i < array.length; i++) {
    if (!overdueMessage) {
      console.error('error in the systeme')
    } else {
      if (todayDate > array[i]) {
        overdueMessage.hidden = false
        val = false
      }
      if (todayDate <= array[i] && val) {
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

function reaplyColorOnDueDate(array: string[]) {
  const dates = document.querySelectorAll<HTMLParagraphElement>('.input-date')
  for (let i = 0; i < array.length; i++) {
    dates[i].style.color = array[i]
  }
}

function putEverythingInObject(
  object: Todo,
  array: object[],
  array2: string[],
  array3: string[],
  array4: string[],
  array5: boolean[],
) {
  array.splice(0, array.length)
  let newObj = object
  for (let i = 0; i < array2.length; i++) {
    newObj.title = array2[i]
    newObj.date = array3[i]
    newObj.dateColor = array4[i]
    newObj.checkbox = array5[i]
    array.push(newObj)
    newObj = {
      title: '',
      date: '',
      dateColor: '',
      checkbox: false,
    }
  }
  localStorage.setItem('todos', JSON.stringify(array))
}
