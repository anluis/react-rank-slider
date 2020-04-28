import * as React from 'react'
import './index.less'
interface ComponentProp {
  disabled?: boolean;
  min: number;
  max: number;
  step: number;
  propValue?: number;
  minText?: string;
  maxText?: string;
  defaultColor?: string;
  color?: string
}

function useHookWithRefCallback():any {
  const ref = React.useRef(null)
  const setRef = React.useCallback(node => {
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
    }
    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
    }
    // Save a reference to the node
    ref.current = node
  }, [])
  return [setRef]
}

export function RankSlider(props: ComponentProp) {

  const [ref] = useHookWithRefCallback()
  const { propValue, max, min, disabled, step, minText, maxText, color, defaultColor } = props
  const [ startX, setStartX ] = React.useState(0)
  const [ startValue, setStartValue ] = React.useState(1)
  const [ value, setValue ] = React.useState(propValue ? propValue : 1)

  function format(value: number) {
    return Math.round(Math.max(min, Math.min(value, max)) / step) * step
  }

  function handleTouchStart(event: React.TouchEvent) {
    if (disabled) {
      return
    }
    setStartX(event.touches[0].clientX)
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (disabled) {
      return
    }
    const rect = ref.getBoundingClientRect()
    const touch = event.touches[0]
    const deltaX = touch.clientX - startX
    const total = rect.width
    const diff = (deltaX / total) * (max - min)
    setValue(format(startValue + diff))
  }

  // function handleTouchEnd(event: React.TouchEvent) {
  //   if (disabled) {
  //     return
  //   }
  //   // 此处要实现双向绑定
  // }

  function handleClick(event: React.MouseEvent) {
    event.stopPropagation()
    if (disabled) {
      return
    }
    const rect = ref.getBoundingClientRect()
    const delta = event.clientX - rect.left
    const total = rect.width
    const newValue = (delta / total) * (max - min) + min
    setStartValue(value)
    setValue(format(newValue))
  }

  const renderNumbers = []
  const renderLine = []
  for (let index = 0; index <=max; index ++) {
    const divStyle1 = {
      backgroundColor: index !== max ? '' : color,
      flex: index !== max - 1 ? 1 : 0
    }

    renderNumbers.push(( <div style={divStyle1}>
      <div className="number-i">
        { index % 2 === 0 && <span>{index + 1}</span> }
      </div>
    </div>))

    const divStyle = {
      backgroundColor: value > index + 1 ? color : defaultColor,
      flex: index === max - 1 ? 0 : 1
    }
    const divClassName = value > index +1 ? 'circle-i colored' : 'circle-i'
    const divStyleInner = {
      backgroundColor: value > index + 1 ? color : defaultColor
    }
    const divStyleInner2 = {
      backgroundColor: color
    }
    renderLine.push(<div className="circle-o" style={divStyle}>
      <div className={divClassName} style={divStyleInner} />
      {
        (value > index * step && value <= (index + 1) * step) &&
        <div className="circle-big" style={divStyleInner2} >
        <span>{index + 1}</span>
      </div>}
    </div>)
  }


    

  return (
    <div
      ref={ref}
      onTouchStart={(event: React.TouchEvent) => handleTouchStart(event)}
      onTouchMove={(event: React.TouchEvent) => handleTouchMove(event)}
      // onTouchEnd={(event: React.TouchEvent) => handleTouchEnd(event)}
      onClick={(event: React.MouseEvent) => handleClick(event)}
      className="sld">
      <div className="line">
        {renderLine}
      </div>
      <div className="number">
        {renderNumbers}
      </div>
      {minText && maxText && (<>
        <div>{minText}</div>
        <div>{maxText}</div>
      </>)
      }
    </div>
  )
}
   