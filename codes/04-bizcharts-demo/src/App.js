import React, { Component } from 'react';
import { Chart, Axis, Legend, Tooltip, Geom } from 'bizcharts'
import MultipleLine from './Page/MultipleLine'
import StackedArea from './Page/StackedArea'
import stackedAreaData from './data/stackedAreaData'

class App extends Component {
  render() {
    return (
      <div>
        {/* 多条折线图 */}
        <MultipleLine />

        {/* 堆栈面积图 */}
        <StackedArea />
      </div>
    );
  }
}

export default App;
