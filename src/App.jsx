import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import PostListing from "./pages/PostListing";
import Messages from "./pages/Messages";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout><Listings /></Layout></ProtectedRoute>} />
          <Route path="/listings/:id" element={<ProtectedRoute><Layout><ListingDetail /></Layout></ProtectedRoute>} />
          <Route path="/post" element={<ProtectedRoute><Layout><PostListing /></Layout></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}