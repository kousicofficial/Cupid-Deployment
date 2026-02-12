import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./pages/Create";
import LovePage from "./pages/LovePage";
import Success from "./pages/Success";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Create />} />
        <Route path="/success/:id" element={<Success />} />
        <Route path="/love/:id" element={<LovePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
