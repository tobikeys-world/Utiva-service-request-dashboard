import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import CreateRequest from "./pages/CreateRequest";
import RequestDetails from "./pages/RequestDetails";

import AdminDashboard from "./pages/AdminDashboard";
import AdminRequestDetails from "./pages/AdminRequestDetails";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* EMPLOYEE ROUTES */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["employee"]}
            />
          }
        >
          <Route
            path="/employee"
            element={<EmployeeDashboard />}
          />

          <Route
            path="/employee/request/new"
            element={<CreateRequest />}
          />

          <Route
            path="/employee/request/:id"
            element={<RequestDetails />}
          />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            />
          }
        >
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/request/:id"
            element={<AdminRequestDetails />}
          />
        </Route>

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;