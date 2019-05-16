/**
 * @File: 堆栈面积图
 */

import React, { Component } from 'react';
import { Chart, Axis, Legend, Tooltip, Geom } from 'bizcharts'
import stackedAreaData from '../data/stackedAreaData'

class StackedAreaChart extends Component {
  render () {
    const cols = {
      year: {
        type: 'linear'
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
          <Geom type='areaStack' position='year*value' color='country' />
        </Chart>
      </div>
    )
  }
}

export default StackedAreaChart;