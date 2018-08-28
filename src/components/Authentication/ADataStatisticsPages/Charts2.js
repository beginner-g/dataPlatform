import React, {Component} from 'react';
import { message } from 'antd'
import { msgError, baseUrl } from 'utils/common.js'
import axios from 'axios'

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legendScroll';
import "echarts/lib/component/tooltip"

let myChart = null

class Charts2 extends Component {
    constructor (props) {
        super(props)
        this.state = {
            list:[]
        }
    }
    componentDidMount() {
        this.setEchart()
        this.getGenderRatioReq()
    }
    setEchart = () => {
        const dom = document.getElementById('main2')
        if (!dom) return;
        myChart = echarts.init(dom)
        myChart.setOption({
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                position:"right"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                align:"left",
                top:"50%",
                bottom:"0",
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    color: '#ffffff',
                }
            },
            series : [
                {
                    name:'男女比例',
                    type:'pie',
                    radius : '80%',
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
                                show: false
                            }
                        },
                    itemStyle: {
                        normal: {
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            background: 'red'
                        }
                    },
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ],
            color: [
                "rgba(84,191,44,1)",
                "rgba(16,191,160,1)",
            ]
        })
    }
    componentDidUpdate() {
        myChart.setOption({
            legend: {
                data: this.state.title
            },
            series : [
                {
                    data: this.state.list.sort(function (a, b) { return a.value - b.value; })
                }
            ]
        })
    }
    getGenderRatioReq = () => {
        const that = this
        if (!myChart) this.setEchart()
        axios.post(baseUrl + '/msgManage/getGenderRatioReq').then(function (res) {
            // console.log('-----getGenderRatioReq--then------');
            const data = res.data;
            if (data.code === 0) {
                if (data.data.length === 0) {
                    message.warning('暂无数据')
                    return;
                }
                let list = []
                data.data.map((t,i) => {
                    if (t.gender !== 0) {
                        list = [...list, {
                            value: t.total,
                            name:  t.gender === 1 ? '男' : '女'
                        }]
                    }
                    
                })
                that.setState({
                    list: list
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
            <div className="piechart-box" id="main2">
                <div className = "main-icon main-icon2" >
                    <div>
                        <b className="icon6"></b><span>男</span>
                    </div>
                    <div>
                        <b className="icon7"></b><span>女</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default Charts2