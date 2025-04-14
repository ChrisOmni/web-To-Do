import { spliceBooleanArrays } from './checkbox.ts'
import type { Todo } from './types.ts'

export function removeTodosOrCheckbox(
  e: MouseEvent,
  todoStored: Todo[],
  clas: string,
) {
  // @ts-ignore
  if (e.target?.classList.contains(clas)) {
    const button = e.target as HTMLInputElement
    const btnPar = button.parentElement
    const btnChildsParent = btnPar?.parentNode?.childNodes
    if (!btnChildsParent) {
      throw new Error('critical error')
    }
    if (clas === 'delete-todo') {
      todoStored.splice(Array.from(btnChildsParent).indexOf(btnPar), 1)
      button.parentElement?.remove()
    } else {
      spliceBooleanArrays(todoStored, btnChildsParent, btnPar)
    }
  }
}
