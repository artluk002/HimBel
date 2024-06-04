import React, {useState, useEffect} from "react";
import "./CatalogCard.modul.scss";
import { Link } from "react-router-dom";
import { FiDelete } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import { CatalogAPI, PhotoAPI } from "../api/api";
import { Card,
        Empty,
        Button,
        message,
        Modal,
        Form,
        Input,
        Select } from 'antd';
const { Meta } = Card;
const { Option } = Select;

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

export const CatalogCard = (props) => {
    // modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [mainTypes, setMainTypes] = useState([]);
    const [image, setImage] = useState('');
    const showEditModal = () => {

        setIsEditModalOpen(true);
    };
    const handleEditOk = () => {
        setIsEditModalOpen(false);
    };
    const handleEditCancel = () => {
        setIsEditModalOpen(false);
    };
    const showDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };
    const handleDeleteOk = async () => {
        try{
            await CatalogAPI.deleteTypeById(props.item.id).then(res => {
                if(res.status === 200){
                    success(res.data);
                    window.location.reload();                    
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
    // User status
    const [userStatus, setUserStatus] = useState('');

    useEffect(() => {
        const status = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).status : '';
        setUserStatus(status);
        CatalogAPI.typesReq().then(e => {setMainTypes(e.data)});
    }, [])
    useEffect(() => {
        PhotoAPI.getPhotoForCatalog({id: props.item.id}).then(e => {
            if(e.data && e.data[0].photoUrl) {
                setImage(`http://localhost:3300/${e.data[0].photoUrl}`)
            }
            else
            setImage(null);
        })
    }, [props.item.id]);
    const onFinish = async (values) => {
        try{
            if(values.subtype_id === undefined){
                values.subtype_id = null;
            }
            const id = props.item.id;
            console.log(values.subtype_id)
            const name = values.name;
            const subtype_id = values.subtype_id;
            await CatalogAPI.updateTypeByIdReq({id, name, subtype_id}).then(res => {
                if(res.status === 200) {
                    window.location.reload();
                    success(res.data);
                } else{
                    errorm(res.data);
                }
            });
        } catch (err){
            console.error('Ошибка дабавления типа: ', err);
            errorm(err);
        }
      };
    return (
        <div className="card-container">
            {contextHolder}
                <Card className="card" 
                style={{
                    width: '100%',
                    minHeight: '400px',
                }}
                hoverable
                cover={<Link to={`/catalog/${props.item.id}`}>{image ? (<img style={{maxHeight: "500px", minHeight: '500px', minWidth: '500px', maxWidth: '500px'}} src={image}/>) : (<Empty style={{maxHeight: "500px", minHeight: '500px', minWidth: '500px', maxWidth: '500px'}} />)}</Link>}
                >
                    <div className="card-inner-container">
                    <Link to={`/catalog/${props.item.id}`}><Meta title={props.item.name} /></Link>
                        {userStatus === 'admin' && (
                        <div className="card-buttons">
                            <Button className="edit-button" type='primary' onClick={showEditModal} icon={<LiaEdit />}></Button>
                            <Button className="delete-button" onClick={showDeleteModal} danger icon={<FiDelete />}></Button>
                        </div>
                        )}
                    </div>
                </Card>
                <Modal
                    title="Изменения" 
                    open={isEditModalOpen} 
                    onOk={handleEditOk} 
                    onCancel={handleEditCancel}
                    footer={null}
                >
                    <Form
                        {...formItemLayout}
                        variant="filled"
                        onFinish={onFinish}
                        style={{
                        maxWidth: 600,
                        }}
                        initialValues={{name: props.item.name, subtype_id: props.item.subtype_id}}
                    >
                        <Form.Item
                        label="Название"
                        name="name"
                        rules={[
                            {
                            required: true,
                            message: 'Please input!',
                            },
                        ]}
                        >
                        <Input />
                        </Form.Item>

                        <Form.Item
                            label="Подтип типа"
                            name="subtype_id"
                        >
                            <Select allowClear>
                                {mainTypes.map(e => (
                                    <Option value={e.id}>{e.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                        wrapperCol={{
                            offset: 6,
                            span: 16,
                        }}
                        >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="Уверены, что хотите удалить тип?" 
                    open={isDeleteModalOpen} 
                    onOk={handleDeleteOk} 
                    onCancel={handleDeleteCancel}
                    closable={false}
                >
                </Modal>
        </div>
        )
}