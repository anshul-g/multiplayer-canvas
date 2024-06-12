'use client'

interface IProps{
  toolTypeHandler: Function 
}

export default function Toolbar({toolTypeHandler}: IProps) {
  const onToolClick = (toolName: Tool) => {
    toolTypeHandler(toolName);
  }

  return (
    <div
      style={{display: 'flex', flexDirection: 'column', position: 'fixed', left: 16, top: '50%', 'transform': 'translateY(-50%)', gap: '8px'}}
    >
      <button onClick={() => onToolClick("eraser")}>E</button>
      <button onClick={() => onToolClick("rect")}>R</button>
      <button onClick={() => onToolClick("circle")}>C</button> 
      <button onClick={() => onToolClick("line")}>L</button>
      <button onClick={() => onToolClick("line")}>T</button>
    </div>
  )
}
