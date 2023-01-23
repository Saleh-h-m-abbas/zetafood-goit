import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Customers from "./pages/customers/Customers";
import ProfilePage from "./pages/profile/Profile";

function App() {
  const { currentUser } = useContext(AuthContext);
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };
  return (
    <div className={"app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route path="customers">
              <Route
                index
                element={
                  <RequireAuth>
                    <Customers />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="send">
              <Route
                index
                element={<RequireAuth>{/* <SmsSendPage /> */}</RequireAuth>}
              />
            </Route>
            <Route path="add">
              <Route
                index
                element={<RequireAuth>{/* <SmsAddPage /> */}</RequireAuth>}
              />
            </Route>
            <Route path="profile">
              <Route
                index
                element={<RequireAuth><ProfilePage /></RequireAuth>}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
