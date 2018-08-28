import React, {Component} from 'react';
import { message } from 'antd'
import { msgError, baseUrl } from 'utils/common.js'
import axios from 'axios'

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legendScroll';
import "echarts/lib/component/tooltip"

let myChart = null

class Charts3 extends Component {
    constructor (props) {
        super(props)
        this.state = {
            list:[],
            color:[]
        }
    }
    componentDidMount() {
        this.setEchart()
        this.getAgeGroupReq()
    }
    setEchart = () => {
        const dom = document.getElementById('main3')
        if (!dom) return;
        myChart = echarts.init(dom)
        // 绘制图表
        myChart.setOption({
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
                position:"right"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                align:"left",
                top:"20%",
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
                    name:'年龄段比例',
                    type:'pie',
                    radius : ['20%', '75%'],
                    center: ['40%', '50%'],
                    avoidLabelOverlap: false,
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
                "rgba(181,195,52,1)",
                "rgba(232,124,37,1)",
                "rgba(193,35,43,1)",
                "rgba(252,206,16,1)",
                "rgba(39,114,123,1)",
            ]
        })
    }
    componentDidUpdate() {
        myChart.setOption({
            legend: {
                data: this.state.title
            },
            series : [{
                data: this.state.list,
            }]
        })
    }
    getAgeGroupReq = () => {
        const that = this
        if (!myChart) this.setEchart()
        axios.post(baseUrl + '/msgManage/getAgeGroupReq').then(function (res) {
            const data = res.data;
            if (data.code === 0) {
                if (data.data.length === 0) {
                    message.warning('暂无数据')
                    return;
                }
                let list = []
                data.data.map((t,i) => {
                    list = [...list, {
                        value: t.number,
                        name: t.ageGroup
                    }]
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
            <div className="piechart-box" id="main3">
                <div className="main-icon">
                    <div>
                        <b className="icon1"></b><span>0-20</span>
                    </div>
                    <div>
                        <b className="icon2"></b><span>21-30</span>
                    </div>
                    <div>
                        <b className="icon3"></b><span>31-40</span>
                    </div>
                    <div>
                        <b className="icon4"></b><span>41-50</span>
                    </div>
                    <div>
                        <b className="icon5"></b><span>51-60</span>
                    </div>
                    <div>
                        <b className="icon4"></b><span>61-70</span>
                    </div>
                    <div>
                        <b className="icon5"></b><span>70以上</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default Charts3