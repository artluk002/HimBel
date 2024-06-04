import React, { useEffect, useState } from "react";
import "./Reviews.modul.scss";
import { useParams } from "react-router-dom";
import { CatalogAPI, ReviewsAPI } from "../api/api";
import { Rate, Avatar, Modal, Button, Form, Input, message} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FiDelete } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import moment from 'moment'; // moment.js для форматирования даты
const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 14,
      },
    },
  };
export const Reviews = () => {
    //API
    const {id} = useParams();
    const [productInfo, setProductInfo] = useState();
    const [reviewsInfo, setReviewsInfo] = useState([]);
    const [userId, setUserId] = useState();
    const [reviewsToggle, setReviewsToggle] = useState(false);
    const [reviewIdForDelete, setReviewIdForDelete] = useState();
    useEffect(() => {
        CatalogAPI.getShortProductInfoReq({id: id}).then((e) => {setProductInfo(e.data)});
        ReviewsAPI.getReviewsInfoReq({id: id}).then((e) => {setReviewsInfo(e.data)});
        JSON.parse(localStorage.getItem('user')) !== null?  setUserId(JSON.parse(localStorage.getItem('user')).id): setUserId(null);
    } , [id, reviewsToggle]);

    const UnixDateToNormalDate = (unixDate) => {
        const timestampInMilliseconds = unixDate;
        const formattedDate = moment(timestampInMilliseconds).isValid() 
          ? moment(timestampInMilliseconds).format('DD-MM-YYYY HH:mm:ss') 
          : 'Invalid date';
        return  formattedDate;
    }
    //modal
    const [form] = Form.useForm();
    const [isNewReviewModalVisible, setIsNewReviewModalVisible] = useState(false);
    const showNewReviewModal = () => {
        setIsNewReviewModalVisible(true);
    }
    const handleNewReviewOk = () => {
        setIsNewReviewModalVisible(false);
    }
    const handleNewReviewCancel = () => {
        setIsNewReviewModalVisible(false);
    }
    const onFinishNewReview = async (values) => {
        try{
            const response = await ReviewsAPI.addNewReview({ product_id: id, user_id: userId, title: values.title, text: values.description, rating: values.rating });
            if (response.status === 200){
                success(response.data);
                setReviewsToggle(!reviewsToggle);
                setIsNewReviewModalVisible(false);
            }
            else {
                errorm(response.data);
            }
        } catch (e) {
            errorm(e);
        }

    }
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [RFE, setRFE] = useState(null);
    const [TFE, setTFE] = useState(null);
    const [DFE, setDFE] = useState(null);
    const [idFE, seIdFE] = useState(null);
    const showEditModal = (e_raiting, e_title, e_description, e_id) => {
        setRFE( e_raiting);
        setTFE( e_title);
        setDFE( e_description);
        seIdFE(e_id)
        setIsEditModalOpen(true);
    };
    const handleEditOk = () => {
        setIsEditModalOpen(false);
    };
    const handleEditCancel = () => {
        setIsEditModalOpen(false);
    };
    const onFinishEditReview = async (values) => {
        try {
            const response = await ReviewsAPI.updateReviewReq({id: idFE, title: values.title_edit, text: values.description_edit, rating: values.rating_edit});
            if(response.status === 200) {
                success(response.data);
                setReviewsToggle(!reviewsToggle);
                setIsEditModalOpen(false);
            }
            else {
                errorm(response.data);
            }
        } catch (err) {
            console.error('Ошибка при удалении элемента: ', err);
            errorm(err);    
        }

    }
    const showDeleteModal = (review_id) => {
        setReviewIdForDelete(review_id);
        setIsDeleteModalOpen(true);
    };
    const handleDeleteOk = async () => {
        try{
            const response = await ReviewsAPI.deleteReview(reviewIdForDelete);
            if (response.status === 200){
                success(response.data);
                setReviewsToggle(!reviewsToggle);
            }
            else {
                errorm(response.data);
            }
        } catch (err) {
            console.error('Ошибка при удалении элемента: ', err);
            errorm(err);
        }
        setIsDeleteModalOpen(false);
    };
    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
    };
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


    return (
        <div className="reviews-container">
            {contextHolder}
            <div className="product-info-for-review-div">
                <h1>Отзывы о {productInfo? productInfo[0].name : ''}</h1>
                <div className="product-raiting-div">
                    <Rate allowHalf disabled value={productInfo? productInfo[0].raiting : ''}/>
                    <p>{reviewsInfo.length} отзывов</p>
                </div>
                <p>{productInfo? productInfo[0].description : ''}</p>
            </div>
            
            {reviewsInfo.map((review) => 
            <div className="product-reviews">
                <div className="user-review">
                    <div className="user-review-info">
                        <Avatar size={64} icon={<UserOutlined />} />
                        <h3>{review.first_name}</h3>
                        <h4>{UnixDateToNormalDate(review.review_date)}</h4>
                        <Rate style={{marginLeft: "20px"}} allowHalf disabled value={review.review_rating}/>
                        {userId === review.user_id && (
                        <div className="card-buttons-reviews">
                            <Button className="edit-button" type='primary' onClick={() => showEditModal(review.review_rating, review.review_title, review.review_description, review.review_id)} icon={<LiaEdit />}></Button>
                            <Button style={{marginLeft: "10px"}} onClick={() => showDeleteModal(review.review_id)} danger icon={<FiDelete />}></Button>
                        </div>
                        )}
                    </div>
                    <div className="review-info">
                        <h2>{review.review_title}</h2>
                        <p>
                          {review.review_description}
                        </p>
                    </div>
                </div>
            </div>
            )}
            <div className="make-review-btn">
                <Button title="Оставить отзыв" onClick={showNewReviewModal} size="large" type="primary">Оставить отзыв</Button>
            </div>
            <Modal
                title="Добавить новый отзыв"
                open={isNewReviewModalVisible}
                onOk={handleNewReviewOk}
                onCancel={handleNewReviewCancel}
                footer={null}
                closable={false}
                >
                <Form
                    {...formItemLayout}
                    variant="filled"
                    form={form}
                    onFinish={onFinishNewReview}
                    style={{
                    maxWidth: 600,
                    }}
                >
                    <div
                        style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: 8,
                        width: '100%',
                        }}
                    >
                        <Form.Item
                            name='rating'
                            rules={[{ required: true, message: 'поставьте рейтинг товару' }]}
                            style={{ width: '100%' }}
                            wrapperCol={{ offset: 0, span: 24 }}
                        >
                            <Rate allowHalf/>
                        </Form.Item>
                            <div
                                style={{ display: 'flex',
                                width: '100%',
                                flexDirection: 'row',  }}
                                wrapperCol={{
                                offset: 0,
                                span: 12,
                                }}
                            >
                        <Form.Item
                            name='title'
                            style={{ width: '100%' }}
                            wrapperCol={{
                            offset: 0,
                            span: 24,
                            }}
                        >
                            <Input
                                placeholder='Заголовок'
                                title='Заголовок'
                                style={{ width: "100%" }}                
                            />
                        </Form.Item>
                    </div>
                    <div
                        style={{ display: 'flex',
                        width: '100%',
                        flexDirection: 'row',  }}
                        wrapperCol={{
                            offset: 0,
                            span: 24,
                        }}
                    >
                        <Form.Item
                            name='description'
                            style={{ width: '100%' }}
                            wrapperCol={{
                                offset: 0,
                                span: 24,
                            }}
                        >
                            <Input.TextArea
                                placeholder='Описание'
                                title='Описание'
                                style={{ width: "100%" }}                  
                            />
                        </Form.Item>
                    </div>
                </div>
                    <Form.Item
                        wrapperCol={{
                            offset: 10,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Отправить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Изменить отзыв"
                open={isEditModalOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                footer={null}
                closable={false}
                >
                <Form
                    {...formItemLayout}
                    variant="filled"
                    onFinish={onFinishEditReview}
                    style={{
                    maxWidth: 600,
                    }}
                    initialValues={{rating_edit: RFE, title_edit: TFE, description_edit: DFE}}
                >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginBottom: 8,
                                width: '100%',
                            }}
                            >
                            <Form.Item
                        name='rating_edit'
                        rules={[{ required: true, message: 'поставьте рейтинг товару' }]}
                        style={{ width: '100%' }}
                        wrapperCol={{ offset: 0, span: 24 }}
                    >
                        <Rate allowHalf />
                    </Form.Item>
                                <div
                                    style={{ display: 'flex',
                                            width: '100%',
                                            flexDirection: 'row',  }}
                                    wrapperCol={{
                                        offset: 0,
                                        span: 12,
                                    }}
                                >
                                    <Form.Item
                                        name='title_edit'
                                        style={{ width: '100%' }}
                                        wrapperCol={{
                                            offset: 0,
                                            span: 24,
                                        }}
                                    >
                                        <Input
                                        placeholder='Заголовок'
                                        title='Заголовок'
                                        style={{ width: "100%" }}
                                        
                                        />
                                    </Form.Item>
                                </div>
                                <div
                                    style={{ display: 'flex',
                                    width: '100%',
                                    flexDirection: 'row',  }}
                                    wrapperCol={{
                                        offset: 0,
                                        span: 24,
                                    }}
                                >
                                    <Form.Item
                                        name='description_edit'
                                        style={{ width: '100%' }}
                                        wrapperCol={{
                                            offset: 0,
                                            span: 24,
                                        }}
                                    >
                                        <Input.TextArea

                                        placeholder='Описание'
                                        title='Описание'
                                        style={{ width: "100%" }}                  
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                    <Form.Item
                    wrapperCol={{
                        offset: 10,
                        span: 16,
                    }}
                    >
                    <Button type="primary" htmlType="submit">
                        Изменить
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Уверены, что хотите удалить отзыв?" 
                open={isDeleteModalOpen} 
                onOk={handleDeleteOk} 
                onCancel={handleDeleteCancel}
                closable={false}
            >
            </Modal>
        </div>
    )
}