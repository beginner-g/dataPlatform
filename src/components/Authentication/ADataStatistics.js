import React, {Component} from 'react';
import {ComposedChart, Line, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Select, message } from 'antd'
import scrollsY from 'utils/scroll.min.js'
import axios from 'axios'
import Charts from './ADataStatisticsPages/Charts'
import Charts1 from './ADataStatisticsPages/Charts1'
import Charts2 from './ADataStatisticsPages/Charts2'
import Charts3 from './ADataStatisticsPages/Charts3'
import BarCharts from './ADataStatisticsPages/BarCharts'

const Option = Select.Option
let myDate = new Date()
let year = myDate.getFullYear()

class ADataStatistics extends Component {
    constructor (props) {
        super(props)
        this.state = {
            minYear: 2018,
            year: year,
            years: []
        }
    }
    componentDidMount () {
        this.setOptions()
        scrollsY()
    }
    handleChange = (value) => {
        this.refs.charts.years(value);
    }
    setOptions = () => {
        const minYear = this.state.minYear
        let years = []
        for(let i = minYear; i <= year; i++) {
            years.push(i)
        }
        this.setState({
            years: years
        })
    }
    render () {
        return (
            <section className="pageContent echartsContorl public-wrap echartsRzTj">
                <div className="content-seat">
                    <header className="operationControl">
                        <h4>认证数据统计</h4>
                    </header>
                    <section className="cententMain">
                        <div className="scrollbox statistics-contant-wrap">
                            <div className="ovy-a">
                                <div className="statistics-contant">
                                    <div className="statistics-top">
                                        <div className="top-title">
                                            <h3>月度认证量</h3>
                                            <div className="selectBox fz0">
                                                <Select defaultValue={year} className="statistics-select" onChange={this.handleChange}>
                                                    {
                                                        this.state.years.map((t, key) => {
                                                            return <Option value={t} key={key}>{t}年</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="statistics-chart">
                                            <BarCharts ref="charts" year={this.state.year} />
                                        </div>
                                    </div>
                                    <div className="statistics-bottom">
                                        <div className="statistics-bottom-box">
                                            <div className="h3-box">
                                                <h3 className="chart-title1">不同平台认证量</h3>
                                            </div>
                                            <Charts />
                                        </div>
                                        <div className="statistics-bottom-box">
                                            <div className="h3-box">
                                                <h3 className="chart-title1">不同等级比例</h3>
                                            </div>
                                            <Charts1 />
                                        </div>
                                        <div className="statistics-bottom-box">
                                            <div className="h3-box">
                                                <h3 className="chart-title1">男女比例</h3>
                                            </div>
                                            <Charts2 />
                                        </div>
                                        <div className="statistics-bottom-box">
                                            <div className="h3-box">
                                                <h3 className="chart-title1">年龄段比例</h3>
                                            </div>
                                            <Charts3 />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        )
     }
}

export default ADataStatistics