import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "../shell/AppShell.jsx";
import { AdminRoute, ProviderRoute, AuthenticatedRoute } from "../components/ProtectedRoute.jsx";

import HomePage from "../pages/user/HomePage.jsx";
import CategoriesPage from "../pages/user/CategoriesPage.jsx";
import ServicesPage from "../pages/user/ServicesPage.jsx";
import CategoryServicesPage from "../pages/user/CategoryServices.jsx";
import ProviderProfilePage from "../pages/user/ProviderProfilePage.jsx";
import BookingPage from "../pages/user/BookingPage.jsx";
import BookingConfirmationPage from "../pages/user/BookingConfirmationPage.jsx";
import BookingsPage from "../pages/user/BookingsPage.jsx";
import OrderTrackingPage from "../pages/user/OrderTrackingPage.jsx";
import FavoritesPage from "../pages/user/FavoritesPage.jsx";
import ReviewsPage from "../pages/user/ReviewsPage.jsx";
import ProfilePage from "../pages/user/ProfilePage.jsx";
import EditProfilePage from "../pages/user/EditProfilePage.jsx";
import WalletPage from "../pages/user/WalletPage.jsx";
import NotificationsPage from "../pages/user/NotificationsPage.jsx";
import ChatPage from "../pages/user/ChatPage.jsx";

import ProviderDashboard from "../pages/provider/ProviderDashboard.jsx";
import AddServicePage from "../pages/provider/AddServicePage.jsx";
import ManageServicesPage from "../pages/provider/ManageServicesPage.jsx";
import BookingRequestsPage from "../pages/provider/BookingRequestsPage.jsx";
import EarningsPage from "../pages/provider/EarningsPage.jsx";
import AvailabilityPage from "../pages/provider/AvailabilityPage.jsx";
import PortfolioPage from "../pages/provider/PortfolioPage.jsx";
import ProviderReviewsPage from "../pages/provider/ProviderReviewsPage.jsx";

import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import ManageUsersPage from "../pages/admin/ManageUsersPage.jsx";
import ManageProvidersPage from "../pages/admin/ManageProvidersPage.jsx";
import AdminManageServicesPage from "../pages/admin/ManageServicesPage.jsx";
import ReviewModerationPage from "../pages/admin/ReviewModerationPage.jsx";
import AnalyticsDashboard from "../pages/admin/AnalyticsDashboard.jsx";
import DisputeResolutionPage from "../pages/admin/DisputeResolutionPage.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/:name" element={<CategoryServicesPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/providers/:id" element={<ProviderProfilePage />} />

        {/* Authenticated user routes */}
        <Route path="/booking" element={<AuthenticatedRoute><BookingPage /></AuthenticatedRoute>} />
        <Route path="/booking/confirmation" element={<AuthenticatedRoute><BookingConfirmationPage /></AuthenticatedRoute>} />
        <Route path="/bookings" element={<AuthenticatedRoute><BookingsPage /></AuthenticatedRoute>} />
        <Route path="/order-tracking" element={<AuthenticatedRoute><OrderTrackingPage /></AuthenticatedRoute>} />
        <Route path="/favorites" element={<AuthenticatedRoute><FavoritesPage /></AuthenticatedRoute>} />
        <Route path="/reviews" element={<AuthenticatedRoute><ReviewsPage /></AuthenticatedRoute>} />
        <Route path="/profile" element={<AuthenticatedRoute><ProfilePage /></AuthenticatedRoute>} />
        <Route path="/profile/edit" element={<AuthenticatedRoute><EditProfilePage /></AuthenticatedRoute>} />
        <Route path="/wallet" element={<AuthenticatedRoute><WalletPage /></AuthenticatedRoute>} />
        <Route path="/notifications" element={<AuthenticatedRoute><NotificationsPage /></AuthenticatedRoute>} />
        <Route path="/chat" element={<AuthenticatedRoute><ChatPage /></AuthenticatedRoute>} />

        {/* Provider only routes */}
        <Route path="/provider/dashboard" element={<ProviderRoute><ProviderDashboard /></ProviderRoute>} />
        <Route path="/provider/add-service" element={<ProviderRoute><AddServicePage /></ProviderRoute>} />
        <Route path="/provider/services" element={<ProviderRoute><ManageServicesPage /></ProviderRoute>} />
        <Route path="/provider/booking-requests" element={<ProviderRoute><BookingRequestsPage /></ProviderRoute>} />
        <Route path="/provider/earnings" element={<ProviderRoute><EarningsPage /></ProviderRoute>} />
        <Route path="/provider/availability" element={<ProviderRoute><AvailabilityPage /></ProviderRoute>} />
        <Route path="/provider/portfolio" element={<ProviderRoute><PortfolioPage /></ProviderRoute>} />
        <Route path="/provider/reviews" element={<ProviderRoute><ProviderReviewsPage /></ProviderRoute>} />

        {/* Admin only routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsersPage /></AdminRoute>} />
        <Route path="/admin/providers" element={<AdminRoute><ManageProvidersPage /></AdminRoute>} />
        <Route path="/admin/services" element={<AdminRoute><AdminManageServicesPage /></AdminRoute>} />
        <Route path="/admin/reviews" element={<AdminRoute><ReviewModerationPage /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
        <Route path="/admin/disputes" element={<AdminRoute><DisputeResolutionPage /></AdminRoute>} />
      </Route>

      {/* Auth routes - outside AppShell (no sidebar) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;

