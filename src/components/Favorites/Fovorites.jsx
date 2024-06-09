import React, { useEffect, useState } from "react";
import "./Fovorites.modul.scss";
import { FavoritesProductCard } from "../FavoritesProductCard/FavoritesProductCard";
import { Link, useParams } from "react-router-dom";
import { CatalogAPI } from "../api/api";
import { message } from "antd";

export const Fovorites = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [deleteProductToogle, setDeleteProductToogle] = useState(false);
    useEffect(() => {
        CatalogAPI.getProductIdFromFavoritiesByUserIdReq({id: id}).then((e) => {setProducts(e.data)});
    }, [id, deleteProductToogle]);
    const updateCompare = (message) => {
        setDeleteProductToogle(!deleteProductToogle);
        success(message);
    }
     // message
     const [messageApi, contextHolder] = message.useMessage();
     const success = (message) => {
         messageApi.open({
         type: 'success',
         content: `${message}`,
         });
     };
     const errorm = (data) => {
         messageApi.open({
           type: 'error',
           content: `${data}`,
         });
       };
 
    return(
        <div className="favorite-container">
            {contextHolder}
            {products.map((e) => (
                <FavoritesProductCard product={e} onProductDelete={updateCompare}/>
            ))}
        </div>
        )
}