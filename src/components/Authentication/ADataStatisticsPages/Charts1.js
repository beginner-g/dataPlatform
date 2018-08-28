import React, {Component} from 'react';
import { message } from 'antd'
import { msgError, baseUrl } from 'utils/common.js'
import axios from 'axios'

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legendScroll';
import "echarts/lib/component/tooltip"

let myChart = null

class Charts1 extends Component {
    constructor (props) {
        super(props)
        this.state = {
            list:[],
            title: []
        }
    }
    componentDidMount() {
        this.setEchart()
        this.getGradeReq()
    }
    setEchart = () => {
        const dom = document.getElementById('main1')
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
                top:"20%",
                itemWidth: 15,
                itemHeight: 8,
                textStyle: {
                    fontSize: 12,
                    color: '#ffffff',
                }
            },
            series : [
                {
                    name:'不同等级比例',
                    type:'pie',
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
                        }
                }
            ],
            color: [
                "rgba(252,206,16,1)",
                "rgba(232,124,37,1)",
                "rgba(39,114,123,1)",
                "rgba(193,35,43,1)",
                "rgba(181,195,52,1)",
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
    getGradeReq = () => {
        const that = this
        if (!myChart) this.setEchart()
        axios.post(baseUrl + '/msgManage/getGradeReq').then(function (res) {
            // console.log('-----then------');
            const data = res.data;
            if (data.code === 0) {
                if (data.data.length === 0) {
                    message.warning('暂无数据')
                    return;
                }
                let list = []
                let title = []
                data.data.map((t, i) => {
                    let thisWord = '一级用户'
                    if (t.authGrade === 1) {
                        thisWord = '一级用户'
                    } else if (t.authGrade === 2) {
                        thisWord = '二级用户'
                    } else if (t.authGrade === 3) {
                        thisWord = '三级用户'
                    } else if (t.authGrade === 4) {
                        thisWord = '四级用户'
                    } else if (t.authGrade === 5) {
                        thisWord = '法人用户'
                    } else {
                        thisWord = '一级用户'
                    }
                    list = [...list, {
                        name: thisWord,
                        value: t.total
                    }]
                    title = [...title, thisWord]
                })
                that.setState({
                    list: list,
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
            <div className="piechart-box" id="main1"></div>
        )
    }
}
export default Charts1