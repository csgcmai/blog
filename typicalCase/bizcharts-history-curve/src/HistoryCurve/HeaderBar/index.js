/**
 * @File: 图表顶部的信息显示及交互控制区域
 */

import React, { PureComponent } from 'react'
import { Button } from 'antd'

class HeaderBar extends PureComponent {
  render() {
    return (
      <div>
        <div className="dp-flex">
          <div className="flex1">位置-数据点名称</div>
          <div>在下图曲线上任意点选两点放大查看</div>
        </div>
        <div className="mt6 dp-flex">
          <div className="flex1">
            <Button>上一任务</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default HeaderBar
