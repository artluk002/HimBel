import React, { useEffect, useState } from "react";
import "./Fovorites.modul.scss";
import { ProductCard } from "../ProductCard/ProductCard";
import { Link, useParams } from "react-router-dom";
import { CatalogAPI } from "../api/api";

export const Fovorites = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    useEffect(() => {
        CatalogAPI.getProductIdFromFavoritiesByUserIdReq({id: id}).then((e) => {setProducts(e.data)});
    }, [id]);
    
    return(
        <div className="favorite-container">
            {products.map((e) => (
                <ProductCard product={e}/>
            ))}
        </div>
        )
}