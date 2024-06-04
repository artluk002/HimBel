import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "./Product.modul.scss";
import { BasketAPI, CatalogAPI, CompareAPI, PhotoAPI } from "../api/api";
import { LiaEdit } from "react-icons/lia";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { IoAddSharp } from "react-icons/io5";
import { Image,
         Rate,
         InputNumber,
         Button,
         Table,
         Card,
         Form,
         Input,
         Select,
         message,
         Space,
         Modal,
         Upload,
         Empty,
         List
         } from 'antd';
import { MyContext } from "../MyContext/MyContext";
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

export const Product = () => {
  const { toggle } = useContext(MyContext);
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState(1);
  const handleInputChange = (value) => {
    setInputValue(value); // Обновляем состояние при изменении значения в InputNumber
  };
  // API
  const {id} = useParams();
  const [product, setProduct] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [tableCharacteristics, setTableCharacteristics] = useState([]);
  const [characteristicsForList, setCharacteristicsForList] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [basket, setBasket] = useState();
  const [userId, setUserId] = useState(null);
  const [productInFavorites, setProductInFavorites] = useState('');
  const [productInCompare, setProductInCompare] = useState('');
  const [productInOrder, setProductInOrder] = useState('');
  // User status
  const [userStatus, setUserStatus] = useState('');
  
      const columns = [
        {
          title: 'Свойство',
          dataIndex: 'property',
        },
        {
          title: 'Значения',
          dataIndex: 'value',
        },
        {
            title: 'Единица измерения',
            dataIndex: 'unit',
        },
      ];
     // Обработка данных о характеристиках и формирование массива объектов для таблицы
    const data = characteristics.map((char, index) => ({
      key: index.toString(),
      property: char.characteristic,
      value: char.value,
      unit: char.unit
    }));
    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showEditModal = () => {
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
        const tablecharacteristic = tableCharacteristics.find(e => e.id === value);
        if (tablecharacteristic) {
        setUnitValues(prevState => ({
            ...prevState, 
            [name]: tablecharacteristic.unit
        }));
        }
    };
    // characteristics modal
    const [isCharModalOpen, setIsCharModalOpen] = useState(false);
    const showCharModal = () => {
      setIsCharModalOpen(true);
    };
    const handleCharOk = () => {
      setIsCharModalOpen(false);
    };
  
    const handleCharCancel = () => {
      setIsCharModalOpen(false);
    };
    // add characteristics modal
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
        let u_i;
        if(JSON.parse(localStorage.getItem('user')) !== null) {
          const user_id = JSON.parse(localStorage.getItem('user')).id;
          u_i = user_id;
          setUserId(user_id);
        }
        
        CatalogAPI.productDetailsReq(id).then(e => {setProduct(e.data[0])})
        CatalogAPI.productCharacteristicsReq(id).then(e => {setCharacteristics(e.data)})
        CatalogAPI.allTypesReq().then(e => {setAllTypes(e.data)})
        CatalogAPI.CharacteristicsReq().then(e => {setTableCharacteristics(e.data)})
        CatalogAPI.productCharacteristicsForListReq(id).then(e => {setCharacteristicsForList(e.data)})
        
        if (u_i !== null && u_i !== undefined) {
          BasketAPI.getBasket({user_id: u_i}).then(e => {setBasket(e.data)});
      }
    }, [id]);
    useEffect(() => {
      if(userId !== null) {
        CatalogAPI.getExistingStatus({productId: id, userId: userId}).then((e) => {setProductInFavorites(e.data.exists_status)})
        CompareAPI.getAreProductInComapre({productId: id, userId: userId}).then((e) => {setProductInCompare(e.data.exists_compare)});
        CatalogAPI.getProductStatus({productId: id, userId: userId}).then((e) => {setProductInOrder(e.data.product_in_order)});
      }
    }, [userId]);
    
    const onFinish = async (values) => {
      try{
        const name = values.name;
        const price = values.price;
        const description = values.description;
        const type_id = values.type_id;
        const quantity = values.quantity;
        await CatalogAPI.updateProductByIdReq({id: id, name: name, price: price, description: description, quantity: quantity, type_id: type_id}).then(response => {
          if(response.status===200){
            success(response.data);
            CatalogAPI.productDetailsReq(id).then(e => {setProduct(e.data[0])});
            setIsModalOpen(false);
          }
        }) 
      } catch (err) {
        console.error('Ошибка дабавления типа: ', err);
        errorm(err);
      }
    };
    const onFinishChar = async (values) => {
      try{
        console.log(values.product_characteristics);
        const response = await CatalogAPI.changeProductCharacteristics({characteristics: values.product_characteristics, productId: product.id});
        if(response.status === 200) {
          success(response.data);
          setIsCharModalOpen(false);
          //setIsAddCharModalOpen(false);
          CatalogAPI.productCharacteristicsReq(id).then(e => {setCharacteristics(e.data)})
        }
        else{
          errorm(response.data);
        }

      } catch (err) {
        console.error('Ошибка дабавления типа: ', err);
        errorm(err);
      }
    };
    const handleRemove = async (name, remove) => {
      try{
        const removedItem = form.getFieldValue(['product_characteristics', name]);
        const response = await CatalogAPI.deleteProductCharacteristic({characteristicId: removedItem.characteristic_id, productId: product.id});
        if(response.status === 200) {
          success(response.data);
          console.log('Removing item:', removedItem);
          remove(name);
        }
        
      } catch (err) {
        console.error('Ошибка удаления типа: ', err);
        errorm(err);
      }
    };
    const onFinishAddChar = async (values) => {
      try{
        const product_id = id;
        const product_characteristics = values.product_characteristics;
        //console.log(product_id)
        //return;
        await CatalogAPI.addNewProductCharacteristicsReq({product_id, product_characteristics}).then(res => {
            if(res.status === 200) {
                success(res.data)
                CatalogAPI.productCharacteristicsReq(id).then(e => {setCharacteristics(e.data)})
                CatalogAPI.productCharacteristicsForListReq(id).then(e => {setCharacteristicsForList(e.data)})
                values = null;
                setIsAddCharModalOpen(false)
            }
            else{
                errorm(res.data);
            }
        })
    } catch (err) {
        console.error('Ошибка дабавления типа: ', err);
        errorm(err);
      }
    }
    const addToBasket = async () => {
      try{
        if (productInOrder === 'нет') {
          let count = inputValue;
          let order_id = basket[0];
          
          let product_id = id;
          //console.log(order_id)
          await BasketAPI.addProduct({product_id, order_id, count}).then(res => {
            if(res.status === 200){
              success(res.data)
              CatalogAPI.getProductStatus({productId: id, userId: userId}).then((e) => {setProductInOrder(e.data.product_in_order)});
              toggle();
            }
          })
        }
        else {
          errorm('Товар уже в корзине')
        }
      } catch (err){
        console.error("Error adding to basket", err);
        errorm(err);
      }
    }
  // Get photo url
  const [imageUrl, setImageUrl] = useState([]);

  useEffect(() => {
    if (product) {
      fetchPhotoUrl(product.id);
    }
  }, [product]);

  const fetchPhotoUrl = async (productId) => {
    try {
      //console.log(productId)
      const response = await PhotoAPI.getPhotoesUrlReq(productId);
      if (response.status === 200) {
        let receivedUrl = response.data;
        receivedUrl = receivedUrl.map(url => `http://localhost:3300/${url.url}`);
        setImageUrl(receivedUrl);
      } else {
        setImageUrl(null);
      }
    } catch (error) {
      console.error('Error fetching photo URL:', error);
      setImageUrl(null);
    }
  };

  // Upload photo to back 
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Вы можете загружать только JPG/PNG файлы!');
    }
    return isJpgOrPng;
  };

  const handleChange = async (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    //console.log(info.file.status  );
    if (info.file.status === 'done') {
      setLoading(false);
      message.success(`${info.file.name} успешно загружен`);
      // Здесь можно обновить состояние, если необходимо
    } else if (info.file.status === 'error') {
      setLoading(false);
      message.error(`${info.file.name} не удалось загрузить`);
    }
  };

  const customRequest = async ({ file }) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      let productIdw = product.id;
      const response = await PhotoAPI.uploadPhotoReq({ formData: formData, productId: productIdw });
      if (response.status === 200) {
        setLoading(false); // Сбрасываем состояние loading в false после успешной загрузки файла
        message.success('Файл успешно загружен');
        fetchPhotoUrl(product.id);
      }
    } catch (error) {
      setLoading(false); // Сбрасываем состояние loading в false в случае ошибки загрузки
      console.error('Ошибка при загрузке изображения:', error);
      message.error('Произошла ошибка при загрузке изображения');
    }
  };

  // modal window on delete images
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleDeleteImages = async () => {
    try {
      // Ваш код для удаления изображений
      let deleted_count = 0;
      for (let i = 0; i < selectedImages.length; i++) {
        const response  = await PhotoAPI.deletePhotoByIdAndUrl({id: product.id, url: selectedImages[i]});
        if (response.status === 200) {
          deleted_count++;
        }
        else{
          message.error("Ошибка удаления фото: " + selectedImages[i]);
        }

      }
      if (deleted_count === selectedImages.length){
        // Закрытие модального окна после удаления
        setIsDeleteModalVisible(false);
        // Очистка выбранных изображений
        setSelectedImages([]);
        // Вывод сообщения об успешном удалении
        message.success("Изображения успешно удалены");
      }
      else {
        message.warning(`Было удалено ${deleted_count} из ${selectedImages.length} изображений`);
      }
      fetchPhotoUrl(product.id);
      
    } catch (error) {
      console.error("Ошибка удаления изображений:", error);
      message.error("Произошла ошибка при удалении изображений");
    }
  };

  const handleImageClick = (image) => {
    const isSelected = selectedImages.includes(image);
    if (isSelected) {
      setSelectedImages(selectedImages.filter((selectedImage) => selectedImage !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const productToFavorites = async () => {
    try {
      if(productInFavorites === 'нет') {
        const response = await CatalogAPI.addProductToFavorites({productId: id, userId: userId});
        if (response.status === 200) {
          success(response.data);
          if(userId !== null) {
            CatalogAPI.getExistingStatus({productId: id, userId: userId}).then((e) => {setProductInFavorites(e.data.exists_status)})
          }
        }
        else {
          errorm(response.data);
        }
      }
      else {
        errorm('продукт уже находиться в сравнении')        
      }
    }
    catch  (error) {
      console.error("Ошибка добавления в сравнения:", error);
      errorm( "Произошла ошибка при добавлении в сравнения");
    }
  }
  
  const productToCompare = async () => {
    try {
      if (productInCompare === 'нет') {
        const response = await CompareAPI.addProductInCompare({productId: id, userId: userId});
        if (response.status === 200) {
          success(response.data);
          if(userId !== null) {
            CompareAPI.getAreProductInComapre({productId: id, userId: userId}).then((e) => {setProductInCompare(e.data.exists_compare)})
          }
        }
        else {
          errorm(response.data);
        }
      }
      else {
        errorm('продукт уже находится в сравнения');        
      }
    } catch  (error) {
      console.error("Ошибка добавления в избранное:", error);
      errorm( "Произошла ошибка при добавлении в избранное");
    }
  }

    return(
        <div className="product-container">
          {contextHolder}
            <div className="main-info-container">
                <div className="img-container">
                    {imageUrl && imageUrl.length > 0 ? (
                      <Image.PreviewGroup
                      items={imageUrl}
                    >
                      <Image
                        src={`${imageUrl[0]}`}
                      />
                    </Image.PreviewGroup>
                    ) : (
                      <Empty />
                    )}
                    {userStatus === 'admin' && (
                    <div className="img-buttons">
                      <Upload
                      name="image"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      customRequest={customRequest}
                    >
                      <Button loading={loading} icon={<UploadOutlined />}>
                        {loading ? 'Загрузка' : 'Выбрать изображение'}
                      </Button>
                    </Upload>
                    <Button onClick={showDeleteModal} danger>
                      Удалить выбранные изображения
                    </Button>
                    </div>
                    )}
                </div>
                <div className="other-info-container">
                  <div className="change-button">
                  {userStatus === 'admin' && (
                    <div className="inner-change-button">
                      <Button className="edit-button" type='primary' onClick={showEditModal} icon={<LiaEdit />}></Button>
                    </div>
                    )}
                  </div>
                  <h1>{product.name}</h1>
                        <Link to={`/product/${id}/reviews`}><Rate allowHalf disabled value={product.raiting}/></Link>
                        <p>товар: {product.quantity === 0? (<span style={{color: "red"}}>отсутствует</span>) : (<span style={{color: "green"}}>в наличии {product.quantity} шт.</span>) }</p>
                        {product.quantity === 0? '' : (<InputNumber min={1} max={product.quantity} onChange={handleInputChange} defaultValue={1}/>)}
                        <div className="buttons-aa-container">
                            <Button onClick={productToFavorites} type="link">{productInFavorites === 'нет' ? 'В избранное' : 'В избранном'}</Button>
                            <Button onClick={productToCompare} type="link">{productInCompare === 'нет' ? 'К сравнению' : 'В сравнении'}</Button>
                        </div>
                        <h1>{product.price} р.</h1>
                        {product.quantity === 0? '' : (<Button onClick={addToBasket} className="add-to-order-button">{productInOrder === 'нет' ? 'Добавить в корзину' : 'В корзине'}</Button>)}
                </div>
            </div>
            <div className="description-container">
            <Card
                className="descriprion-card"
                title="Описание"
                bordered={false}
                >
                <p>{product.description}</p>
            </Card>
            </div>
            {userStatus === 'admin' && (
            <div className="change-button">
              <Button onClick={showAddCharModal} icon={<IoAddSharp/>}></Button>
              <Button className="edit-button" type='primary' onClick={showCharModal} icon={<LiaEdit />}></Button>
            </div>
            )}
            <div className="characteristics-container">
                <Table className="characteristics-table" columns={columns} pagination={false} dataSource={data}/>
            </div>
            <Modal
              title="Выберите изображения для удаления"
              visible={isDeleteModalVisible}
              onCancel={handleDeleteModalCancel}
              footer={[
                <Button key="cancel" onClick={handleDeleteModalCancel}>
                  Отмена
                </Button>,
                <Button key="delete" type="primary" onClick={handleDeleteImages}>
                  Удалить
                </Button>,
              ]}
            >
              <List
                itemLayout="horizontal"
                dataSource={imageUrl}
                renderItem={(image) => (
                  <List.Item
                    actions={[
                      <Button key="select" onClick={() => handleImageClick(image)}>
                        {selectedImages.includes(image) ? "Отменить выбор" : "Выбрать"}
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Image src={image} width={100} />}
                      title={image}
                    />
                  </List.Item>
                )}
              />
            </Modal>
            <Modal
                title="Change product"
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
                    initialValues={{name: product.name, price: product.price, description: product.description, quantity: product.quantity, type_id: product.type_id}}
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

                    <Form.Item
                        label="Количество"
                        name="quantity"
                    >
                        <InputNumber controls={false} />
                    </Form.Item>

                    <Form.Item
                        label="Тип"
                        name="type_id"
                    >
                        <Select>
                            {allTypes.map(e => (
                                <Option value={e.id}>{e.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

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
              title="Change product characteristics"
              open={isCharModalOpen}
              onOk={handleCharOk}
              onCancel={handleCharCancel}
              footer={null}
              closable={false}
              width={'800px'}
            >
              <Form
                    {...formItemLayout}
                    form={form}
                    variant="filled"
                    onFinish={onFinishChar}
                    style={{
                      width: "100%",
                    }}
                >
                    <Form.List name="product_characteristics" initialValue={characteristicsForList}>
                        
                        {(fields, { remove }) => (
                            <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                key={key}
                                style={{
                                    display: 'flex',
                                    marginBottom: 8,
                                    justifyContent: 'space-between',
                                }}
                                align="baseline"
                                >
                                <Form.Item
                                    {...restField}
                                    name={[name, 'characteristic_id']}
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Missing first name',
                                    },
                                    ]}
                                    wrapperCol={{
                                      offset: 0,
                                      span: 48,
                                  }}
                                >
                                    <Select readOnly style={{width: "500px"}}>
                                      <Input value={(tableCharacteristics.find(e => e.id === (characteristicsForList[name]).characteristic_id)).id}>{(tableCharacteristics.find(e => e.id === (characteristicsForList[name]).characteristic_id)).name}</Input>
                                    </Select>
                                    
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'value']}
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Missing last name',
                                    },
                                    ]}
                                    wrapperCol={{
                                      offset: 0,
                                      span: 12,
                                  }}
                                >
                                    <InputNumber controls={false} />
                                </Form.Item>
                                <Form.Item
                                {...restField}
                                name={[name, 'unit']}
                                >
                                    <Input readOnly={true} placeholder={unitValues[name]} value={unitValues[name]}/>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => handleRemove(name, remove)} />
                                </Space>
                            ))}
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
            title="Add product characteristics"
            open={isAddCharModalOpen}
            onOk={handleAddCharOk}
            onCancel={handleAddCharCancel}
            footer={null}
            closable={false}
            >
              <Form
              {...formItemLayout}
              variant="filled"
              onFinish={onFinishAddChar}
              style={{
              maxWidth: 600,
              }}
              >
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
                                        {tableCharacteristics.map(e => (
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
                            wrapperCol={{
                              offset: 0,
                              span: 24,
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