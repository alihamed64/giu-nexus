import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";

// Pages - teammates will create these
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import JobListPage from "./pages/JobListPage";
import JobDetailPage from "./pages/JobDetailPage";
import RecommendedJobsPage from "./pages/RecommendedJobsPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJobPage from "./pages/CreateJobPage";
import EditJobPage from "./pages/EditJobPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import AdminDashboard from "./pages/AdminDashboard";
import PendingRecruitersPage from "./pages/PendingRecruitersPage";
import AdminJobsPage from "./pages/AdminJobsPage";
import AdminUsersPage from "./pages/AdminUsersPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <main style={{ flex: 1, padding: "20px" }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/jobs" element={<JobListPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />

              {/* Job Seeker routes */}
              <Route path="/jobs/recommended" element={
                <RoleRoute roles={["jobSeeker"]}><RecommendedJobsPage /></RoleRoute>
              } />
              <Route path="/jobs/saved" element={
                <RoleRoute roles={["jobSeeker"]}><SavedJobsPage /></RoleRoute>
              } />
              <Route path="/profile" element={
                <RoleRoute roles={["jobSeeker"]}><ProfilePage /></RoleRoute>
              } />
              <Route path="/profile/edit" element={
                <PrivateRoute><EditProfilePage /></PrivateRoute>
              } />
              <Route path="/profile/change-password" element={
                <PrivateRoute><ChangePasswordPage /></PrivateRoute>
              } />
              <Route path="/applications/my" element={
                <RoleRoute roles={["jobSeeker"]}><MyApplicationsPage /></RoleRoute>
              } />

              {/* Recruiter routes */}
              <Route path="/recruiter/dashboard" element={
                <RoleRoute roles={["recruiter"]}><RecruiterDashboard /></RoleRoute>
              } />
              <Route path="/recruiter/jobs/create" element={
                <RoleRoute roles={["recruiter"]}><CreateJobPage /></RoleRoute>
              } />
              <Route path="/recruiter/jobs/:id/edit" element={
                <RoleRoute roles={["recruiter"]}><EditJobPage /></RoleRoute>
              } />
              <Route path="/recruiter/applicants/:jobId" element={
                <RoleRoute roles={["recruiter"]}><ApplicantsPage /></RoleRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin/dashboard" element={
                <RoleRoute roles={["admin"]}><AdminDashboard /></RoleRoute>
              } />
              <Route path="/admin/recruiters" element={
                <RoleRoute roles={["admin"]}><PendingRecruitersPage /></RoleRoute>
              } />
              <Route path="/admin/jobs" element={
                <RoleRoute roles={["admin"]}><AdminJobsPage /></RoleRoute>
              } />
              <Route path="/admin/users" element={
                <RoleRoute roles={["admin"]}><AdminUsersPage /></RoleRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;