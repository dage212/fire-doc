import { RouterProvider } from 'react-router'
import router from './router'
import { styled } from 'styled-components'

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`
function App() {
  return (
    <AppContainer>
      <RouterProvider router={router}/>
    </AppContainer>
  )
}

export default App
