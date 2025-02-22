import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/landing';
function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
