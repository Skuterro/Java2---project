import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { CasePage } from "../pages/CasePage";
import { UserProfile } from "../pages/UserProfile";
import { ScrollToTop } from "../providers/ScrollToTop";
import { useAuth, AuthProvider } from "../providers/AuthProvider";

interface ProtectedRouteProps{
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps ) => {
  const {loggedUser, loading} = useAuth();
  
  if (loading) {
    return <div className="text-white">Loading...</div>;
  }
  if (!loggedUser || loggedUser.role === "guest") {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

export const Routing = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/case/:caseId" element={<CasePage/>}/>
          <Route path="/userProfile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
};