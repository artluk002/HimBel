import React, { useState } from "react";
import "./ModalAddDeliveryAddress.modal.scss";
import  {MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Input, Form, Button, message, Dropdown, Menu } from "antd";
import { BasketAPI } from "../api/api";
import { Basket } from "../Basket/Basket";

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

  const largeCities = ["Минск", "Мінск", "Гомель", "Гомель", "Могилев", "Магілёў", "Витебск", "Віцебск", "Гродно", "Гродна", "Брест", "Брэст"];

export const ModalAddDeliveryAddress = ({visible, onOk, onClose}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownItems, setDropdownItems] = useState([]);
    const [form] = Form.useForm();
    const [deliveryPrice, setDeliveryPrice] = useState(0);
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
        const fetchAddress = async (address) => {
            try {
              const response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=tXazmhSoBMOneeu9JmNz7qvSsFl9IuermfuTmX3CWqs`);
              const data = await response.json();
              if (data.items && data.items.length > 0) {
                setDropdownItems(data.items);
                setDropdownVisible(true);
              } else {
                setDropdownItems([]);
                setDropdownVisible(false);
              }
            } catch (err) {
              console.error('Ошибка получения адреса: ', err);
              errorm(err.message);
            }
          };
        
          const onFinishAddDevAddress = async (values) => {
            try {
              const userId = JSON.parse(localStorage.getItem('user')).id;
              const response = await BasketAPI.addUserAddress({address: values.address, name: values.name, surname: values.surname, email: values.email, phone: values.phone, user_id: userId, price: deliveryPrice});
              if (response.status === 200) {
                form.resetFields(); 
                success(response.data);
                onOk();
              }
              else{
                errorm(response.message);
            }
              /*values.address += ' Беларусь';
              fetchAddress(values.address);*/
            } catch (err) {
              console.error('Ошибка добавления типа: ', err);
              errorm(err);
            }
          };
        
          const handleAddressChange = (event) => {
            const address = event.target.value;
            if (address) {
              fetchAddress(address);
            } else {
              setDropdownVisible(false);
            }
          };
        
          const handleDropdownSelect = (item) => {
            if( item.address.countryName !== 'Беларусь') {
                errorm('Доставка осуществляется только в Беларусь. Пожалуйста, выберите другой адрес.');

                return;
            }
            form.setFieldsValue({ address: item.address.label });
            setDropdownVisible(false);

            const city = item.address.city;
            if (largeCities.includes(city)) {
                setDeliveryPrice(5);
            console.log(`Selected address is in a large city: ${city}`);
            } else {
                setDeliveryPrice(5);
            console.log(`Selected address is not in a large city: ${city}`);
            }
          };
          const dropdownMenu = (
            <Menu>
              {dropdownItems.map((item, index) => (
                <Menu.Item key={index} onClick={() => handleDropdownSelect(item)}>
                  {item.address.label}
                </Menu.Item>
              ))}
            </Menu>
          );
    return(
        <Modal
      title="Добавить адрес доставки"
      open={visible}
      onOk={onOk}
      onCancel={onClose}
      footer={null}
      closable={false}
    >
      {contextHolder}
      <Form
        {...formItemLayout}
        variant="filled"
        form={form}
        onFinish={onFinishAddDevAddress}
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
            name='address'
            rules={[{ required: true, message: 'Введите адрес доставки' }]}
            style={{ width: '100%' }}
            wrapperCol={{ offset: 0, span: 24 }}
          >
            <Dropdown overlay={dropdownMenu} visible={dropdownVisible}>
              <Input
                placeholder='Адрес доставки'
                title='Адрес доставки'
                style={{ width: "100%" }}
                onChange={handleAddressChange}
              />
            </Dropdown>
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
                            name='surname'
                            style={{ width: '100%' }}
                            wrapperCol={{
                                offset: 0,
                                span: 23,
                            }}
                        >
                            <Input
                            placeholder='Фамилия'
                            title='Фамилия'
                            style={{ width: "100%" }}
                            
                            />
                        </Form.Item>
                        <Form.Item
                            name='name'
                            style={{ width: '100%' }}
                            wrapperCol={{
                                offset: 0,
                                span: 24,
                            }}
                        >
                            <Input
                            placeholder='Имя'
                            title='Имя'
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
                            name='phone'
                            style={{ width: '100%' }}
                            wrapperCol={{
                                offset: 0,
                                span: 24,
                            }}
                        >
                            <Input
                            placeholder='Номер телефона'
                            title='Номер телефона'
                            style={{ width: "100%" }}                  
                            />
                        </Form.Item>
                    </div>
                    <Form.Item
                            name='email'
                            style={{ width: '100%' }}
                            wrapperCol={{
                                offset: 0,
                                span: 24,
                            }}
                        >
                            <Input
                            placeholder='email'
                            title='почтовый адрес'
                            style={{ width: "100%" }}                  
                            />
                        </Form.Item>
                </div>
        <Form.Item
          wrapperCol={{
            offset: 10,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    )
}