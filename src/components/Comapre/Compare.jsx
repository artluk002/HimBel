import React, {useState, useEffect} from "react";
import "./Compare.modul.scss";
import { Button, Table, message } from "antd";
import { Link, useParams } from "react-router-dom";
import { CatalogAPI, CompareAPI } from "../api/api";
import { CompareProductCard } from "../CompareProductCard/CompareProductCard";



export const Compare = () => {
    const { id } = useParams();
    const [compareInfo, setCompareInfo] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [deleteProductToogle, setDeleteProductToogle] = useState(false);
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
        CompareAPI.getCompareItemsReq({id: id}).then(e => {setCompareInfo(e.data)});
    }, [id, deleteProductToogle]);

    useEffect(() => {
        if (compareInfo.length > 0) {
          // Получаем все продукты на основе compareInfo
          const fetchProducts = async () => {
            const productPromises = compareInfo.map(async item => {
              const productResponse = await CatalogAPI.productDetailsReq(item.product_id);
              const product = productResponse.data;
              const characteristicsResponse = await CatalogAPI.productCharacteristicsReq(item.product_id);
              product.characteristics = characteristicsResponse.data;
              return product;
            });
            const allProducts = await Promise.all(productPromises);
            //console.log(allProducts);
            setProducts(allProducts);
          };
          fetchProducts();
        }
      }, [compareInfo]);
    const updateCompare = (message) => {
        setDeleteProductToogle(!deleteProductToogle);
        success(message);
    }

   // Получаем уникальные типы из compareInfo
  const uniqueTypes = Array.from(new Set(compareInfo.map(item => item.type_id)))
  .map(id => compareInfo.find(item => item.type_id === id));
// Фильтруем продукты на основе выбранного type_id
const filteredProducts = selectedTypeId !== null
  ? products.filter(product => compareInfo.some(item => item.type_id === selectedTypeId && item.product_id === product[0].id))
  : products;
// Получаем уникальные характеристики из всех товаров
const allCharacteristics = Array.from(
  new Set(filteredProducts.flatMap(product => product.characteristics.map(char => char.characteristic)))
);
// Создаем столбцы для таблицы
const columns = [
  {
    title: (<div>Характеристика</div>),
    dataIndex: 'characteristic',
    key: 'characteristic',
    fixed: 'left',
    width: 300,
  },
  ...filteredProducts.map(product => ({
    title: ( <CompareProductCard product={product[0]} onProductDelete={updateCompare}/>),
    dataIndex: product[0].name,
    key: product[0].id,
    width: 300,
  }))
];
// Создаем строки данных для таблицы с проверкой одинаковых значений
const data = allCharacteristics.map((characteristic, index) => {
  const row = { key: index, characteristic };
  const values = filteredProducts.map(product => {
    const char = product.characteristics.find(c => c.characteristic === characteristic);
    return char ? `${char.value} ${char.unit || ''}` : '-';
  });
  // Подсчитываем количество каждого значения, исключая "-"
  const valueCounts = values.reduce((acc, value) => {
    if (value !== '-') {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});

  filteredProducts.forEach(product => {
    const char = product.characteristics.find(c => c.characteristic === characteristic);
    const value = char ? `${char.value} ${char.unit || ''}` : '-';
    row[product[0].name] = {
      value,
      className: valueCounts[value] > 1 ? 'highlight' : ''
    };
  });
  //console.log(values)
  return row;
  
});

// Преобразование данных для отображения в таблице с использованием className
const tableData = data.map(row => {
  const newRow = { key: row.key, characteristic: row.characteristic };
  filteredProducts.forEach(product => {
    newRow[product[0].name] = (
      <div className={row[product[0].name].className}>
        {row[product[0].name].value}
      </div>
    );
  });
  return newRow;
});
//console.log(tableData)
    return(
        <div className="compare-container">
            {contextHolder}
            <h2>Сравнения</h2>
            <div className="compare-block">
                <div className="compare-types">
                {uniqueTypes.map(type => (
                    <Button 
                    key={type.type_id} 
                    type="link" 
                    onClick={() => setSelectedTypeId(type.type_id)}
                    style={{
                        color: "black",
                        fontSize: "large",
                    }}
                    >
                    {type.type_name}
                    </Button>
                ))}
                </div>
                {selectedTypeId && (
                <div className="products-for-compare">
                    <Table
                        className="compare-table"
                        pagination={false}
                        bordered
                        scroll={{ x: 'max-content' }} // Прокрутка по горизонтали
                        columns={columns}
                        dataSource={tableData}
                     />
                </div>
                )}
            </div>
        </div>
    )    
}