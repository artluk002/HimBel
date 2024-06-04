import React, {useState, useEffect} from "react";
import "./MainPage.modul.scss";
import { CatalogCard } from "../CatalogCard/CatalogCard";
import { CatalogAPI } from "../api/api";

import { FloatButton, 
    Modal,
    Button,
    Form,
    Input,
    Select,
    message } from 'antd';
import { IoAddSharp } from "react-icons/io5";
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

export const  MainPage = () => {
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
    // API
    const [types, setTypes] = useState([]);
    const [mainTypes, setMainTypes] = useState([]);

    // User status
    const [userStatus, setUserStatus] = useState('');
    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleOk = () => {
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };

    useEffect(() => {
        const status = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).status : '';
        setUserStatus(status);

        CatalogAPI.typesForMainReq().then(e => {setTypes(e.data)});
        CatalogAPI.typesReq().then(e => {setMainTypes(e.data)});
    }, [])
    const onFinish = async (values) => {
        try{
            if(values.subtype_id === undefined){
                values.subtype_id = null;
            }
            await CatalogAPI.appTypeReq(values).then(res => {
                if(res.status === 200) {
                    success(res.data);
                    CatalogAPI.typesForMainReq().then(e => {setTypes(e.data)});
                    setIsModalOpen(false);
                } else{
                    errorm(res.data);
                }
            });
        } catch (err){
            console.error('Ошибка дабавления типа: ', err);
            errorm(err);
        }
      };

    return(
        <div className="main-page">
            {contextHolder}
            {types.map((type) => (
                <CatalogCard item={type}/>
            ))}
             {userStatus === 'admin' && (
                <FloatButton icon={<IoAddSharp />} onClick={showModal} tooltip={<div>Add new type</div>} />
            )}
            <Modal
                title="Add new type"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                closable={false}
            >
                <Form
                    {...formItemLayout}
                    variant="filled"
                    onFinish={onFinish}
                    style={{
                    maxWidth: 600,
                    }}
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
        </div>
        )
}