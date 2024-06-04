import React, { useState, useEffect } from 'react';
import { Table, Button, DatePicker, Space } from 'antd';
import { PDFAPI } from "../api/api";
import { Print } from 'react-easy-print';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const { RangePicker } = DatePicker;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const SalesReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [salesToggle, setSalesToggle] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      PDFAPI.salesReport({ start_date: startDate, end_date: endDate })
        .then(response => {
          const formattedData = response.data.map(item => ({
            ...item,
            total_sales_amount: parseFloat(item.total_sales_amount), // Оставляем как число для диаграммы
          }));
          setData(formattedData);
          setLoading(false);
        })
        .catch(error => {
          console.error("There was an error fetching the sales report!", error);
          setLoading(false);
        });
    }
  }, [salesToggle]);

  const columns = [
    { title: 'Название продукта', dataIndex: 'product_name', key: 'product_name' },
    { title: 'Количество проданного в шт.', dataIndex: 'total_quantity_sold', key: 'total_quantity_sold' },
    {
      title: 'Сумма продаж в рублях',
      dataIndex: 'total_sales_amount',
      key: 'total_sales_amount',
      render: (value) => value.toFixed(2), // Преобразование для отображения
      //render: (value) => value.toFixed(2), // Преобразование для отображения
    },
  ];

  const handleDateChange = (dates) => {
    if(dates === null) return;
    setStartDate(Date.parse(dates[0].$d));
    setEndDate(Date.parse(dates[1].$d));
    setSalesToggle(!salesToggle);
  };

  return (
    <div>
      <Print single name="SalesReport">
        <h2 style={{margin: "0"}}>Статистический отчет по объёму продаж</h2>
        <Space direction="vertical" style={{margin: "20px"}} size={12}>
            <RangePicker
                variant="borderless"
                //key={startDate && endDate ? `${startDate}-${endDate}` : 'rangePickerKey'} // Уникальный ключ для RangePicker
                onChange={handleDateChange}
                showTime
            />
        </Space>
        
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_quantity_sold" fill="#8884d8" name="Количество проданного" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="total_sales_amount"
                nameKey="product_name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {
                  data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <Table dataSource={data} columns={columns} loading={loading} />
      </Print>
      <div className="make-PDF-btn">
        <Button onClick={() => window.print()}>Сохранить как PDF</Button>
      </div>
    </div>
  );
}
