import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import PostListing from "./pages/PostListing";
import Messages from "./pages/Messages";
import PaymentCallback from "./pages/PaymentCallback";
import MyPayments from "./pages/MyPayments";
import SellerProfile from "./pages/SellerProfile";
import Favourites from "./pages/Favourites";
import Profile from "./pages/Profile";

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
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment/callback" element={<PaymentCallback />} />
            <Route path="/" element={<Layout><Listings /></Layout>} />
            <Route path="/listings/:id" element={<Layout><ListingDetail /></Layout>} />
            <Route path="/seller/:id" element={<Layout><SellerProfile /></Layout>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
            <Route path="/post" element={<ProtectedRoute><Layout><PostListing /></Layout></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Layout><MyPayments /></Layout></ProtectedRoute>} />
            <Route path="/favourites" element={<ProtectedRoute><Layout><Favourites /></Layout></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
