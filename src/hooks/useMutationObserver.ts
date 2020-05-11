import * as React from 'react'

const config = {
  atrributes: true,
  characterData: true,
  subtree: true,
  childList: true
}

export default function useMutationObserver(
  ref: React.MutableRefObject<HTMLElement | null>,
  callback: MutationCallback,
  options: MutationObserverInit = config
) {
  React.useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback)
      observer.observe(ref.current, options)
      return () => {
        observer.disconnect()
      }
    }
    return () => {}
  }, [callback, options])
}