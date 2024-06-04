import React from "react";
import "./Reports.modul.scss";
import { Tabs } from "antd";
import { SalesReport } from "../SalesReport/SalesReport";
import { DemandReport } from "../DemandReport/DemandReport";
import { CustomerReport } from "../CustomerReport/CustomerReport";
import { Print, NoPrint } from 'react-easy-print';

export const Reports = () => {
    return (
        <div className="reports-container">
            <NoPrint>
            <Tabs
                defaultActiveKey="1"
                type="card"
                size={"large"}
                items={[
                    {
                        label: "Статистический отчет по объёму продаж",
                        key: "1",
                        children: <SalesReport />,
                    },
                    {
                        label: "Аналитический отчет по наиболее востребованным маслам",
                        key: "2",
                        children: <DemandReport />,
                    },
                    {
                        label: "Отчет по покупателям",
                        key: "3",
                        children: <CustomerReport />,
                    },
                ]}
            />
            </NoPrint>
        </div>
    )
}