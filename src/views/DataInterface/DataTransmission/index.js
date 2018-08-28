import React, {Component} from 'react';
import scrollsY from 'utils/scroll.min.js'
import DataTransmissionCharts from './charts'
import { message } from 'antd'
import axios from 'axios'
import { axiosText } from 'utils/fetch.js'
import { baseUrl, msgError } from 'utils/common.js'

let timeStu = true
let timec = null

class DataTransmission extends Component {
	constructor (props) {
        super(props)
        this.state = {
            list: []
        }
    }
    componentDidMount() {
        console.log('***componentDidMount***')
        scrollsY()
        timeStu = true
        this.getData()
    }
    componentWillUnmount(){
        console.log('***componentWillUnmount***')
        this.timeError()
    }
    getData = () => {
        const that = this
        axios.get(baseUrl + '/bizBasicDataInterfaceLog/list').then(function (res) {
            const data = res.data;
            if (data.code === 0) {
                if (data.data.length === 0) {
                    console.log('-----no data------');
                    return;
                }
                that.setState({
                    list: data.data
                })
                that.refs.charts.show(data.data);
                that.setTimeDate()
            } else {
                message.error(data.msg)
                that.timeError()
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
            that.timeError()
        });
    }
    setTimeDate = (t) => {
        if (!timeStu) return;
        t = t || 16000
        const that = this
        timec = setTimeout(function(){
            that.getData()
        }, t);
    }
    timeError = () => {
        timeStu = false
        clearTimeout(timec)
    }
    getDatef = (t) => {
        t = new Date(t)
        const m = (t.getMonth() + 1) > 9 ? (t.getMonth() + 1) : '0' + (t.getMonth() + 1)
        const d = t.getDate() > 9 ? t.getDate() : '0' + t.getDate()
        const h = t.getHours()
        const mm = t.getMinutes()
        return m+'-'+d+' '+h+':'+mm
    }
 	render () {
     	return (
	        <section className="pageContent echartsData">
                <div className="content-seat">
                    <header className="operationControl">
                        <h4>数据传输管理</h4>
                    </header>
                    <section className="cententMain">
                        <div className="scrollbox">
                            <div className="ovy-a">
                                <div className="echarts-data">
                                    <div className="echart-r">
                                        <div className="echart-title">
                                            <h4>接口调用实时动态</h4>
                                        </div>
                                        <div className="echart-box">
                                            <DataTransmissionCharts ref="charts"/>
                                        </div>
                                    </div>
                                    <div className="echart-c">
                                        <div className="echart-title">
                                            <h4>接口调用信息</h4>
                                        </div>
                                        <div className="echart-box chartable">
                                            <section>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <td>接口名称</td>
                                                            <td>今日总调用量</td>
                                                            <td>最新调用时间</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.state.list.map((t, key) => {
                                                                if (key < 3)
                                                                return (<tr key={key}>
                                                                    <td>{t.name}</td>
                                                                    <td>{t.count}</td>
                                                                    <td>{this.getDatef(t.time)}</td>
                                                                </tr>)
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
     	)
 	}
}

export default DataTransmission