import './App.css'
import { AuthProvider } from './providers/AuthProvider'
import { Routing } from './router/Routing'

function App() {

  return (
    <AuthProvider>
      <Routing/>
    </AuthProvider>
  )
}

export default App
