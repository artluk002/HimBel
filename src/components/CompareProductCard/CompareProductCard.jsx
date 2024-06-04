import React, {useState, useEffect} from "react";
import "./CompareProductCard.modul.scss";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { CompareAPI, PhotoAPI } from "../api/api";
import { Card,
        Button,
        message,
        Modal,
        Empty
        } from 'antd';
const { Meta } = Card;

export const CompareProductCard = (props) => {
    // User status
    const [userId, setUserId] = useState();

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
        const u_i = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : '';
        setUserId(u_i);
    }, [])
    // Get photo url
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (props.product.id) {
        fetchPhotoUrl(props.product.id);
        }
    }, [props.product.id]);

    const fetchPhotoUrl = async (productId) => {
        try {
        const response = await PhotoAPI.getPhotoUrlReq(productId);
        if (response.status === 200) {
            let receivedUrl = `http://localhost:3300/${response.data}`;
            setImageUrl(receivedUrl);
        } else {
            setImageUrl(null);
        }
        } catch (error) {
        console.error('Error fetching photo URL:', error);
        setImageUrl(null);
        }
    };
    const metaStyle = {
        // Пропишите стиль для переноса слов
        wordWrap: 'break-word', // Или 'overflowWrap: 'break-word', в зависимости от браузеров, которые вы хотите поддерживать
        width: '100%'
    };
    const deleteProducFromCompare = async () => {
        
        try {
            const response = await CompareAPI.deleteProductFromCompareReq({productId: props.product.id, userId: userId});
            if (response.status === 200) {
                props.onProductDelete(response.data);
            }
            else {
                errorm(response.data)                
            }
        }
        catch (error) {
            console.error(error)
            errorm('При попытке удаления произошла ошибка')
        }
        
    }
    return(
        <div className="card-container">
            {contextHolder}
            <Card className="card"
            hoverable

            cover={<Link to={`/product/${props.product.id}`}>{imageUrl ? (<img alt={props.product.name} src={imageUrl}/>) : (<Empty />)}</Link>}
            >
                <div className="card-inner-container">
                    <Link to={`/product/${props.product.id}`}><Meta style={metaStyle} title={props.product.name} description={(<div>{props.product.price} p., Рейтинг: {props.product.raiting}</div>)}/></Link>
                    <Button style={{position: "absolute", top: "0", right: "0", border: "0px"}} onClick={deleteProducFromCompare} icon={<CloseOutlined />}></Button>
                </div>
            </Card>  
        </div>
        )
}