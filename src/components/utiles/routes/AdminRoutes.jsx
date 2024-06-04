import { Navigate, Outlet } from "react-router-dom";

export const AdminRoutes = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    let isAuthenticated;
    if (user && (user.status === 'admin')) {
        isAuthenticated = true;
    } else{
        isAuthenticated = false;
    }
    return(
        isAuthenticated ? <Outlet /> : <Navigate to="/" />
        )
}