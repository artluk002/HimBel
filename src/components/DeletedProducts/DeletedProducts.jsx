import React, {useState, useEffect, useContext} from "react";
import { ProductCard } from "../ProductCard/ProductCard";
import { CatalogAPI } from "../api/api";
import { message } from 'antd';
import { MyContext } from "../MyContext/MyContext";

export const DeletedProducts = () => {
    const { deletedProductsToggleState } = useContext(MyContext);
    // API
    const [products, setProducts] = useState([]);
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
    useEffect(() => {
        CatalogAPI.deltedProductsReq().then(e => {setProducts(e.data)});
    }, []);
    useEffect(() => {
        CatalogAPI.deltedProductsReq().then(e => {setProducts(e.data)});
    }, [deletedProductsToggleState]);
    return (
        <div className="catalog-container">
            {contextHolder}
            {products.map((product) =>(
                <ProductCard product={product}/>
                ))}
        </div>
        )
}