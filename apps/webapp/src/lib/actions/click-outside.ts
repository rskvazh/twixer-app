import type { Action } from 'svelte/action'

export const clickOutside: Action<HTMLElement, () => void> = (element, callbackFunction) => {
  function onClick(ev: MouseEvent) {
    if (ev.target instanceof Node && !element.contains(ev.target)) {
      callbackFunction()
    }
  }

  document.addEventListener('click', onClick, { passive: true, capture: true })

  return {
    update(newCallbackFunction) {
      callbackFunction = newCallbackFunction
    },
    destroy() {
      document.removeEventListener('click', onClick, { capture: true })
    },
  }
}
