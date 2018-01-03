import React, { Component } from 'react';
import { Chart, Axis, Legend, Tooltip, Geom } from 'bizcharts'
import MultipleLine from './Page/MultipleLine'
import StackedColumn from './Page/StackedColumn'
import StackedArea from './Page/StackedArea'
import BasicPie from './Page/BasicPie'

class App extends Component {
  render() {
    return (
      <div>
        {/* 多条折线图 */}
        <MultipleLine />

        {/* 堆叠条形图 */}
        <StackedColumn />

        {/* 堆栈面积图 */}
        <StackedArea />

        {/* 基础饼图 */}
        <BasicPie />
      </div>
    );
  }
}

export default App;
