import React, {useState, useEffect} from 'react';
import  {MinusCircleOutlined, PlusOutlined, UserOutlined , DeleteOutlined } from '@ant-design/icons';
import "./Profile.modul.scss";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { IoAddSharp } from "react-icons/io5";
import { BasketAPI, CatalogAPI } from '../api/api';
import {ProfileOrderCard} from "../ProfileOrderCard/ProfileOrderCard";
import {DeliveryAddressCard} from "../DeliveryAddressCard/DeliveryAddressCard";
import {ModalAddDeliveryAddress} from "../ModalAddDeliveryAddress/ModalAddDeliveryAddress";
import { Avatar,
    Typography,
    Row,
    Col, 
    Divider, 
    Button, 
    Modal, 
    FloatButton,
    Form, 
    Input, 
    Select,
    Space,
    message,
   } from 'antd';

const { Title, Text } = Typography;

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

export const Profile = () => {
  const [form] = Form.useForm();
  const [deliveryAddress, setDeliveryAddress] = useState([]);
  const [deliveryAddressToggle, setDeliveryAddressToggle] = useState(false);
  const [tableCharacteristics, setTableCharacteristics] = useState([]);
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
    const {id} = useParams();
    const [userStatus, setUserStatus] = useState('');
    const [user, setUser] = useState([]);
    const [orderInfo, setOrderInfo] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const status = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).status : '';
        if (status === 'admin') {
          CatalogAPI.CharacteristicsReq().then(e => {setTableCharacteristics(e.data)})
        }
        setUserStatus(status);
        const userId = JSON.parse(localStorage.getItem('user')).id;
       
        if(id != userId){
            navigate(`/profile/${userId}`);
        } else {
            BasketAPI.getUserOrderInfoByIdReq({id: id}).then(e => {
              setOrderInfo(e.data);
            });
            setDeliveryAddressToggle(!deliveryAddressToggle)
            setUser(JSON.parse(localStorage.getItem('user')));
        }
    }, [id]);
    useEffect(() => {
      BasketAPI.getUserDeliveryInfoReq( {userId: id} ).then(e => {
                 if(e.status === 200) {
                    setDeliveryAddress( e.data );
                }
                });
    }, [deliveryAddressToggle]);
    const leaveFunc = () => {
        localStorage.removeItem("user");
        navigate(`/`);
    };
    // modal add new characteristic
    const [isAddCharModalOpen, setIsAddCharModalOpen] = useState(false);
    const showAddCharModal = () => {
      setIsAddCharModalOpen(true);
    };
    const handleAddCharOk = () => {
      setIsAddCharModalOpen(false);
    };
  
    const handleAddCharCancel = () => {
      setIsAddCharModalOpen(false);
    };
    const onFinishAddChar = async (values) => {
      try{
        //console.log(values)
        console.log(values.characteristics)
        const response = await CatalogAPI.addNewCharacteristcsReq({characteristics: values.characteristics});
        if(response.status === 200) {
          success(response.data);
          await CatalogAPI.CharacteristicsReq().then(e => {setTableCharacteristics(e.data)})
          form.resetFields();
          setIsAddCharModalOpen(false);
        }
        else{
          errorm(response.data);
        }
    } catch (err) {
        console.error('Ошибка дабавления типа: ', err);
        errorm(err);
      }
    }
    // modal delete new characteristic
    const [isDeleteCharModalOpen, setIsDeleteCharModalOpen] = useState(false);
    const showDeleteCharModal = () => {
      setIsDeleteCharModalOpen(true);
    };
    const handleDeleteCharOk = () => {
      setIsDeleteCharModalOpen(false);
    };
  
    const handleDeleteCharCancel = () => {
      setIsDeleteCharModalOpen(false);
    };
    const onFinishDeleteChar = async (values) => {
      try{
        //console.log(values)
        console.log(values.characteristics)
        const response = await CatalogAPI.deleteCharacteristcsReq({characteristics: values.characteristics});
        if(response.status === 200) {
          success(response.data);
          await CatalogAPI.CharacteristicsReq().then(e => {setTableCharacteristics(e.data)})
          values = null;
          setIsDeleteCharModalOpen(false);
          form.resetFields();
        }
        else{
          errorm(response.data);
        }
    } catch (err) {
        console.error('Ошибка дабавления типа: ', err);
        errorm(err);
      }
    }
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
    const deleteDeliveryAddress = async(e) => {

      await BasketAPI.deleteUserAddressById(e.id).then(e => {
        if (e.status === 200) {
            success( e.data );
            setDeliveryAddressToggle( !deliveryAddressToggle );

        }
      });
    }
  return (
    <div className="profile-container">
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col span={24} className="profile-header">
          <Avatar size={64} icon={<UserOutlined />} />
          <Title level={2}>{user.login}</Title>
          <Button onClick={leaveFunc}>Выйти</Button>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Title level={3}><h2>Личная информация</h2></Title>
        </Col>
        <Col span={16}>
            <Title level={3}><h2>Мои заказы</h2></Title>
            
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8} className='profile-personal-info'>
          <div className="profile-user-own-info">
            <div className="p-u-o-i-lables">
              <Text strong>Электронная почта:</Text>
              <Text strong>Имя: </Text>
              <Text strong>Фамилия: </Text>
              <Text strong>Телефон: </Text>
            </div>
            <div className="p-u-o-i-values">
              <Text>{user.email}</Text>
              <Text>{user.name}</Text>
              <Text>{user.surname}</Text>
              <Text>+375{user.phone}</Text>
            </div>
             
          </div>
          <Button type='primary' onClick={showdeliveryModal} >Адреса достаки</Button>
          {userStatus === 'admin' && (
            <div style={{
              display: 'flex', 
              flexDirection: 'row',
              gap: '20px',             
            }}>
              <Link to={`/reports`}><Button type='primary'>Отчёты</Button></Link>
              <Link to={`/deleted-products`}><Button type='primary'>Удалённые товары</Button></Link>
            </div>
          )}
        </Col>
        <Col span={16} style={{padding: "0 20px 0 20px"}} className='profile-orders'>
          {orderInfo.map((order) => (
            <ProfileOrderCard OrderInfo={order}/>
          ))}
        </Col>
      </Row>
      {/* Другие разделы личной информации могут быть добавлены здесь */}
      {userStatus === 'admin' && (
          <FloatButton.Group
            shape="square"
            style={{
              right: 94,
            }}
          >
            <FloatButton icon={<IoAddSharp />} onClick={showAddCharModal} tooltip={<div>Добавить новые характеристики</div>} />
            <FloatButton icon={<DeleteOutlined />} onClick={showDeleteCharModal} tooltip={<div>Удалить характеристики</div>} />
          </FloatButton.Group>
            )}
        <Modal
            title="Добавить характеристики продукта"
            open={isAddCharModalOpen}
            onOk={handleAddCharOk}
            onCancel={handleAddCharCancel}
            footer={null}
            closable={false}
            >
              <Form
              form={form}
              {...formItemLayout}
              variant="filled"
              onFinish={onFinishAddChar}
              style={{
              maxWidth: 600,
              }}
              >
              <Form.List name="characteristics">
                        
                        {(fields, { add, remove }) => (
                            <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                key={key}
                                style={{
                                    display: 'flex',
                                    marginBottom: 8,
                                    justifyContent: "space-around",
                                }}
                                align="baseline"
                                >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'characteristic_name']}
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Missing characteristic name',
                                    },
                                    ]}
                                >
                                    <Input placeholder='название характеристики'
                                    title='Название характеристики'
                                    style={{ width: "300px"}}
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'unit']}
                                    
                                >
                                    <Input placeholder='ед. измерения'
                                    title='Единицы измерения'
                                    style={{ width: "100px"}}/>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item
                            style={{
                              alignSelf: "center", 
                           }}
                           wrapperCol={{
                            offset: 0,
                            span: 24,
                          }}
                            >

                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}
                                style={{width: "100%"}}
                                >
                                Добавить характеристику
                                </Button>
                            </Form.Item>
                            </>
                            )}
                  </Form.List>

                  <Form.Item
                    wrapperCol={{
                        offset: 10,
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
                title={`Способ доставки`}
                open={isdeliveryModalVisible}
                onOk={handledeliveryOk}
                onCancel={handledeliveryCancel}
                footer={[]}
                closable={false}
                width={"800px"}

            >
              <div className="delivery-aa-profile">
                    {deliveryAddress.map(e => (
                        <div className="Redal-profile">
                            <DeliveryAddressCard devaddress={e}/> <MinusCircleOutlined onClick={() => deleteDeliveryAddress(e)} />
                        </div>
                    ))}
                <Button style={{margin: "0 0 20px 0"}} type="link" onClick={showNewDevAddressModal}>добавить адрес доставки</Button>
                <ModalAddDeliveryAddress visible={isNewDevAddressModalVisible} onOk={handleDevAddressOk} onClose={handleDevAddressCancel} />
              </div>
            </Modal>
            <Modal
              title={`Удалить характеристики продукта`}
              open={isDeleteCharModalOpen}
              onOk={handleDeleteCharOk}
              onCancel={handleDeleteCharCancel}
              footer={[]}
              closable={false}
              width={`800px`}
            >
              <Form
              form={form}
              {...formItemLayout}
              variant="filled"
              onFinish={onFinishDeleteChar}
              style={{
              maxWidth: 800,
              }}
              >
              <Form.List name="characteristics">
                        {(fields, { add, remove }) => (
                            <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                key={key}
                                style={{
                                    display: 'flex',
                                    marginBottom: 8,
                                    justifyContent: "space-around",
                                }}
                                align="baseline"
                                >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'characteristic_id']}
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Missing characteristic name',
                                    },
                                    ]}
                                >
                                    <Select style={{ width: "700px" }} >
                                        {tableCharacteristics.map(e => (
                                            <Option value={e.id}>{e.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item
                            style={{
                              alignSelf: "center", 
                           }}
                           wrapperCol={{
                            offset: 0,
                            span: 24,
                          }}
                            >

                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}
                                style={{width: "100%"}}
                                >
                                Добавить характеристику к удалению
                                </Button>
                            </Form.Item>
                            </>
                            )}
                  </Form.List>

                  <Form.Item
                    wrapperCol={{
                        offset: 10,
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
  );
};

