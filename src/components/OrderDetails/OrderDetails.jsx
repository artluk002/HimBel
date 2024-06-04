import React, {useState, useEffect} from "react";
import "./OrderDetails.modal.scss";
import { Button, Image, InputNumber, message, Empty, Steps } from "antd";
import { Link, useParams } from "react-router-dom";
import { BasketAPI, PhotoAPI } from "../api/api";
import moment from 'moment'; // moment.js для форматирования даты

const ButtonGroup = Button.Group;
const { Step } = Steps;

export const OrderDetails = () => {
    const {id} = useParams();
    const [data, setData] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
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
    //API
    useEffect(() => {
        const order_id = id;
        BasketAPI.getProductsInCompaundReq({order_id}).then(e => {setData(e.data)});
        BasketAPI.getOrderStatusesByIdReq({id: id}).then(e => {setOrderHistory(e.data)});
    }, [id])

    const steps = orderHistory.map((status, index) => {
        const timestampInMilliseconds = status.status_date;
        const formattedDate = moment(timestampInMilliseconds).isValid() 
          ? moment(timestampInMilliseconds).format('DD-MM-YYYY HH:mm:ss') 
          : 'Invalid date';
    
        return {
          title: status.status_name,
          description: formattedDate
        };
      });


    const totalPrice = () => {
        let sum = data.reduce((acc, el) => acc + el.product_price * el.compound_count , 0);
        return Number(sum.toFixed(2));
    };
    // Get photo url
    const [imageUrls, setImageUrls] = useState({});

    const fetchPhotoUrl = async (productId) => {
        try {
            const response = await PhotoAPI.getPhotoesUrlReq(productId);
            if (response.status === 200) {
                let receivedUrl = response.data;
                receivedUrl = receivedUrl.map(url => `http://localhost:3300/${url.url}`);
                setImageUrls(prevState => ({
                    ...prevState,
                    [productId]: receivedUrl
                }));
            } else {
                setImageUrls(prevState => ({
                    ...prevState,
                    [productId]: null
                }));
            }
        } catch (error) {
            console.error('Error fetching photo URL:', error);
            setImageUrls(prevState => ({
                ...prevState,
                [productId]: null
            }));
        }
    };
    useEffect(() => {
        data.forEach(product => {
            fetchPhotoUrl(product.product_id);
        });
    }, [data]);

    return (
        <div className="basket-container">
            {contextHolder}
            <h1>Детали заказа №{id}</h1>
            {data.length?
            <form className="basket-form">
                 
                <div className="basket-content">
                    {data.map((product, index) => (
                    <div key={index} className="basket-product-list">
                        <div className="product-image">
                        {imageUrls[product.product_id] && imageUrls[product.product_id].length > 0 ? (
                            <Image.PreviewGroup
                                items={imageUrls[product.product_id]}
                            >
                                <Image
                                    src={imageUrls[product.product_id][0]}
                                />
                            </Image.PreviewGroup>
                        ) : (
                            <Empty />
                        )}
                        </div>
                        <div className="product-info">
                            <Link to={`/product/${product.product_id}`}><h3>{product.product_name}</h3></Link>
                        </div>
                        <div className="product-count">
                        <ButtonGroup>
                            <InputNumber readOnly controls={false} min={1} max={99} value={product.compound_count}/>
                        </ButtonGroup>
                        </div>
                        <div className="product-price">
                            <h3>
                                {product.product_price} р.
                            </h3>
                        </div>
                    </div>
                     ))}
                </div>
                <div className="basket-sedibar">
                    <div className="order-date">
                        <p >Дата заказа:</p>
                        <p >{}</p>
                    </div>
                    <div className="order-history">
                        <Steps current={steps.length - 1} direction="vertical">
                        {steps.map((step, index) => (
                            <Step key={index} title={step.title} description={step.description} />
                        ))}
                        </Steps>
                    </div>
                    <div className="produtcs-count-and-price">
                        <p>Товары, {data.length} шт.</p>
                        <p>{totalPrice()} рублей</p>
                    </div>
                    <div className="total-price">
                        <h1>Итого:</h1>
                        <h1>{totalPrice()} p.</h1>
                    </div>
                </div>
            </form>
            :
            <div className="emptyBasket"><h1>404</h1></div>
            }
        </div>
        
    )
}