import * as React from 'react'
export default function useDidMount(callback: () => any): void {
  React.useEffect(() => {
    if (typeof callback === 'function') {
      callback()
    }
  }, [])
}