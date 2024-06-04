import React, { useEffect, useState } from "react";
import "./ProfileOrderCard.modul.scss";
import { Link } from "react-router-dom";
import { Divider } from 'antd';
import { BasketAPI } from "../api/api";

export const ProfileOrderCard = (props) => {
    const { OrderInfo } = props;
    const { order_id } = OrderInfo;

    const [productInfo, setProductInfo] = useState([]);
    const [fullOrderPrice, setFullOrderPrice] = useState(0);
    useEffect(() => {
            BasketAPI.getProductsInCompaundReq({order_id: props.OrderInfo.order_id}).then((e) => {
                setProductInfo(e.data);
                setFullOrderPrice(props.OrderInfo.order_price + props.OrderInfo.address_price);
            });
    }, [order_id]);

    const [productsCount, setProductsCount] = useState(0);
    useEffect(() => {
        let counter = 0;
        productInfo.map((e) => {
            counter += e.compound_count;
        })
        setProductsCount(counter);
    }, [productInfo]);
    
    return(
        <div>
            {props.OrderInfo? 
                <div className="profile-order-card-container">
                    <div className="div-header-profile-order-card">
                    <Link to={`/orderdetails/${order_id}`}><h2>Заказ №{props.OrderInfo.order_id}</h2></Link>
                        <div className="div-order-status">
                            <p>{props.OrderInfo.status_name}</p>
                        </div>
                    </div>
                    <div className="product-info-for-order-container">
                        {productInfo.map((product) => (
                            <div className="product-info-for-order">
                                <div className="div-product-link">
                                    <Link to={`/product/${product.product_id}`}>{product.product_name}</Link>
                                </div>
                                <div className="div-product-count">
                                    <p>{product.compound_count} шт.</p>
                                </div>
                                <div className="div-product-price">
                                    <p>{product.product_price} p.</p>
                                </div>
                            </div>
                        ))}
                        
                    </div>
                    <Divider />
                    <div className="div-delivery-info">
                        <div className="div-main-delivery-and-payment-info">
                            {props.OrderInfo.address_source === 1?
                            <h3>Самовывоз по адресу</h3>
                            :
                            <h3>Доставка по адресу</h3>
                            }
                            <p>{props.OrderInfo.address}</p>
                            <p>{props.OrderInfo.payment_way_name}</p>  
                        </div>
                        <div className="div-full-order-price-info">
                            <div className="div-order-count-price">
                                <p>За {productsCount} шт. </p>
                                <p>{props.OrderInfo.order_price} p.</p>
                            </div>
                            <div className="div-order-delivery-price">
                                <p>Доставка </p>
                                <p>{props.OrderInfo.address_price} p.</p>

                            </div>
                            <div className="div-total-order-price">
                                <p>Итого </p>
                                <p>{fullOrderPrice} p.</p>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div></div>
            }
        </div>
    )
}