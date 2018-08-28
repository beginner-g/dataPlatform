import React, {Component} from 'react';
import { message } from 'antd'
import axios from 'axios'
import { baseUrl, msgError } from 'utils/common.js'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';

let myChart = null
let myChart2 = null

class SWAPCharts extends Component {
     constructor(props) {
         super(props)
         this.state = {
             total_memory_system: 0,
             used_memory_system: 0,
             usable_memory_system: 0
         }
     }
    componentDidMount() {
        this.setEchart()
    }
    setEchart = () => {
        const dom = document.getElementById('echarts11')
        const dom2 = document.getElementById('echarts12')
        if (!dom || !dom2) return;
        myChart = echarts.init(dom);
        myChart2 = echarts.init(dom2);

        myChart.setOption({
            title : {
                text: 'SWAP',
                x:'center',
                y:"center",
                textStyle:{
                   fontSize:15,
                   color:"#34c4ff",
                }
            },
            color:"#ed6637",
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['60%', '80%'],
                    hoverAnimation:false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false,
                            color:'pink',
                            shadowBlur:'800',
                            shadowColor:'rgba(225,0,241,1)',
                            shadowOffsetY:'150'
                        },
                        emphasis: {//悬浮式样式
                            show:false,
                            color: 'rgba( 0,0,0,0)'
                        }
                    },
                    data:[],
                    center: "49%"
                }
            ]
        })
        myChart2.setOption({
            color:["rgba(229,106,63,.5)","rgba(229,106,63,0)"],
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['35%', '70%'],
                    hoverAnimation:false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false,
                            color:'pink',
                            shadowBlur:'800',
                            shadowColor:'pink',
                            shadowOffsetY:'150'
                        },
                        emphasis: {//悬浮式样式
                            show:false,
                            color: 'rgba( 0,0,0,0)'
                        }
                    },
                    data:[],
                    center: "50%"
                }
            ]
        })
    }
    componentDidUpdate() {
        myChart.setOption({
            series: [
                {
                    data:[
                        {value:this.state.used_memory_system, name:'直接访问'},
                    ]
                }
            ]
        })
        myChart2.setOption({
            series: [
                {
                    data:[
                        {value:this.state.usable_memory_system, name:'直接访问'},
                        {value:this.state.used_memory_system, name:'直f'}
                    ]
                }
            ]
        })
    }
    getSwapData = (hostnameProp) => {
        if (!myChart || !myChart2) this.setEchart()
        const that = this
        axios.get(baseUrl + `/serverMonitor/server/memory/${hostnameProp}`).then(res => {
            const data = res.data;
            if (data.code === 0) {
                if (JSON.stringify(data.data) === '{}') {
                    message.warning('暂无数据')
                    return;
                }
                let total_memory_system = data.data.total_memory_system
                let used_memory_system = data.data.used_memory_system
                let usable = total_memory_system - used_memory_system
                that.setState({
                    total_memory_system: total_memory_system,
                    used_memory_system: used_memory_system,
                    usable_memory_system: usable
                })
            } else {
                message.error(data.msg)
                that.props.timeError()
            }
        }).catch(error => {
            console.log('-----catch------');
            message.error(msgError)
            that.props.timeError()
        });
    }
    render () {
        const { total_memory_system, used_memory_system, usable_memory_system } = this.state
        return (
            <div id="istorage">
                <div id="echart">
                <div className="echart-bigbox" id="echarts11">
                    </div>
                    <div id="echarts12"></div>
                </div>
                <div className="istorage-sign">
                    <div className="line-sign-box">
                        <span>真实内存</span>
                        <span>{total_memory_system}G</span>
                    </div>
                    <div className="line-sign-box">
                        <span>可用内存</span>
                        <span>{usable_memory_system}G</span>
                    </div>
                    <div className="line-sign-box">
                        <span>已用内存</span>
                        <span>{used_memory_system}G</span>
                    </div>
                    <div className="line-sign-box">
                        <span>当前状态</span>
                        <span>正常</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default SWAPCharts