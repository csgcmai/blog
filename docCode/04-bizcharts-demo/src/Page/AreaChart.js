/**
 * @File: 面积图
 */

import React, { Component } from 'react';
import { Chart, Axis, Legend, Tooltip, Geom } from 'bizcharts'
import stackedAreaData from '../data/stackedAreaData'

class AreaChart extends Component {
  render() {
    const cols = {
      year: {
        type: 'linear',
        tickInterval: 50
      }
    }

    return (
      <div>
        <Chart
          data={stackedAreaData}
          scale={cols}
          height={400}
          forceFit
        >
          <Axis name="year" />
          <Axis name="value" />
          <Legend />
          <Tooltip crosshairs={{ type: 'line' }} />
          <Geom type='area' position='year*value' color='country' />
          <Geom type='line' position='year*value' size={2} color='country' />
        </Chart>
      </div>
    );
  }
}

export default AreaChart;
