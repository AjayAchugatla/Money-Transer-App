import { BrowserRouter, Routes, Route, } from "react-router-dom"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import SendMoney from "./pages/SendMoney"
import First from "./pages/First"
import NotFound from "./pages/NotFound"
import Edit from "./pages/Edit"
import Delete from "./pages/Delete"
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<First />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/edit' element={<Edit />} />
          <Route path='/delete' element={<Delete />} />
          <Route path='/send' element={<SendMoney />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
