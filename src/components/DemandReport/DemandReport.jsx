import React, { useState, useEffect } from 'react';
import "./DemandReport.modul.scss";
import { Table, Button } from 'antd';
import { PDFAPI } from "../api/api";
import { Link } from "react-router-dom";
import { Print } from 'react-easy-print';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const DemandReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Замените на ваш API-запрос
    PDFAPI.demandReport()
      .then(response => {
        setData(response.data);
        console.log(response.data)
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the demand report!", error);
        setLoading(false);
      });
  }, []);

  const columns = [
    { title: 'Название товара', dataIndex: 'product_name', key: 'product_name',
    render: (text, record) => (
        <Link to={`/product/${record.product_id}`}>
          {`${record.product_name}`}
        </Link>
      )
    },
    { title: 'Количчество продаж в шт.', dataIndex: 'order_count', key: 'order_count' },
    // Добавьте другие столбцы по необходимости
  ];

  return (
    <div className='demand-report-container'>
        <Print single name="DemandReport">
        <h2>Аналитический отчет по наиболее востребованным маслам</h2>
            <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="order_count" name="Количество проданых товаров" fill="#8884d8" />
            </BarChart>
            </ResponsiveContainer>
            <Table dataSource={data} columns={columns} loading={loading} />
        </Print>
        <div className="make-PDF-btn">
            <Button onClick={() => window.print()}>Сохранить как PDF</Button>
        </div>
    </div>
  );
}
