import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Dashboard from './pages/dashboard/dashboard'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} ></Route>
          <Route path='/signUp' element={<Signup />} />
          <Route path='/student-dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
