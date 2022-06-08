import React, { useState } from 'react'
import { FabricCanvas } from './renderers/canvas'
import './App.css'

function App() {
  const [color, setColor] = useState('#25b1a7')
  const [show, setShow] = useState(true)

  return (
    <div className="App">
      <button onClick={() => setShow(!show)}>toogle</button>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <FabricCanvas>
        <rect  angle={-10} left={40} top={40} height={20} width={100} fill="yellow" />
          {show &&  <rect left={80} top={80} height={20} width={100} fill={color} />}
          <circle onMouseOver={()=> setColor("green")} radius={30} left={130} top={50} fill="brown" />
      </FabricCanvas>
    </div>
  )
}

export default App
