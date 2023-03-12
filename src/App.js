import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Customers from "./pages/customers/Customers";
import ProfilePage from "./pages/profile/Profile";
import Users from "./pages/users/Users";
import UserInfo from "./pages/users/UserInfo";
import AdminHome from "./pages/home/AdminHome";

function App() {
  const { currentUser } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  const AdminAuth = ({ children }) => {
    return user.role === 0 ? children : <Navigate to="/" />;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="login" element={<Login />} />
          <Route
            index
            element={
              <RequireAuth>
                {user&&user.role===0?<AdminHome />: <Home />}
              </RequireAuth>
            }
          />
          <Route path="customers">
            <Route
              index
              element={
                <RequireAuth>
                  <AdminAuth>
                    <Customers />
                  </AdminAuth>
                </RequireAuth>
              }
            />
          </Route>

          <Route path="users">
            <Route
              index
              element={
                <RequireAuth>
                  <AdminAuth>
                    <Users />
                  </AdminAuth>
                </RequireAuth>
              }
            />
          </Route>
          <Route path="userinfo">
            <Route
              index
              element={
                <RequireAuth>
                  <AdminAuth>
                    <UserInfo />
                  </AdminAuth>
                </RequireAuth>
              }
            />
          </Route>
          <Route path="profile">
            <Route
              index
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
