import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Login';
import Signup from './pages/Signup';

function App() {

  return (
    <>
    <Router>
        <Routes>
          <Route path='/login' element={<Login/>} ></Route>
          <Route path='/signUp' element={<Signup/>}/>
        </Routes>
    </Router>
    </>
  )
}

export default App
