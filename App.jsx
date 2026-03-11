import React from 'react'
import Child from './child'

const App = () => {
  return (
    <Child render={(name)=> <h2>hello {name}</h2>} />
  )
}

export default App