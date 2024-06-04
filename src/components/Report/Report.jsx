import React, { useEffect, useState } from "react";
import { NoPrint, PrintProvider, Print } from 'react-easy-print';
import { Table } from "antd";
import { DeliveryAddressCard } from "../DeliveryAddressCard/DeliveryAddressCard";
import { BasketAPI } from "../api/api";
import "./Report.modul.scss";

export const Report = ({ items, total, paymentWayId, deliveryWay, deliveryAddressId }) => {
    const [paymentWay, setPaymentWay] = useState();
    useEffect(() => {
        BasketAPI.getUserPaymentByIdReq({id: paymentWayId}).then(e => {
            setPaymentWay(e.data);
        });

    }, [paymentWayId]);
    const [addressInfo, setAddressInfo] = useState();
    useEffect(() => {
        if(deliveryWay === 1) {
            BasketAPI.getShopDeliveryByIdReq({id: deliveryAddressId}).then(e => {
                setAddressInfo(e.data);
                
            });
        }
        else if (deliveryWay === 2) {
            BasketAPI.getUserDeliveryByIdReq({id: deliveryAddressId}).then(e => {
                setAddressInfo(e.data);
            })
        }
        
    }, [deliveryAddressId, deliveryWay])
    return (
        <PrintProvider>
            <NoPrint>
                <h1>Отчет</h1>
            </NoPrint>
            <Print >
                <Table dataSource={items} pagination={false}>
                    <Table.Column title="Наименование" dataIndex="product_name" key="product_name" />
                    <Table.Column title="Количество" dataIndex="compound_count" key="compound_count" />
                    <Table.Column title="Цена" dataIndex="product_price" key="product_price" />
                </Table>
                <div className="paymentWay">
                    <p>способ оплаты:</p>
                    <p>{paymentWay? paymentWay.name : ''}</p>

                </div>
                {}
                {deliveryWay === 1?
                 <p>самовывоз по адресу: 
                    <div className="report-pickup">
                        <h3>{addressInfo? addressInfo.address : ''}</h3>

                        <p>{addressInfo? addressInfo.description: ''}</p>
                    </div>
                 </p>
                 :
                 <p>доставка по адресу: <DeliveryAddressCard devaddress={addressInfo? addressInfo : null}/></p>
                }

                <h1>Итого: {total} р.</h1>
            </Print>
        </PrintProvider>
    );
};
