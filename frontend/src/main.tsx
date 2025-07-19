import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import styled from 'styled-components'



const RootContainer = styled.div`
  width: 100%;
  height: 100%;
`
console.log(123123)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootContainer>
      <App />
    </RootContainer>
  </StrictMode>,
)

