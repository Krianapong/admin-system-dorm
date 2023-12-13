import React from 'react';
import Topbox from '../../../components/topBox/TopBox';
import ChartBox from '../../../components/chartBox/ChartBox';
import PieChartBox from '../../../components/pieCartBox/PieChartBox';
import BigChartBox from '../../../components/bigChartBox/BigChartBox';
import BarChartBox from '../../../components/barChartBox/BarChartBox';

import "./dashboard.css";
import {
  barChartBoxRevenue,
  barChartBoxVisit,
  chartBoxConversion,
  chartBoxProduct,
  chartBoxRevenue,
  chartBoxUser
} from "../../../data"
const Dashboard = () => {
  return (
    <div className="home">
      <div className="box box1">
        <Topbox />
      </div>
      <div className="box box2">
        <ChartBox {...chartBoxUser} />
      </div>
      <div className="box box3">
        <ChartBox {...chartBoxProduct} />
      </div>
      <div className="box box4">
        <PieChartBox />
        
      </div>
      <div className="box box5">
        <ChartBox {...chartBoxConversion} />
        
      </div>
      <div className="box box6">
        <ChartBox {...chartBoxRevenue} />
        
      </div>
      <div className="box box7">
        <BigChartBox />
        7
      </div>
      <div className="box box8">
        <BarChartBox {...barChartBoxVisit} />
        8
      </div>
      <div className="box box9">
        <BarChartBox {...barChartBoxRevenue} />
        9
      </div>
    </div>
  );
};

export default Dashboard;
