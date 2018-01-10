/**
 * @File: 多条折线图
 */

import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts'
import { View } from '@antv/data-set';
import multipleLineData from '../data/multipleLineData'

class MultipleLineChart extends Component {
 render() {
   let dv = new View().source(multipleLineData);

   dv.transform({
     type: 'fold',
     fields: ['Tokyo', 'London'], // 展开字段集
     key: 'city',
     value: 'temperature'
   });

   const cols = {
     month: {
       range: [0, 1]
     }
   }

   return (
     <div>
       <Chart
         data={dv}
         scale={cols}
         height={400}
         forceFit
       >
         <Axis name="month" />
         <Axis name="temperature" label={{ formatter: (val) => { return `${val}°C` } }} />
         <Tooltip crosshairs={{ type: 'y' }} />
         <Geom type='line' position='month*temperature' size={2} color='city' />
         <Geom type='point' position='month*temperature' size={4} shape='circle' color='city' />
       </Chart>
     </div>
   );
 }
}

export default MultipleLineChart;
