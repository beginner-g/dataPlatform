import React, {Component} from 'react';
import { message } from 'antd'
import { msgError, baseUrl } from 'utils/common.js'
import axios from 'axios'

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import "echarts/lib/component/tooltip"

let myChart = null

class BarCharts extends Component {
    constructor (props) {
        super(props)
        this.state = {
            xData: [],
            yData:[],
            year: this.props.year
        }
    }
    years = (year) => {
        this.getMonthAuthReq(year)
    }
    componentDidMount() {
        this.setEchart()
        this.getMonthAuthReq()
    }
    setEchart = () => {
        const dom = document.getElementById('bar')
        if (!dom) return;
        myChart = echarts.init(dom);
        // 绘制图表
        myChart.setOption({
            tooltip: {
               trigger: 'axis',
                formatter: "{a} <br/>{b} : {c}",
                position:"right"
            },
            grid: {
                left: '10%',
                bottom: '15%',
                right:'10%',
                top:'5%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                nameTextStyle: {
                    color: '#b1e7fd',
                    padding: [0, -4, 0, 0]
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
                name: '月度认证量',
                type:'bar',
                barWidth: '40%',
            }],
            color: '#cd5649'
        })
    }
    componentDidUpdate() {
        myChart.setOption({
            xAxis: [{
                data: this.state.xData,
            }],
            series: [{
                data: this.state.yData
            }],
        })
    }
    getMonthAuthReq = (year) => {
        if (!myChart) this.setEchart()
        year = year || this.state.year
        const that = this
        axios.get(baseUrl + '/msgManage/getMonthAuthReq/' + year).then(function (res) {
            const data = res.data;
            if (data.code === 0) {
                if (data.data.length === 0) {
                    message.warning('暂无数据')
                    return;
                }
                let xData = []
                let yData = []
                data.data.map((t, key) => {
                    xData = [...xData, ~~key + 1 + '月']
                    yData = [...yData, t.total]
                })
                that.setState({
                    xData: xData,
                    yData: yData
                })
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
    render () {
        return (
            <div id="bar"></div>
        )
    }
}
export default BarCharts