import React, {Component} from 'react';
import { message } from 'antd'
import { msgError, baseUrl } from 'utils/common.js'
import axios from 'axios'

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legendScroll';
import "echarts/lib/component/tooltip"

let myChart = null

class Charts extends Component {
    constructor (props) {
        super(props)
        this.state = {
            pieData: [],
            title: []
        }
    }
    componentDidMount() {
        this.setEchart()
        this.getPlatformAuthReq()
    }
    setEchart = () => {
        const dom = document.getElementById('main')
        if (!dom) return;
        myChart = echarts.init(dom);
        // 绘制图表
        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} :({d}%)",
                position:"right"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                align:"left",
                top:"10%",
                right:"0",
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    color: '#ffffff',
                }
            },
            series: [{
                name: '',
                type: 'pie',
                radius: ['20%', '75%'],
                center: ['40%', '50%'],
                label: {
                    normal: {
                        position:"inner",
                        show: true,
                        formatter: "{d}%",

                    },
                    emphasis: {
                        show: true
                    }
                },
                lableLine: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                color: [
                    "#fcce10",
                    "#e87c25",
                    "#27727b",
                    "#c1232b",
                    "#b5c334"
                ]
            }]
        })
    }
    componentDidUpdate() {
        myChart.setOption({
            legend: {
                data: this.state.title
            },
            series: [{
                data: this.state.pieData.sort(function (a, b) {
                    return a.value - b.value;
                })
            }]
        })
    }
    getPlatformAuthReq = () => {
        const that = this
        if (!myChart) this.setEchart()
        axios.post(baseUrl + '/msgManage/getPlatformAuthReq').then(function (res) {
            const data = res.data;
            if (data.code === 0) {
                if (data.data.length === 0) {
                    message.warning('暂无数据')
                    return;
                }
                let pieData = []
                let title = []
                data.data.map( (t,i) => {
                    pieData = [...pieData, {
                        name: t.platform,
                        value: t.total
                    }]
                    title = [...title, t.platform]
                })
                that.setState({
                    pieData: pieData,
                    title: title
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
            <div className="piechart-box" id="main" ref="main"></div>
        )
    }
}
export default Charts