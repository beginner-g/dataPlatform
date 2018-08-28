import React, {Component} from 'react';
import { message } from 'antd'
import axios from 'axios'
import { baseUrl, msgError } from 'utils/common.js'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/chart/line';

let myChart = null

class FluxCharts extends Component {
    constructor (props) {
        super(props)
        this.state = {
            max_write: 0,
            avg_write: 0,
            max_read: 0,
            avg_read: 0,
            disk_io_read_bytes: [],
            disk_io_write_bytes: [],
            datetime:[]
        }
    }
    componentDidMount() {
        this.setEchart()
    }
    setEchart = () => {
        const dom = document.getElementById('echart3')
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
                left: 'left',
                align:"left",
                top:"0",
                left:"0",
                itemWidth: 15,
                itemHeight: 8,
                data: [{name: '写入'}, {name: '读取'}],
                textStyle: {
                    color: ['#b1e7fd']
                },
                icon: 'stack'
            },
            grid: {
                left: '8%',
            right: '8%',
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
                name: '利用率',
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
            },
            series: [
               {
                    name: '读取',
                    type: 'line',
                    stack: 'line',
                    itemStyle: {
                        normal: {
                            color: '#ed6637'
                        }
                    }
                },
                {
                    name: '写入',
                    type: 'line',
                    stack: 'line',
                    itemStyle: {
                        normal: {
                            color: '#baef35'
                        }
                    }
                }
            ]
        })
    }
    componentDidUpdate() {
        myChart.setOption({
            xAxis: {
                data: this.state.datetime,
            },
            series: [
                {
                    data: this.state.disk_io_read_bytes,
                }, {
                    data: this.state.disk_io_write_bytes,
                }
            ]
        })
    }
    getKeyboardDate = (hostnameProp) => {
        if (!myChart) this.setEchart()
        const that = this
        axios.get(baseUrl + `/serverMonitor/server/diskIo/${hostnameProp}`).then(function (res) {
            const data = res.data;

            if (data.code === 0) {
                if (JSON.stringify(data.data) === '{}' || data.data.list.length === 0) {
                    message.warning('暂无数据')
                    return;
                }
                let disk_io_write_bytes = []
                let disk_io_read_bytes = []
                let datetime = []
                for (var i = 0; i < data.data.list.length; i++) {
                    const dataOption = data.data.list[i]
                    // 写入
                    disk_io_write_bytes.push(dataOption.disk_io_write_bytes)
                    // 读取
                    disk_io_read_bytes.push(dataOption.disk_io_read_bytes)

                    const date = new Date(dataOption.datetime)
                    const getHours = date.getHours()
                    let getMinutes = date.getMinutes()

                    if (getMinutes < 10) {
                        getMinutes = '0' + getMinutes
                    }

                    datetime.push(getHours + ':' + getMinutes)
                }
                that.setState({
                    max_write: data.data.max_write,
                    avg_write: data.data.avg_write.toFixed(2),
                    max_read: data.data.max_read.toFixed(2),
                    avg_read: data.data.avg_read.toFixed(2),
                    disk_io_write_bytes: disk_io_write_bytes,
                    disk_io_read_bytes: disk_io_read_bytes,
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
        const {
            max_write,
            avg_write,
            max_read,
            avg_read
        } = this.state
        return (
            <div className="flux-box">
                <div id="echart3">
                </div>
                <div className="flux-sign">
                    <div className="flux-sign-box">
                        <h3 style={{color: '#baef35'}}>写入</h3>
                        <p>
                            <span>今日峰值</span>
                            <span style={{color: '#baef35'}}>{max_write}G</span>
                        </p>
                        <p>
                            <span>今日均值</span>
                            <span style={{color: '#baef35'}}>{avg_write}G</span>
                        </p>
                    </div>
                    <div className="flux-sign-box">
                        <h3 style={{color: '#ed6637'}}>读取</h3>
                        <p>
                            <span>今日峰值</span>
                            <span style={{color: '#ed6637'}}>{max_read}G</span>
                        </p>
                        <p>
                            <span>今日均值</span>
                            <span style={{color: '#ed6637'}}>{avg_read}G</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}
export default FluxCharts