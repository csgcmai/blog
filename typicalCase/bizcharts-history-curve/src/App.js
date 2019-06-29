import React, { Component } from 'react'
import HistoryCurve from './HistoryCurve'
import { initialData } from './mockData'
import 'antd/dist/antd.css'
import './App.css'

class App extends Component {
  state = {
    date: initialData
  }
  render() {
    return (
      <div>
        <HistoryCurve
        
        />
      </div>
    )
  }
}

export default App
