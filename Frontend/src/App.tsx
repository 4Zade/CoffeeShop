import { Route, RouterProvider, createRoutesFromElements, createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import ResetPassword from "./pages/ResetPasswordPage";
import ContactsPage from "./pages/ContactsPage";
import EmailVerified from "./pages/EmailVerifiedPage";
import VerifyEmail from "./pages/VerifyEmailPage";
import ProductPage from "./pages/products/ProductPage";
import PurchasePage from "./pages/PurchasePage";
import PageNotFound from "./pages/PageNotFound";
import ProductsPage from "./pages/products/ProductsPage";


import { ThemeProvider } from "./contexts/ThemeContext";
import CheckoutPage from "./pages/CheckoutPage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import ProductLayout from "./layouts/ProductLayout";
import UserSettingsPage from "./pages/UserSettingsPage";
import SettingsLayout from "./layouts/SettingsLayout";

// Loaders
import productsLoader from "./loaders/products/ProductsLoader";
import productLoader from "./loaders/products/ProductLoader";

const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />

            <Route element={<ProtectedLayout />}>
                <Route path="/purchase" element={<PurchasePage/>}/>
                <Route path="/checkout" element={<CheckoutPage/>}/>
            </Route>

            <Route path="/produktai" element={<ProductLayout />}> {/* Will show additional recomended products */}
                <Route index element={<ProductsPage />} loader={productsLoader}/>
                <Route path=":category" element={<ProductsPage />} loader={productsLoader}/>
                <Route path=":category/:id" element={<ProductPage />} loader={productLoader}/>
            </Route>

            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify/:token" element={<EmailVerified/>} />
            <Route path="/verify" element={<VerifyEmail/>} />

            <Route path="/kontaktai" element={<ContactsPage/>} />
            <Route path="/nustatymai" element={<SettingsLayout />}>
                <Route index element={<UserSettingsPage />} />
            </Route>

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