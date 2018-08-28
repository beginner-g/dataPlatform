import React, {Component} from 'react';
import CPUCharts from './ServerMonitoringCharts/CPUCharts'
import IstorageCharts from './ServerMonitoringCharts/IstorageCharts'
import SWAPCharts from './ServerMonitoringCharts/SWAPCharts'
import FluxCharts from './ServerMonitoringCharts/FluxCharts'
import FluxCharts1 from './ServerMonitoringCharts/FluxCharts1'
import KeyboardCharts from './ServerMonitoringCharts/KeyboardCharts'
import NumberCharts from './ServerMonitoringCharts/NumberCharts'
import LoadCharts from './ServerMonitoringCharts/LoadCharts'
import scrollsY from 'utils/scroll.min.js'
import axios from 'axios'
import { baseUrl, msgError } from 'utils/common.js'
import { message, Select } from 'antd'

const Option = Select.Option
let timeStu = true
let timec = null

class ServerMonitoring extends Component {
    constructor (props) {
        super(props)
        this.state = {
            iP:'',
            system: '',
            total_disk:0,
            dataHostName: [],
            cpu_number: 0,
            total_memory_system: '',
            // 服务名称
            hostname: '',
            // 已用空间
            used_disk: 0,
            // 可用空间
            usable_disk: 0
        }
    }
    componentDidMount() {
        console.log('***componentDidMount***')
        timeStu = true
        scrollsY()
        this.getAllData()
    }
    componentWillUnmount(){
        console.log('***componentWillUnmount***')
        this.timeError()
    }
    timeLoad = () => {
        if (!timeStu) return;
        const that = this
        this.getData()
        timec = setTimeout(() => {
            that.timeLoad()
        }, 20000);
    }
    timeError = () => {
        timeStu = false
        clearTimeout(timec)
    }
    // 服务器选择
    handleChange(value){
        const dataChange = this.state.dataHostName.filter(t => t.hostname === value)
        this.setDataInit(dataChange[0])
    }
    // 获取所有的服务器
    getAllData = () => {
        const that = this
        axios.get(baseUrl + '/serverMonitor/server/alllist').then(function (res) {
            const data = res.data;
            if (data.code === 0) {
                that.setState({
                    dataHostName: data.data
                })
                const datal = data.data[0]
                that.setDataInit(datal)
                that.getDiskDate(datal.hostname)
                that.timeLoad()
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
    setDataInit = (t) => {
        this.setState({
            ip: t.ip_adress,
            system: t.system,
            total_disk: t.total_disk_space,
            cpu_number: t.cpu_number,
            total_memory_system: t.total_memory_system,
            hostname: t.hostname
        })
    }
    getData = () => {
        const hostname = this.state.hostname
        console.log(hostname)
        this.refs.CPUCharts.getCpuData(hostname)
        this.refs.IstorageCharts.getIstorageData(hostname)
        this.refs.SWAPCharts.getSwapData(hostname)
        this.refs.FluxCharts.getFluxDate(hostname)
        this.refs.FluxCharts1.getFlux1Date(hostname)
        this.refs.KeyboardCharts.getKeyboardDate(hostname)
        this.refs.NumberCharts.getNumberDate(hostname)
        this.refs.LoadCharts.getLoadDate(hostname)
    }
    // 磁盘空间
    getDiskDate = (hostname) => {
        const that = this
        axios.get(baseUrl + `/serverMonitor/server/disk/${hostname}`).then(function (res) {
            const data = res.data;
            if (data.code === 0) {
                let total_disk = data.data.total_disk_space
                let used_disk = data.data.used_disk_space
                let usable = total_disk - used_disk
                that.setState({
                    total_disk: data.data.total_disk_space,
                    used_disk: data.data.used_disk_space,
                    usable_disk: usable
                })
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----disk-catch------');
            message.error(msgError)
        });
    }
    render () {
        let {
            ip,
            system,
            total_disk,
            dataHostName,
            cpu_number,
            total_memory_system,
            used_disk,
            usable_disk
        } = this.state
        total_disk = total_disk === 0 ? 1 : total_disk
        let used_diskLeft = ~~(used_disk / total_disk * 10000) / 100
        let used_diskLeftW = used_diskLeft / 2
        let usable_diskLeftW = (100 - used_diskLeft) / 2 + used_diskLeftW
        used_diskLeft += '%'
        used_diskLeftW += '%'
        usable_diskLeftW += '%'
        return (
            <section className="pageContent echartsServer">
                <div className="content-seat">
                    <header className="operationControl operationControl2">
                        <section className="operationHasl">
                            <h4>服务器监控</h4>
                            <div className="wordBox searchBox">
                                <label>服务器名称</label>
                                <div className="selectBox fz0">
                                    <Select className="popUpDropdown" value={this.state.hostname} onChange={this.handleChange}>
                                        {dataHostName.map((t, key) => {
                                            return <Option key={key} value={t.hostname}>{t.hostname}</Option>
                                        })}
                                    </Select>
                                </div>
                            </div>
                            <div className="wordBox">
                                <label>IP地址</label>
                                <span>{ip}</span>
                            </div>
                            <div className="wordBox">
                                <label>CPU</label>
                                <span>{cpu_number}核，{total_memory_system}G</span>
                            </div>
                        </section>
                        <section className="progressHasl">
                            <div className="wordBox">
                                <label>操作系统</label>
                                <span>{system}</span>
                            </div>
                            <div className="wordBox">
                                <label>硬盘</label>
                                <span>{total_disk}G</span>
                            </div>
                            <div className="progressHas">
                                <div className="progressControl">
                                    <div className="progressBox">
                                        <div className="progressBg">
                                            <div style={{width: used_diskLeft}}></div>
                                        </div>
                                        <span className="userdColor" style={{left: used_diskLeftW}}>
                                            <i></i><br/><em>已用空间：{used_disk}G</em>
                                        </span>
                                        <span style={{left: usable_diskLeftW}}>
                                            <i></i><br/><em>可用空间：{usable_disk}G</em>
                                        </span>
                                    </div>
                                </div>
                                <div className="wordBox">
                                    <span>磁盘总量：{total_disk}G</span>
                                </div>
                            </div>
                        </section>
                    </header>
                    <section className="cententMain">
                        <div className="scrollbox">
                            <div className="ovy-a">
                                <div className="echarts-server">
                                    <section className="chart_l chart_s1">
                                        <div className="echart-title">
                                            <h4>CPU监控</h4>
                                        </div>
                                        <div className="echart-box">
                                            <CPUCharts ref="CPUCharts" timeError={this.timeError}/>
                                        </div>
                                    </section>
                                    <section className="chart_t chart_s22">
                                        <section>
                                            <div className="echart-title">
                                                <h4>真实内存监控</h4>
                                            </div>
                                            <div className="echart-box">
                                                <IstorageCharts ref="IstorageCharts" timeError={this.timeError}/>
                                            </div>
                                        </section>
                                        <i></i>
                                        <section>
                                            <div className="echart-title">
                                                <h4>SWAP内存监控</h4>
                                            </div>
                                            <div className="echart-box">
                                                <SWAPCharts ref="SWAPCharts" timeError={this.timeError}/>
                                            </div>
                                        </section>
                                    </section>
                                    <section className="chart_l chart_s3">
                                        <div className="echart-title">
                                            <h4>网络流量监控</h4>
                                        </div>
                                        <div className="echart-box">
                                            <FluxCharts ref="FluxCharts" timeError={this.timeError}/>
                                            <FluxCharts1 ref="FluxCharts1" timeError={this.timeError}/>
                                        </div>
                                    </section>
                                    <section className="chart_l chart_s4">
                                        <div className="echart-title">
                                            <h4>磁盘监控</h4>
                                        </div>
                                        <div className="echart-box">
                                            <KeyboardCharts ref="KeyboardCharts" timeError={this.timeError}/>
                                        </div>
                                    </section>
                                    <section className="chart_t chart_s52">
                                        <section>
                                            <div className="echart-title">
                                                <h4>连接数量监控</h4>
                                            </div>
                                            <div className="echart-box">
                                                <NumberCharts ref="NumberCharts" timeError={this.timeError}/>
                                            </div>
                                        </section>
                                        <section>
                                            <div className="echart-title">
                                                <h4>系统平均负载监控</h4>
                                            </div>
                                            <div className="echart-box">
                                                <LoadCharts ref="LoadCharts" timeError={this.timeError}/>
                                            </div>
                                        </section>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        )
    }
}

export default ServerMonitoring