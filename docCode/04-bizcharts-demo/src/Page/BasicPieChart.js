/**
 * @File: 基础饼图
 */

import React, { Component } from 'react';
import { Chart, Coord, Axis, Legend, Tooltip, Geom, Label } from 'bizcharts'
import { View } from '@antv/data-set';
import basicPieData from '../data/basicPieData'

class BasicPieChart extends Component {
  render() {
    let dv = new View().source(basicPieData)

    {
      /*
       * 数据比例（百分比）相关 Transform: https://antv.alipay.com/zh-cn/g2/3.x/api/transform.html#_percent-总和百分比
       * field 是统计发生的字段（求和，求百分比），dimension 是统计的维度字段，也就是 “每个不同的 dimension 下，field 值占总和的百分比”
       */
    }
    dv.transform({
      type: 'percent',
      fields: 'count',
      dimension: 'item',
      as: 'percent' // 将统计结果存储在 percent 字段
    })

    const cols = {
      percent: {
        formatter: (val) => {
          return `${val * 100}%`;
        }
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
          {/* 设置半径固定的极坐标系，常用于饼图：https://antv.alipay.com/zh-cn/g2/3.x/api/chart.html#_coord */}
          <Coord type='theta' radius={0.75} />
          <Axis name="percent" />
          <Legend />

          {/* 设置 tooltip 每项记录的默认模板：https://antv.alipay.com/zh-cn/g2/3.x/api/chart.html#_tooltip */}
          <Tooltip showTitle={false} itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>' />

          <Geom
            type='intervalStack'
            position='percent'
            color='item'
          >
            <Label
              content='percent'
              formatter={(val, item) => {
                return `${item.point.item}: ${val}`
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default BasicPieChart;
