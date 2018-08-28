import React, {Component} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/visualMap';

let myChart = null

class DataTransmissionCharts extends Component {
    constructor (props) {
        super(props)
        this.state = {
            names: [],
            counts: []
        }
    }
    show = (list) => {
        if (!myChart) this.setEchart()
        this.setState({
            names: list.map(t => t.name),
            counts: list.map(t => t.count)
        })
    }
    componentDidMount() {
        this.setEchart()
    }
    setEchart = () => {
        const dom = document.getElementById('echart')
        if (!dom) return;
        myChart = echarts.init(dom)

        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '3%',
                top: '3%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#b1e7fd'
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: '#133970'
                    }
                },
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: '#b1e7fd'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#133970'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#133970'
                    }
                }
            }],
            visualMap: {
                orient: 'horizontal',
                left: 'center',
                bottom: '-1000',
                min: 0,
                inRange: {
                    color: ['#fe3838', '#4277d9']
                }
            },
            series: [{
                name: '访问次数',
                type: 'bar',
                barWidth: '20%',
            }],
        })
    }
    componentDidUpdate() {
        myChart.setOption({
            grid: {
                bottom: this.state.names.length > 10 ? 40 : '3%'
            },
            xAxis: [{
                data: this.state.names,
            }],
            dataZoom: [
                {
                    show: this.state.names.length > 10 ? true : false,
                    start: 0,
                    end: 1000 / this.state.names.length
                }
            ],
            visualMap: {
                max: this.state.counts.length !== 0 ? Math.max.apply(null, this.state.counts) : 1
            },
            series: [{
                data: this.state.counts,
            }],
        })
    }
    render () {
        return (
            <div className="barchart-box">
                <div id="echart"></div>
            </div>
        )
    }
}
export default DataTransmissionCharts