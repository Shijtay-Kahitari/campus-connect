
import './App.css'
import Nav from './components/Nav'
import Auth from './pages/Auth'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';




function App() {

  return (

    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="auth" element={<Auth />} />
          <Route path="*" element={<h1> not found</h1>} />
        </Route>
      </Routes>
    </Router>










  )
}

export default App
