import React from "react";
import "./Main.modul.scss";
import { MainPage } from "../MainPage/MainPage";
import { Header } from "../Header/Header";
import { Catalog } from "../Catalog/Catalog";
import { Routes, Route } from "react-router-dom";
import { Product } from "../Product/Product";
import { Basket } from "../Basket/Basket";
import { Fovorites } from "../Favorites/Fovorites";
import { Profile } from "../Profile/Profile";
import { PrivateRoute } from "../utiles/routes/PrivateRoute";
import { AdminRoutes } from "../utiles/routes/AdminRoutes";
import { Report } from "../Report/Report";
import { OrderDetails } from "../OrderDetails/OrderDetails";
import { Reviews } from "../Reviews/Reviews";
import { Compare } from "../Comapre/Compare";
import { MyProvider } from "../MyContext/MyContext";
import { Reports } from "../Reports/Reports";
import { NoPrint } from 'react-easy-print';
import { DeletedProducts } from '../DeletedProducts/DeletedProducts';


export const Main = () =>
{
    return(
        <MyProvider>
        <div className="main-container">
            <NoPrint>
            <Header />
            </NoPrint>
            <div className="main-inner-container">
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/catalog/:id" element={<Catalog/>} />
                    <Route path="/product/:id" element={<Product/>} />
                    <Route path="/product/:id/reviews" element={<Reviews/>}/>
                    <Route element={<PrivateRoute/>}>
                        <Route path="user/:id/compare" element={<Compare/>} />
                        <Route path="user/:id/favorites" element={<Fovorites />} />
                        <Route path="/profile/:id" element={<Profile/>} />
                        <Route path="/basket/:id" element={<Basket/>} />
                        <Route path="/report" element={<Report/>} />
                        <Route path="/orderdetails/:id" element={<OrderDetails/>}/>
                        <Route element={<AdminRoutes/>}>
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/deleted-products" element={<DeletedProducts />} />
                        </Route>
                    </Route>
                    <Route path='*' element={<Page404/>}/>
                </Routes>
            </div>
        </div>
        </MyProvider>
        )
}   
const Page404 = () => {
    return<>
    404
    </>
}