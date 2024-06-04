import React, {useState, useEffect, useContext} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./Basket.modul.scss";
import { Button, Image, InputNumber, message, Modal, Empty, Radio, Select } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined, HeartOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { BasketAPI, PhotoAPI } from "../api/api";
import { Report } from "../Report/Report";
import { NoPrint } from "react-easy-print";
import { DeliveryAddressCard } from "../DeliveryAddressCard/DeliveryAddressCard";
import { ModalAddDeliveryAddress } from "../ModalAddDeliveryAddress/ModalAddDeliveryAddress";
import { MyContext } from "../MyContext/MyContext";
//import {} from "../Header/Header";
const { Option } = Select;

const ButtonGroup = Button.Group;

export const Basket = () => {
    const { toggle, orderToggle } = useContext(MyContext);
    const [pickupPoints, setPickupPoints] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState([]);
    const [deliveryAddressToggle, setDeliveryAddressToggle] = useState(false);
    const [deliveryAddressId, setDeliveryAddressId] = useState();
    const [userId, setUserId] = useState();
    const navigate = useNavigate();
    const onChangeDeliveryAddressId = (e) => {
        setDeliveryAddressId(e.target.value);
    };
    const onChangeShopDeliveryAddressId = (value) => {
        setDeliveryAddressId(value);
    };
    const [deliveryWay, setDeliveryWay] = useState(1);
    const onChangeDeliveryWay = (e) => {
        setDeliveryWay(e.target.value);
      };
      useEffect(() => {
        if(deliveryWay === 1) {
            BasketAPI.getShopDeliveryInfoReq().then(e => {
                if(e.status === 200) {
                    setPickupPoints( e.data )
                }
            });
        }
        else if (deliveryWay === 2) {
            const user_id = JSON.parse(localStorage.getItem('user')).id;
            BasketAPI.getUserDeliveryInfoReq( {userId: user_id} ).then(e => {
                 if(e.status === 200) {
                    setDeliveryAddress( e.data );
                }
                });

        }
      }, [deliveryWay, deliveryAddressToggle]);
    const [paymentWay, setPaymentWay] = useState(1);
    const onChangePaymentWay = (e) => {
        setPaymentWay(e.target.value);
    };
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const showModal = () => {
        if(deliveryAddressId === undefined) {
            errorm('Выберите способ доставки');
            return;
        }
        else {
            setIsModalVisible(true);
        }
        
    };

    const handleOk = () => {
        setIsModalVisible(false);
        makeOrder();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [isdeliveryModalVisible, setIsdeliveryModalVisible] = useState(false);
    const showdeliveryModal = () => {
        setIsdeliveryModalVisible(true);
    };    
    const handledeliveryOk = () => {
        setIsdeliveryModalVisible(false);
    };
    const handledeliveryCancel = () => {
        setIsdeliveryModalVisible(false);
    };
    const [ispaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const showPaymentModal = () => {
        setIsPaymentModalVisible(true);
    };
    const handlePaymentOk = () => {
        setIsPaymentModalVisible(false);
    };
    const handlePaymentCancel = () => {
        setIsPaymentModalVisible(false);
    };

    const [isNewDevAddressModalVisible, setIsNewDevAddressModalVisible] = useState(false);
    const showNewDevAddressModal = () => {
        setIsNewDevAddressModalVisible(true);
    };
    const handleDevAddressOk = () => {
        setDeliveryAddressToggle(!deliveryAddressToggle);
        setIsNewDevAddressModalVisible(false);
    };
    const handleDevAddressCancel = () => {
        setIsNewDevAddressModalVisible(false);
    };

    const {id} = useParams();
    const [data, setData] = useState([]);
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
        setUserId(JSON.parse(localStorage.getItem('user')).id);
    }, [id])

    const increase = (index) => {
        const newData = [...data];
        newData[index].compound_count += 1;
        let c_id = newData[index].compound_id;
        let c_count = newData[index].compound_count;
        BasketAPI.updateCompoundCount({id: c_id, newCount: c_count});
        setData(newData);
        toggle();
    };
    
    const decline = (index) => {
        if(data[index].compound_count < 2) return;
        const newData = [...data];
        newData[index].compound_count -= 1;
        let c_id = newData[index].compound_id;
        let c_count = newData[index].compound_count;
        BasketAPI.updateCompoundCount({id: c_id, newCount: c_count});
        if (newData[index].compound_count < 0) {
            newData[index].compound_count = 0;
        }
        setData(newData);
        toggle();
    };
    const totalPrice = () => {
        let sum = data.reduce((acc, el) => acc + el.product_price * el.compound_count , 0);
        return Number(sum.toFixed(2));
    };
    const deleteFromBasket = (index, message) => {
        const newData = [...data]; // Создаем копию массива данных
        let c_id = newData[index].compound_id;
        BasketAPI.deleteCompoundById({id: c_id});
        if(message === null || message === undefined) {
            success('товар успешно удалён из корзины');
        } else {
            success(message);
        }
        newData.splice(index, 1); // Удаляем элемент с указанным индексом из копии массива
        setData(newData); // Обновляем состояние с новым массивом данных
        toggle();
    };
    const makeOrder = async () => {
        try {
          const order_id = id;
          const total_price = totalPrice();
      
          // Обновляем заказ с помощью API
          const updateOrderResponse = await BasketAPI.updateOrder({ id: order_id, price: total_price, payment_id: paymentWay});
          if (updateOrderResponse.status === 200) {
            let addNewDeliveryResponse;
            if(deliveryWay === 1) {
                addNewDeliveryResponse = await BasketAPI.addDeliveryReq({user_address_id: null,shop_address_id: deliveryAddressId, order_id: order_id});
            }
            else if (deliveryWay === 2) {
                addNewDeliveryResponse = await BasketAPI.addDeliveryReq({user_address_id: deliveryAddressId,shop_address_id: null, order_id: order_id});
            }
            else {
            }
            if (addNewDeliveryResponse.status === 200) {
                success(updateOrderResponse.data);
                orderToggle();
                navigate(`/profile/${userId}`);
            }
          }
          window.print();
          //const addNewDeliveryResponse = await BasketAPI.addDeliveryReq({user_address_id: deliveryAddressId  ,shop_address_id: null, order_id: order_id});
      
        } catch (error) {
          console.error(error);
          errorm(error.response.data);
        }
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
    data.forEach((product, index) => {
        fetchPhotoUrl(product.product_id);
        if(product.product_quantity === 0)
            {
                deleteFromBasket(index, `Товар ${product.product_name} был удалён из корзины, так как он кончился на складе`);
            }
    });
}, [data]);

    return(
        <div className="basket-container">
            {contextHolder}
            <h1>Корзина</h1>
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
                            <Button onClick={() => decline(index)} style={{border: "0px"}} icon={<MinusOutlined />} />
                            <InputNumber controls={false} style={{border: "0px"}} min={1} max={product.product_quantity} value={product.compound_count}/>
                            <Button onClick={() => increase(index)} style={{border: "0px"}} icon={<PlusOutlined />} />
                        </ButtonGroup>
                        </div>
                        <div className="product-price">
                            <h3>
                                {product.product_price} р.
                            </h3>
                            <div className="buttons-control">
                                <HeartOutlined className="control-button" />
                                <DeleteOutlined onClick={() => deleteFromBasket(index)} className="control-button" />
                            </div>
                        </div>
                    </div>
                     ))}
                </div>
                <div className="basket-sedibar">
                    <div className="delivery">
                        <p onClick={showdeliveryModal}>Выберите способ доставки</p>
                        <p onClick={showPaymentModal}>Выберите способ оплаты</p>
                    </div>
                    <div className="produtcs-count-and-price">
                        <p>Товары, {data.length} шт.</p>
                        <p>{totalPrice()} рублей</p>
                    </div>
                    <div className="total-price">
                        <h1>Итого:</h1>
                        <h1>{totalPrice()} p.</h1>
                    </div>
                    <div className="button-get-order">
                        <Button onClick={showModal} size="large">Заказать</Button>
                    </div>
                </div>
            </form>
            :
            <div className="emptyBasket"><h1>Ваша корзина пуста</h1></div>


            }
            <Modal
                title={`Чек №${id}`}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                closable={false}
                footer={[
                    <NoPrint><Button key="submit" type="primary" onClick={makeOrder}>
                        Заказать
                    </Button>,
                    <Button key="back" onClick={handleCancel}>
                        Отмена
                    </Button>
                    </NoPrint>
                ]}

            >
                <Report items={data} total={totalPrice()} paymentWayId={paymentWay} deliveryWay={deliveryWay} deliveryAddressId={deliveryAddressId} />

            </Modal>
            <Modal
                title={`Способ доставки`}
                open={isdeliveryModalVisible}
                onOk={handledeliveryOk}
                onCancel={handledeliveryCancel}
                footer={[]}
                closable={false}
                width={"800px"}

            >
                <Radio.Group onChange={onChangeDeliveryWay} value={deliveryWay}>
                    <Radio value={1}>Самовывоз</Radio>
                    <Radio value={2}>Доставкой</Radio>
                </Radio.Group> <br />
                {deliveryWay === 1?
                 <div className="pickup">
                    
                    <p>Адрес самовывоза:</p>
                    <Select onChange={onChangeShopDeliveryAddressId} style={{width: "500px"}}>
                        {pickupPoints.map(e => (
                        <Option value={e.id}>{e.address}</Option>
                        ))}
                    </Select>

                 </div>
                 :
                  <div className="delivery-aa">
                    <Radio.Group style={{display: "flex", flexDirection: "column", width: "100%"}} onChange={onChangeDeliveryAddressId} value={deliveryAddressId}>
                        {deliveryAddress.map(e => (
                            <div className="Redal">
                                <Radio style={{width: '100%'}} value={e.id}><DeliveryAddressCard devaddress={e}/></Radio>
                            </div>
                        ))}
                    </Radio.Group>
                    <Button style={{margin: "0 0 20px 0"}} type="link" onClick={showNewDevAddressModal}>добавить адрес доставки</Button>
                    <ModalAddDeliveryAddress visible={isNewDevAddressModalVisible} onOk={handleDevAddressOk} onClose={handleDevAddressCancel} />
                  </div>
                  }
            </Modal>
            <Modal
                title={`Способ оплаты`}
                open={ispaymentModalVisible}
                onOk={handlePaymentOk}
                onCancel={handlePaymentCancel}
                footer={[]}
                closable={false}
            >
                <Radio.Group onChange={onChangePaymentWay} value={paymentWay}>
                    <Radio value={1}>Наличными при получении</Radio>
                    <Radio value={2}>Картой при получении</Radio>
                </Radio.Group>
            </Modal>
        </div>
        )
}
