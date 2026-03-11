#react patterns

1.render Props
In Render Props, the parent passes a function to the child, and the child calls that function with its data to render UI.

#code:

App.js

import React from 'react'
import Child from './child'

const App = () => {
  return (
    <Child render={(name)=> <h2>hello {name}</h2>} />
  )
}

export default App

child.js

import React from 'react'

const Child = ({render}) => {
    const name = "sai"
  return (
   <>
   {render(name)}
   </>
  )
}

export default Child

----------------------------------------------------------------------------------------------------------------------------------
