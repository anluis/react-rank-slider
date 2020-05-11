import * as React from 'react'
import useDidMount from './useDidMount'
import useMutationObserver from './useMutationObserver'

function getBoundingClientRect(
  element: HTMLElement
): ClientRect | DOMRect | null {
  return element.getBoundingClientRect()
}
export default function useBoundingclientrect(ref: React.MutableRefObject<HTMLElement | null>) {
  const [value, setValue] = React.useState<ClientRect | DOMRect | null>(null)
  const update = React.useCallback(() => {
    setValue(ref.current ? getBoundingClientRect(ref.current) : null)
  }, [])

  useDidMount(() => {
    update()
  })

  useMutationObserver(ref, update)

  return value
}