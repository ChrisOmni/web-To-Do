import './style.css'

const text = document.querySelector<HTMLInputElement>('#todo-input')
const button = document.querySelector<HTMLButtonElement>('#add-todo-button')
const listTodo = document.querySelector<HTMLUListElement>('#list-of-todos')
const errorP = document.querySelector<HTMLParagraphElement>(
  '#todo-creation-error',
)
const dateAdd = document.querySelector<HTMLInputElement>('.due-date')

if (!text || !button || !listTodo || !dateAdd) {
  console.error('Missing elements')
} else {
  const store: string[] = []
  const checkedbox: boolean[] = []
  const dates: string[] = []
  text.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      if (text.value === '' || text.value.length >= 200) {
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
      displayTodo(text.value, listTodo, store, checkedbox, dateAdd.value, dates)
      text.value = ''
      dateAdd.value = ''
    }
  })

  button.addEventListener('click', () => {
    if (text.value === '' || text.value.length >= 200) {
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
    displayTodo(text.value, listTodo, store, checkedbox, dateAdd.value, dates)
    text.value = ''
    dateAdd.value = ''
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
        localStorage.setItem('todo-dates', JSON.stringify(dates))
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
    if (
      titleFromStorage === null ||
      checkedFromStorage === null ||
      datesFromStorage === null
    ) {
      console.error('no local storage')
    } else {
      const stored: string[] = store.concat(JSON.parse(titleFromStorage))
      const date: string[] = dates.concat(JSON.parse(datesFromStorage))
      const check: boolean[] = checkedbox.concat(JSON.parse(checkedFromStorage))
      if (!listTodo) {
        console.error('Missing elements')
      } else {
        for (let i = 0; i < stored.length; i++) {
          store.push(stored[i])
          dates.push(date[i])
          checkedbox.push(check[i])
          displayTodo(stored[i], listTodo, store, checkedbox, date[i], dates)
        }
        changeCheckbox(listTodo, checkedbox)
      }
      localStorage.setItem('todo-element', JSON.stringify(stored))
      localStorage.setItem('todo-dates', JSON.stringify(dates))
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
