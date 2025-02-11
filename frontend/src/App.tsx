import './App.css'
import { AuthProvider } from './providers/AuthProvider'
import { Routing } from './router/Routing'
import './i18n'; 

function App() {

  return (
    <AuthProvider>
      <Routing/>
    </AuthProvider>
  )
}

export default App
