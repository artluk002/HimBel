import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import "./Catalog.modul.scss";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ProductCard } from "../ProductCard/ProductCard";
import { CatalogAPI } from "../api/api";
import { IoAddSharp } from "react-icons/io5";
import { FloatButton, 
    Modal,
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    message,
    Space , } from 'antd';
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

export const Catalog = () => {
    // API
    const {id} = useParams();
    const [products, setProducts] = useState([]);
    const [characteristics, setCharacteristics] = useState([]);
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

        CatalogAPI.productsForCatalogReq(id).then(e => {setProducts(e.data)})
        CatalogAPI.CharacteristicsReq().then(e => {setCharacteristics(e.data)})
    }, [id]);
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

      const [unitValues, setUnitValues] = useState({});

    const handleCharacteristicChange = (value, name) => {
        const characteristic = characteristics.find(e => e.id === value);
        if (characteristic) {
        setUnitValues(prevState => ({
            ...prevState,
            [name]: characteristic.unit
        }));
        }
    };

    const onFinish = async (values) => {
        try{
            const name = values.name;
            const price = values.price;
            const description = values.description;
            const product_characteristics = values.product_characteristics;
            const type_id = id;
            await CatalogAPI.addNewProductReq({name, price, description, product_characteristics, type_id}).then(res => {
                if(res.status === 200) {
                    success(res.data)
                    CatalogAPI.productsForCatalogReq(id).then(e => {setProducts(e.data)})
                    setIsModalOpen(false)
                }
                else{
                    errorm(res.data);
                }
            })
        } catch (err) {
            console.error('Ошибка дабавления типа: ', err);
            errorm(err);
        }
      };
    return (
        <div className="catalog-container">
            {contextHolder}
            {products.map((product) =>(
                <ProductCard product={product}/>
                ))}
                {userStatus === 'admin' && (
                <FloatButton icon={<IoAddSharp />} onClick={showModal} tooltip={<div>Add new product</div>} />
            )}
            <Modal
                title="Add new product"
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
                        message: 'Please input name!',
                        },
                    ]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                        label="Цена"
                        name="price"
                        rules={[
                            {
                            required: true,
                            message: 'Please input price!',
                            },
                        ]}
                    >
                        <InputNumber controls={false} />
                    </Form.Item>

                    <Form.Item
                        label="Описание"
                        name="description"
                        rules={[{ required: true, message: 'Please input description!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    

                    <Form.List name="product_characteristics">
                        
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
                                    <Select style={{ width: 220 }} onChange={value => handleCharacteristicChange(value, name)}>
                                        {characteristics.map(e => (
                                            <Option value={e.id}>{e.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'value']}
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Missing characteristic value',
                                    },
                                    ]}
                                >
                                    <InputNumber controls={false} />
                                </Form.Item>
                                <Form.Item
                                {...restField}
                                name={[name, 'unit']}
                                >
                                    <Input readOnly={true} placeholder={unitValues[name]} value={unitValues[name]}/>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item
                            style={{
                               alignSelf: "center", 
                            }}
                            wrapperCol={{
                                offset: 6,
                                span: 14,
                            }}
                            >

                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}
                                >
                                Add characteristic
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
        )
}