/**
 * @File: 堆叠条形图
 */

import React, { Component } from 'react';
import { Chart, Coord, Axis, Tooltip, Geom } from 'bizcharts'
import { View } from '@antv/data-set';
import stackedColumnData from '../data/stackedColumnData'

class StackedColumn extends Component {
  render() {
    let dv = new View().source(stackedColumnData)

    dv.transform({
      type: 'fold',
      fields: ['小于5岁', '5至13岁', '14至17岁'], // 展开字段集
      key: '年龄段',
      value: '人口数量',
      retains: ['State'] // 保留字段集，默认为除 fields 以外的所有字段
    })

    return (
      <div>
        <Chart
          data={dv}
          height={400}
          forceFit
        >
          {/* 转置坐标系的 x轴、y轴：https://antv.alipay.com/zh-cn/g2/3.x/api/chart.html#_coord */}
          <Coord transpose />

          {/* 设置坐标轴文本 label 距离坐标轴线的距离: https://antv.alipay.com/zh-cn/g2/3.x/api/chart.html#_chart.axis-field-,-axisConfig- */}
          <Axis name="State" label={{ offset: 12 }} />
          <Axis name="人口数量" />
          <Tooltip />

          {/* Geom type='intervalStack' 设置几何标记对象为层叠柱状图 */}
          <Geom type='intervalStack' position='State*人口数量' color='年龄段' />
        </Chart>
      </div>
    );
  }
}

export default StackedColumn;
