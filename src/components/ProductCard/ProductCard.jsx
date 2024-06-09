import React, {useState, useEffect, useContext} from "react";
import "./ProductCard.modul.scss";
import { FiDelete } from "react-icons/fi";
import { FcDataRecovery } from "react-icons/fc";
import { Link } from "react-router-dom";
import { CatalogAPI, PhotoAPI } from "../api/api";
import { Card,
        Button,
        message,
        Modal,
        Empty
        } from 'antd';
import { MyContext } from "../MyContext/MyContext";
const { Meta } = Card;

export const ProductCard = (props) => {
    const { deletedProductsToggle } = useContext(MyContext);
    // modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const showDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };
    const handleDeleteOk = async () => {
        try{
            await CatalogAPI.deleteProductById(props.product.id).then(res => {
                if(res.status === 200){
                    success(res.data);
                    window.location.reload();       /////             
                }
                else {
                    errorm(res.data);
                }
            });
        } catch (err) {
            console.error('Ошибка при удалении элемента: ', err);
            errorm(err);
        }
        setIsDeleteModalOpen(false);
    };
    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
    };
    const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
    const showRecoveryModal = () => {
        setIsRecoveryModalOpen(true);
    };
    const handleRecoveryOk = async () => {
        try{
            await CatalogAPI.recoveryProductById({id: props.product.id}).then(res => {
                if(res.status === 200){
                    success(res.data);
                    deletedProductsToggle();       /////             
                }
                else {
                    errorm(res.data);
                }
            });
        } catch (err) {
            console.error('Ошибка при удалении элемента: ', err);
            errorm(err);
        }
        setIsRecoveryModalOpen(false);
    };
    const handleRecoveryCancel = () => {
        setIsRecoveryModalOpen(false);
    };
    // User status
    const [userStatus, setUserStatus] = useState('');

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
        const status = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).status : '';
        setUserStatus(status);
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

    return(
        <div className="card-container">
            {contextHolder}
            <Card className="card"
            hoverable

            cover={<Link to={`/product/${props.product.id}`}>{imageUrl ? (<img style={{maxHeight: "500px", minHeight: '500px', minWidth: '500px', maxWidth: '500px'}} alt={props.product.name} src={imageUrl}/>) : (<Empty style={{maxHeight: "500px", minHeight: '500px', minWidth: '500px', maxWidth: '500px'}}/>)}</Link>}
            >
                <div className="card-inner-container">
                    <Link to={`/product/${props.product.id}`}><Meta style={metaStyle} title={props.product.name} description={(<div>{props.product.price} p., Рейтинг: {props.product.raiting}</div>)}/></Link>
                    {userStatus === 'admin' && (
                            <div className="card-buttons">
                                {props.product.is_active === 1 ? (
                                    <Button className="delete-button" title='Удалить продукт' onClick={showDeleteModal} danger icon={<FiDelete />}></Button>
                                )
                                :
                                (
                                    <Button className="delete-button" title='Восстановить продукт' onClick={showRecoveryModal} icon={<FcDataRecovery />}></Button>
                                )
                                }
                            </div>
                            )}
                </div>
            </Card>
            <Modal
                    title="Уверены, что хотите удалить продукт?" 
                    open={isDeleteModalOpen} 
                    onOk={handleDeleteOk} 
                    onCancel={handleDeleteCancel}
                    closable={false}
                >
            </Modal>
            <Modal
                    title="Уверены, что хотите востановить продукт?" 
                    open={isRecoveryModalOpen} 
                    onOk={handleRecoveryOk} 
                    onCancel={handleRecoveryCancel}
                    closable={false}
                >
            </Modal>  
        </div>
        )
}