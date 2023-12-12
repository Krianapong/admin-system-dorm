import React from 'react';
import "./dashboard.css";
import {
  barChartBoxRevenue,
  barChartBoxVisit,
  chartBoxConversion,
  chartBoxProduct,
  chartBoxRevenue,
  chartBoxUser,
} from "../../../data"
const Dashboard = () => {
  return (
    <div className="home">
      <div className="box box1">
        {/* <TopBox /> */}
        1s
      </div>
      <div className="box box2">
        {/* <ChartBox {...chartBoxUser} /> */}
        2
      </div>
      <div className="box box3">
        {/* <ChartBox {...chartBoxProduct} /> */}
        3
      </div>
      <div className="box box4">
        {/* <PieChartBox /> */}
        4
      </div>
      <div className="box box5">
        {/* <ChartBox {...chartBoxConversion} /> */}
        5
      </div>
      <div className="box box6">
        {/* <ChartBox {...chartBoxRevenue} /> */}
        6
      </div>
      <div className="box box7">
        {/* <BigChartBox /> */}
        7
      </div>
      <div className="box box8">
        {/* <BarChartBox {...barChartBoxVisit} /> */}
        8
      </div>
      <div className="box box9">
        {/* <BarChartBox {...barChartBoxRevenue} /> */}
        9
      </div>
    </div>
  );
};

export default Dashboard;
