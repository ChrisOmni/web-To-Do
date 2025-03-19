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

if (!text || !button || !listTodo || !dateAdd) {
  console.error('Missing elements')
} else {
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
        store,
        checkedbox,
        dateAdd.value,
        dates,
        changeDateDueColor(dateAdd.value),
        datesColor,
      )
      text.value = ''
      dateAdd.value = ''
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
      store,
      checkedbox,
      dateAdd.value,
      dates,
      changeDateDueColor(dateAdd.value),
      datesColor,
    )
    text.value = ''
    dateAdd.value = ''
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
      const changeDate = e.target as HTMLParagraphElement // we know everything
      const dateAgain = changeDate.parentElement
      const changeColor = e.target as HTMLParagraphElement // and all at once
      const colorAgain = changeColor.parentElement
      if (!deleteStore?.parentNode?.childNodes) {
        console.error('critical error')
      } else {
        if (
          !dateAgain?.parentNode?.childNodes ||
          !colorAgain?.parentNode?.childNodes
        ) {
          console.error('critical error')
        } else {
          store.splice(
            Array.from(deleteStore?.parentNode?.childNodes).indexOf(
              deleteStore,
            ),
            1,
          )
          dates.splice(
            Array.from(dateAgain?.parentNode?.childNodes).indexOf(dateAgain),
            1,
          )
          datesColor.splice(
            Array.from(colorAgain?.parentNode?.childNodes).indexOf(colorAgain),
            1,
          )
        }

        localStorage.setItem('todo-element', JSON.stringify(store))
        localStorage.setItem('todo-dates', JSON.stringify(dates))
        localStorage.setItem('todo-dates-color', JSON.stringify(datesColor))
        checkForOverdueDate(dates)
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
        localStorage.setItem('todo-checkbox', JSON.stringify(checkedbox))
      }
      deleteButton.parentElement?.remove()
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
      localStorage.setItem('todo-checkbox', JSON.stringify(checkedbox))
    }
  })

  window.onload = () => {
    const titleFromStorage = localStorage.getItem('todo-element')
    const checkedFromStorage = localStorage.getItem('todo-checkbox')
    const datesFromStorage = localStorage.getItem('todo-dates')
    const datesColorFromStorage = localStorage.getItem('todo-dates-color')
    if (
      titleFromStorage === null ||
      checkedFromStorage === null ||
      datesFromStorage === null ||
      datesColorFromStorage === null
    ) {
      console.error('no local storage')
    } else {
      const stored: string[] = store.concat(JSON.parse(titleFromStorage))
      const date: string[] = dates.concat(JSON.parse(datesFromStorage))
      const check: boolean[] = checkedbox.concat(JSON.parse(checkedFromStorage))
      const color: string[] = datesColor.concat(
        JSON.parse(datesColorFromStorage),
      )
      if (!listTodo) {
        console.error('Missing elements')
      } else {
        for (let i = 0; i < stored.length; i++) {
          store.push(stored[i])
          dates.push(date[i])
          datesColor.push(color[i])
          checkedbox.push(check[i])
          displayTodo(
            stored[i],
            listTodo,
            store,
            checkedbox,
            date[i],
            dates,
            changeDateDueColor(dateAdd.value),
            datesColor,
          )
        }
        changeCheckbox(listTodo, checkedbox)
      }
      localStorage.setItem('todo-element', JSON.stringify(stored))
      localStorage.setItem('todo-dates', JSON.stringify(dates))
      localStorage.setItem('todo-dates-color', JSON.stringify(datesColor))
      reaplyColorOnDueDate(datesColor)
      checkForOverdueDate(dates)
    }
  }
}

function displayTodo(
  text: string,
  list: HTMLUListElement,
  array: string[],
  array2: boolean[],
  date: string,
  array3: string[],
  colors: string,
  array4: string[],
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
  localStorage.setItem('todo-element', JSON.stringify(array))
  localStorage.setItem('todo-checkbox', JSON.stringify(array2))
  localStorage.setItem('todo-dates', JSON.stringify(array3))
  localStorage.setItem('todo-dates-color', JSON.stringify(array4))
}

function changeCheckbox(list: HTMLUListElement, array: boolean[]) {
  const checkboxTodo = list.querySelectorAll<HTMLInputElement>('.checkbox-todo')
  if (!checkboxTodo) {
    console.error('there is no checkcbox to check')
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
  console.log(todayString)
  console.log(par)
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
