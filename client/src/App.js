import "./App.css";
import Main from "./pages/Main";
import Assets from "./pages/Assets";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardCms from "./pages/DashboardCms";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [assetsError, setAssetsError] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              localStorage.getItem("token") !== null ? (
                <Main/>
              ) : (
                <Login/>
              )
            }
          />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route
            path="/live-monitoring"
            element={
              localStorage.getItem("token") !== null ? (
                <Main/>
              ) : (
                <Login/>
              )
            }
          />
          <Route
            path="/validasi-notifikasi"
            element={
              localStorage.getItem("token") !== null ? (
                <Main/>
              ) : (
                <Login/>
              )
            }
          />
          <Route
            path="/database-deviasi"
            element={
              localStorage.getItem("token") !== null ? (
                <Main/>
              ) : (
                <Login/>
              )
            }
          />
          {/* <Route
            path="/dashboard"
            element={
              localStorage.getItem("token") !== null ? (
                <DashboardCms />
              ) : (
                <Login/>
              )
            }
          /> */}
          <Route
            path="/assets/*"
            element={
              localStorage.getItem("token") !== null ? (
                assetsError !== true ? (
                  <Assets
                    setAssetsError={setAssetsError}
                  />
                ) : (
                  <NotFound/>
                )
              ) : (
                <Login/>
              )
            }
          />
          <Route path="/*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
