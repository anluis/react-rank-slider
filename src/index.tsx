import * as React from 'react'
import './index.less'
import useBoundingclientrect from './hooks/useBoundingclientrect'

interface ComponentProp {
  /** 是否禁用 */
  disabled?: boolean;
  /** 最小值 */
  min: number;
  /** 最大值 */
  max: number;
  /** 步长 */
  step: number;
  /** 初始值 */
  propValue?: number;
  /** 最小值的解释文字 */
  minText?: string;
  /** 最大值的解释文字 */
  maxText?: string;
  /** 背景颜色 */
  defaultColor?: string;
  /** 拖拽圆点颜色 */
  color?: string;
  /** 返回值回调函数,用于父组件获取 */
  getValue: React.Dispatch<React.SetStateAction<number>>
  
}

function preventDefault(event: React.TouchEvent, isStopPropagation?: boolean) {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault()
  }

  if (isStopPropagation) {
    stopPropagation(event)
  }
}

function stopPropagation(event: React.TouchEvent) {
  event.stopPropagation()
}

export function RankSlider(props: ComponentProp): React.ReactElement {

  const sldRef = React.useRef(null)
  const getBoundingClientRect = useBoundingclientrect(sldRef)
  const { propValue, max, min, disabled, step, minText, maxText, color, defaultColor, getValue } = props
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
    setStartValue(format(value))
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (disabled) {
      return
    }
    preventDefault(event, true);
    const rect = getBoundingClientRect
    const touch = event.touches[0]
    const deltaX = touch.clientX - startX
    const total = rect!.width
    const diff = (deltaX / total) * (max - min)
    setValue(format(startValue + diff))
    getValue(value)
  }

  function handleClick(event: React.MouseEvent) {
    event.stopPropagation()
    if (disabled) {
      return
    }
    const rect = getBoundingClientRect
    const delta = event.clientX - rect!.left
    const total = rect!.width
    const newValue = (delta / total) * (max - min) + min
    setStartValue(value)
    setValue(format(newValue))
    getValue(value)
  }

  const renderNumbers = []
  const renderLine = []

  for (let index = 0; index <= max -1; index ++) {
    const divStyle1 = {
      backgroundColor: index !== max ? '' : color,
      flex: index !== max - 1 ? 1 : 0
    }
    const spanStyle = {
      opacity: index / max + 0.1
    }

    renderNumbers.push(( <div style={divStyle1} key={`number-${index}`}>
      <div className="number-i" key={index}>
        { index % 2 === 0 && <span style={spanStyle}>{index + 1}</span> }
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

    renderLine.push(<div className="circle-o" style={divStyle} key={index}>
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
      ref={sldRef}
      onClickCapture={(event: React.MouseEvent) => handleClick(event)}
      onTouchStartCapture={(event: React.TouchEvent) => handleTouchStart(event)}
      onTouchMoveCapture={(event: React.TouchEvent) => handleTouchMove(event)}
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

export default RankSlider;
