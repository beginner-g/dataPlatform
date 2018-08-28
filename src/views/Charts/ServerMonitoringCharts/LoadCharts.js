import React, {Component} from 'react';
import { message } from 'antd'
import axios from 'axios'
import { baseUrl, msgError } from 'utils/common.js'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';

let myChart = null

class LoadCharts extends Component {
    constructor (props) {
        super (props)
        this.state = {
            max: 0,
            avg: 0,
            load_average: [],
            datetime: []
        }
    }
    componentDidMount() {
        this.setEchart()
    }
    setEchart = () => {
        const dom = document.getElementById('echart5')
        if (!dom) return;
        myChart = echarts.init(dom);

        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                show: false
            },
            grid: {
                left: '8%',
                right: '8%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                name: '时间',
                type: 'category',
                nameTextStyle:{
                        color: '#b1e7fd'
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#b1e7fd'
                    },
                    axisLine: {
                        show: true, //x轴的线
                        lineStyle: {
                            color: ['#101e56'],
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#101e56']
                        }
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#2a6e9b'
                    }
                }
            }],
            yAxis: [{
                name: '网络流出宽带（bit/s）',
                type: 'value',
                nameTextStyle: {
                    color: '#b1e7fd'
                },
                splitLine: {　　　　
                    show: false　　
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: '#b1e7fd'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#2a6e9b'
                    }
                }
            }],
            series: [{
                name: '网络流出宽带',
                type: 'line',
                barWidth: '40%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [
                                {offset: 0, color: '#fe4c36'},
                                {offset: 0.25, color: '#fe7833'},
                                {offset: 0.5, color: '#ffbf2e'},
                                {offset: 0.75, color: '#87d86a'},
                                {offset: 0.95, color: '#42c999'},
                                {offset: 1, color: '#ff9c30'}
                            ]
                        )
                    }
                },
            }],
        })
    }
    componentDidUpdate() {
        myChart.setOption({
            xAxis: [{
                data: this.state.datetime,
            }],
            series: [{
                data: this.state.load_average,
            }],
        })
    }
    getLoadDate = (hostnameProp) => {
        if (!myChart) this.setEchart()
        const that = this
        axios.get(baseUrl + `/serverMonitor/server/load/${hostnameProp}`).then(function (res) {
            const data = res.data;

            if (data.code === 0) {
                if (JSON.stringify(data.data) === '{}' || data.data.list.length === 0) {
                    message.warning('暂无数据')
                    return;
                }
                let load_average = []
                let datetime = []
                for (var i = 0; i < data.data.list.length; i++) {
                    const dataOption = data.data.list[i]
                    // 写入
                    load_average.push(dataOption.load_average)

                    const date = new Date(dataOption.datetime)
                    const getHours = date.getHours()
                    let getMinutes = date.getMinutes()

                    if (getMinutes < 10) {
                        getMinutes = '0' + getMinutes
                    }

                    datetime.push(getHours + ':' + getMinutes)
                }
                that.setState({
                    max: data.data.max.toFixed(2),
                    avg: data.data.avg.toFixed(2),
                    load_average: load_average,
                    datetime: datetime
                })
            } else {
                message.error(data.msg)
                that.props.timeError()
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
            that.props.timeError()
        });
    }
    render () {
        const { max, avg } = this.state
        return (
            <div className="line-box">
                <div className="line-sign">
                    <div className="line-sign-box">
                        <span>今日峰值</span>
                        <span>{max}</span>
                    </div>
                    <div className="line-sign-box">
                        <span>今日均值</span>
                        <span>{avg}</span>
                    </div>
                </div>
                <div id="echart5"></div>
            </div>
        )
    }
}
export default LoadCharts