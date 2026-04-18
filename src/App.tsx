import { RouterProvider } from 'react-router-dom'
import { AppToaster } from '@hyeonm1339/mes-ui-kit'
import { router } from '@/router'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <AppToaster />
    </>
  )
}

export default App
