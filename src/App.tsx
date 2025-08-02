import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SigninPage from "./pages/Signin";
import SignupPage from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadProject from "./pages/UploadProject";
import ManageProject from "./pages/ManageProject";
import DashboardOverview from "./pages/DashboardOverview";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SigninPage />} />
          <Route path="sign-up" element={<SignupPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="upload" element={<UploadProject />} />
            <Route path="manage" element={<ManageProject />} />
          </Route>

          {/* <Route path='*' element={<NotFound />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
