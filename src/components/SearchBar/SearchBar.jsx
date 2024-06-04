import React, { useState } from 'react';
import { Input, List } from 'antd';
import { CatalogAPI } from '../api/api';
import { Link } from 'react-router-dom';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputActive, setInputActive] = useState(false);

  const fetchProducts = async (search) => {
    setLoading(true);
    try {
      const response = await CatalogAPI.getProductForSearchBarReq({search: search})
      //console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchProducts(value);
  };
  const clearSearch = () => {
    setSearchTerm('');
    }
    const handleInputFocus = () => {
        setInputActive(true);
      };
    
      const handleInputBlur = () => {
        setTimeout(() => {
          setInputActive(false);
        }, 200); // Небольшая задержка, чтобы позволить пользователю кликнуть по результатам
      };

  return (
    <div className="search-products-container">
      <Input
        placeholder="Введите название продукта"
        value={searchTerm}
        onChange={handleSearch}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        style={{}}
      />
      {inputActive && searchTerm && (
      <div className="product-list-container">
            <List
            style={{backgroundColor: "white",
            borderRadius: "10px",
            border: "1px solid black",
        }}
                loading={loading}
                itemLayout="horizontal"
                dataSource={products}
                renderItem={item => (<Link on onClick={clearSearch} to={`/product/${item.id}`}>
                <List.Item>
                     
                        <List.Item.Meta 
                        title={item.name}
                        description={`Цена: ${item.price}, Рейтинг: ${item.raiting}`}
                        />
                   
                </List.Item></Link>
            )}
            />
        </div>
        )}
    </div>
  );
};


