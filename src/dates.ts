import type { Todo } from './types.ts'
import { overdueMessage } from './main.ts'

export function checkForOverdueDate(array: Todo[]) {
  if (!overdueMessage) {
    throw new Error('error systeme')
  }
  const dateArr: string[] = []
  const today = new Date()
  const todayDate = today.toISOString().split('T')[0]
  let val = true
  if (array.length === 0) {
    overdueMessage.hidden = true
  } else {
    for (let i = 0; i < array.length; i++) {
      dateArr.push(array[i].date)
    }
    for (let i = 0; i < array.length; i++) {
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

export function changeDateDueColor(par: string): string {
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
