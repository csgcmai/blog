/**
 * @TODO: 图表切为无状态组件
 * @TODO: 索引 图表默认高度 400
 */

import React, { Component } from 'react';
import MultipleLineChart from './Page/MultipleLineChart'
import StackedColumnChart from './Page/StackedColumnChart'
import AreaChart from './Page/AreaChart'
import BasicPieChart from './Page/BasicPieChart'
import StackedAreaChart from './Page/StackedAreaChart'

class App extends Component {
  render() {
    return (
      <div>
        {/* 多条折线图 */}
        <MultipleLineChart />

        {/* 堆叠条形图 */}
        <StackedColumnChart />

        {/* 面积图 */}
        <AreaChart />

        {/* 堆叠面积图 */}
        <StackedAreaChart />

        {/* 基础饼图 */}
        <BasicPieChart />
      </div>
    );
  }
}

export default App;
