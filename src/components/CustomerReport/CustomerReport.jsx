import React, { useState, useEffect } from 'react';
import { Table, Button, message, InputNumber } from 'antd';
import { PDFAPI } from "../api/api";
import { Print, NoPrint } from 'react-easy-print';
import "./CustomerReport.modul.scss";

export const CustomerReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(); 

  useEffect(() => {
    PDFAPI.customerReport({ price: 0 })
    .then(response => {
      setData(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error("There was an error fetching the customer report!", error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if(price === null) return;
    if (price !== undefined) {
      // Замените на ваш API-запрос
      PDFAPI.customerReport({ price: price })
        .then(response => {
          setData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("There was an error fetching the customer report!", error);
          setLoading(false);
        });
    }
  }, [price]);

  const columns = [
    {
      title: 'Имя клиента',
      dataIndex: 'first_name',
      key: 'first_name',
      render: (text, record) => `${record.first_name} ${record.last_name}`
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Сумма заказов в рублях',
      dataIndex: 'total_order_sum',
      render: (text, record) => parseFloat(record.total_order_sum).toFixed(2)
    },
  ];

  const handlePriceChange = (value) => {
    if (isNaN(value)) {
      message.error('Пожалуйста, введите корректное числовое значение');
      return;
    }
    setPrice(value);
  }

  return (
    <div className='customer-report-container'>
        <Print single name="CustomerReport">
            <h2>Отчет по покупателям</h2>
        </Print>
            <NoPrint>
                <InputNumber
                style={{
                    width: "200px",
                }}
                    placeholder="Введите сумму"
                    onChange={handlePriceChange}
                    min={0}
                /> 
            </NoPrint>
        <Print single name="CustomerReport">
            <Table dataSource={data} columns={columns} loading={loading} pagination={false}/>
        </Print>
        <div className="make-PDF-btn">
            <Button style={{position: "static", top: "0"}} onClick={() => window.print()}>Сохранить как PDF</Button>
        </div>
    </div>
  );
}
