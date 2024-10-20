import { Route, RouterProvider, createRoutesFromElements, createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import LoginForm from "./components/Forms/LoginForm";
import ResetPassword from "./pages/ResetPasswordPage";
import ContactsPage from "./pages/ContactsPage";
import EmailVerified from "./pages/EmailVerifiedPage";
import VerifyEmail from "./pages/VerifyEmailPage";
import RegisterForm from "./components/Forms/RegisterForm";
import ProductPage from "./pages/ProductPage";
//import PurchasePage from "./pages/PurchasePage";
import PageNotFound from "./pages/PageNotFound";

import { ThemeProvider } from "./contexts/ThemeContext";
import ShopPage from "./pages/ShopPage";


const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/contacts" element={<ContactsPage/>} />
            <Route path="/verified" element={<EmailVerified/>} />
            <Route path="/verify" element={<VerifyEmail/>} />
            <Route path="/products" element={<ShopPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            {/* <Route path="/purchase" element={<PurchasePage/>}/> */}
            <Route path="*" element={<PageNotFound />} />
        </Route>
    )
)

export default function app() {
    return (
        <ThemeProvider>
            <RouterProvider router={routes} />
        </ThemeProvider>
    )
}