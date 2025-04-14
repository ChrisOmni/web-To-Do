import type { Todo } from './types.js'

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

export function changeCheckbox(list: HTMLUListElement, array: Todo[]) {
  const checkboxArray: boolean[] = []
  for (let i = 0; i < array.length; i++) {
    checkboxArray.push(array[i].checkbox)
  }
  const checkboxTodo = list.querySelectorAll<HTMLInputElement>('.checkbox-todo')
  for (let i = 0; i < array.length; i++) {
    if (checkboxArray[i] === true) {
      checkboxTodo[i].checked = true
    } else {
      checkboxTodo[i].checked = false
    }
  }
}
