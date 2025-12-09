import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TryOn from "./pages/TryOn";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route element={<Home />} path="/" exact />
        <Route element={<TryOn />} path="/tryon" />
      </Route>
      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
    </Routes>
  );
}

export default App;
