import React, { Component } from 'react';
import { Chart, Axis, Legend, Tooltip, Geom } from 'bizcharts'
import StackedArea from './Page/StackedArea'
import stackedAreaData from './data/stackedAreaData'
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        {/* 堆栈面积图 */}
        <StackedArea />
      </div>
    );
  }
}

export default App;
