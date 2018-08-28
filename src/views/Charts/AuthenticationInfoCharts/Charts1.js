import React, {Component} from 'react';
import axios from 'axios'
import { msgError, baseUrl } from 'utils/common.js'
import { message } from 'antd'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legendScroll';
import "echarts/lib/component/tooltip";

let myChart = null

class Charts1 extends Component {
    constructor (props) {
        super(props)
        this.state = {
            authGrade: [],
            total: 0,
            list: []
        }
    }
    componentDidMount() {
        this.setEchart()
    }
    setEchart = () => {
        const dom = document.getElementById('echart')
        if (!dom) return;
        myChart = echarts.init(dom);

        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend:{
                orient: 'vertical',
                left: 'right',
                align:"left",
                top:"0",
                right:"0",
                itemWidth: 15,
                itemHeight: 8,
                data: [{name:'一级用户'},
                    {name:'二级用户'},
                    {name:'三级用户'},
                    {name:'四级用户'},
                    {name:'法人用户'}
                ],
                textStyle: {
                    fontSize: 12,
                    color: '#ffffff',
                }
            },
            grid: {
                left: '10%',
                bottom: '10%',
                right:'15%',
                top:'10%',
               containLabel: true
            },
            xAxis: [{
                type: 'category',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#b1e7fd'
                    },
                    axisLine: {
                        show: true, //x轴的线
                        lineStyle: {
                            color: '#101e56',
                        }
                    },

                }
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: '#b1e7fd'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#0f1d50',
                        width: 1
                    }
                },
            }],
            series: [{
                name: '一级用户',
                type: 'bar',
                barWidth: '15%',
                stack:"bar",
                itemStyle: {
                    normal: {
                        color: function (params) {
                            // build a color map as your need.
                            var colorList = [
                                '#ff7e28', '#ffd52c', '#beeb37', '#42d98d', '#4277d9'
                            ];
                            return colorList[params.dataIndex]
                        }
                    }
                }
            },
            {
                name: '二级用户',
                type: 'bar',
                stack:"bar",
                itemStyle: {
                    normal: {
                        color:'#ffd52c'
                    }
                }
            },
            {
                name: '三级用户',
                type: 'bar',
                stack:"bar",
                itemStyle: {
                    normal: {
                        color:'#beeb37'
                    }
                }
            },
            {
                name: '四级用户',
                type: 'bar',
                stack:"bar",
                itemStyle: {
                    normal: {
                        color:'#42d98d'
                    }
                }
            },
            {
                name: '法人用户',
                type: 'bar',
                stack:"bar",
                itemStyle: {
                    normal: {
                        color:'#4277d9'
                    }
                }
            }]
        })
    }
    componentDidUpdate() {
        myChart.setOption({
            xAxis: [{
                data: this.state.authGrade,
            }],
            series: [{
                data: this.state.list,
            }]
        })
    }
    getAuthTrendReq = () => {
        if (!myChart) this.setEchart()
        const that = this
        axios.post(baseUrl + '/msgManage/getAuthTrendReq').then(function (res) {
            const data = res.data;
            if (data.code === 0) {
                if (data.data.length === 0) {
                    message.warning('暂无数据')
                    return;
                }
                let list = []
                let authGradeS = []
                // console.log(data.data);
                for (let i = 0; i<data.data.length; i++) {
                    list.push(data.data[i].total)
                    let thisWord = '一级用户'
                    const authGrade = data.data[i].authGrade
                    if (authGrade === 1) {
                        thisWord = '一级用户'
                    } else if (authGrade === 2) {
                        thisWord = '二级用户'
                    } else if (authGrade === 3) {
                        thisWord = '三级用户'
                    } else if (authGrade === 4) {
                        thisWord = '四级用户'
                    } else if (authGrade === 5) {
                        thisWord = '法人用户'
                    } else {
                        thisWord = '一级用户'
                    }
                    authGradeS.push(thisWord)
                }
                that.setState({
                    list: list,
                    authGrade: authGradeS
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
        return (
            <div className="barchart-box" id="echart"></div>
        )
    }
}
export default Charts1