import React, {Component} from 'react';
import { message } from 'antd'
import axios from 'axios'
import { baseUrl, msgError } from 'utils/common.js'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/chart/line';

let myChart = null

class FluxCharts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            all_gongwang_in:0,
            all_neiwang_in:0,
            avg_gongwang_in:0,
            avg_neiwang_in:0,
            max_gongwang_in: 0,
            max_neiwang_in: 0,
            recv_em: [],
            recv_em_data: [],
            recv_lo: []
        }
    }
    componentDidMount() {
        this.setEchart()
    }
    setEchart = () => {
        const dom = document.getElementById('echart1')
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
                orient: 'horizontal',
                left: 'auto',
                align: "auto",
                top:"0",
                left:'25%',
                itemWidth: 15,
                itemHeight: 8,
                borderRadius: 5,
                data: [{name: '公网流量带宽'}, {name: '内网流量带宽'}],
                textStyle: {
                    color: ['#b1e7fd']
                },
                icon: 'stack'
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                name: '时间',
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
            },
            yAxis: {
                type: 'value',
                name: '网络流入宽带（bit/s）',
                nameTextStyle: {
                    color: '#b1e7fd'
                },
                splitLine: {　　　　
                    show: false　　
                },
                axisLabel: {
                    formatter: [],
                    textStyle: {
                        color: '#b1e7fd'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#2a6e9b'
                    }
                }
            },
            series: [{
                name: '公网流量带宽',
                type: 'line',
                stack: '总量',
                itemStyle: {
                    normal: {
                        color: '#baef35'
                    }
                }
            },
            {
                name: '内网流量带宽',
                type: 'line',
                stack: '总量',
                itemStyle: {
                    normal: {
                        color: '#ed6637'
                    }
                }
            }]
        })
    }
    componentDidUpdate() {
        myChart.setOption({
            xAxis: {
                data: this.state.recv_em_data,
            },
            yAxis: {
                axisLabel: {
                    formatter: [this.state.recv_em,this.state.recv_lo]
                }
            },
            series: [{
                data: this.state.recv_em
            },{
                data: this.state.recv_lo
            }]
        })
    }
    getFluxDate = (hostnameProp) => {
        if (!myChart) this.setEchart()
        const that = this
        axios.get(baseUrl + `/serverMonitor/server/net/${hostnameProp}`).then(function (res) {
            const data = res.data;
            if (data.code === 0) {
                if (JSON.stringify(data.data) === '{}' || data.data.list.length === 0) {
                    message.warning('暂无数据')
                    return;
                }
                let recv_em = []
                let recv_lo = []
                let recv_em_data = []
                for (var i = 0; i < data.data.list.length; i++) {
                    const dataOption = data.data.list[i]
                    // 公网流入
                    recv_em.push(dataOption.net_bytes_recv_em)
                    // 内网流入
                    recv_lo.push(dataOption.net_bytes_recv_lo)

                    const date = new Date(dataOption.datetime)
                    const getHours = date.getHours()
                    let getMinutes = date.getMinutes()

                    if (getMinutes < 10) {
                        getMinutes = '0' + getMinutes
                    }
                    recv_em_data.push(getHours + ':' + getMinutes)
                }

                that.setState({
                    all_gongwang_in: data.data.all_gongwang_in.toFixed(2),
                    all_neiwang_in: data.data.all_neiwang_in.toFixed(2),
                    avg_gongwang_in: data.data.avg_gongwang_in.toFixed(2),
                    avg_neiwang_in: data.data.avg_neiwang_in.toFixed(2),
                    max_gongwang_in: data.data.max_gongwang_in.toFixed(2),
                    max_neiwang_in: data.data.max_neiwang_in.toFixed(2),
                    recv_em: recv_em,
                    recv_lo: recv_lo,
                    recv_em_data: recv_em_data
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
        const { all_gongwang_in,
            all_neiwang_in,
            avg_gongwang_in,
            avg_neiwang_in,
            max_gongwang_in,
            max_neiwang_in
        } = this.state
        return (
            <div className="flux-box">
                <div id="echart1"></div>
                <div className="flux-sign">
                    <div className="flux-sign-l">
                        <p className="flux-sign-title">
                            <span>公网今日总流量</span>
                            <span>今日峰值</span>
                            <span>今日均值</span>
                            <span>当前状态</span>
                        </p>
                        <p className="flux-sign-value">
                            <span>{all_gongwang_in}G</span>
                            <span>{max_gongwang_in}G</span>
                            <span>{all_neiwang_in}G</span>
                            <span>正常</span>
                        </p>
                    </div>
                    <div className="flux-sign-l">
                        <p className = "flux-sign-title" >
                            <span>内网今日总流量</span>
                            <span>今日峰值</span>
                            <span>今日均值</span>
                            <span>当前状态</span>
                        </p>
                        <p className="flux-sign-value">
                            <span style={{color: '#ed6637'}}>{avg_gongwang_in}G</span>
                            <span style={{color: '#ed6637'}}>{max_neiwang_in}G</span>
                            <span style={{color: '#ed6637'}}>{avg_neiwang_in}G</span>
                            <span style={{color: '#ed6637'}}>正常</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}
export default FluxCharts