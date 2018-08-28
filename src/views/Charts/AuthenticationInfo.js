import React, {Component} from 'react';
import {ComposedChart, Line, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts'
import Charts from './AuthenticationInfoCharts/Charts'
import Charts1 from './AuthenticationInfoCharts/Charts1'
import axios from 'axios'
import { msgError, baseUrl } from 'utils/common.js'
import { message } from 'antd'
import scrollsY from 'utils/scroll.min.js'

let timeStu = true
let timec = null

class AuthenticationInfo extends Component {
    constructor (props) {
        super(props)
        this.state = {
            showData: [],
            regList: [],
            authList: []
        }
    }
    componentDidMount() {
        console.log('***componentDidMount***')
        scrollsY()
        timeStu = true
        this.timeLoad()
    }
    componentWillUnmount(){
        console.log('***componentWillUnmount***')
        this.timeError()
        timeStu = false
    }
    timeLoad = () => {
        if (!timeStu) return;
        const that = this
        this.getMonitoringRegList()
        this.refs.AuthTrendReq.getRegTrendReq()
        this.getMonitoringAuthList()
        this.refs.AuthTrendReq1.getAuthTrendReq()
        timec = setTimeout(() => {
            that.timeLoad()
        }, 20000);
    }
    timeError = () => {
        timeStu = false
        clearTimeout(timec)
    }
    getMonitoringRegList = () => {
        const that = this
        axios.post(baseUrl + '/msgManage/getMonitoringRegList').then(function(res) {
            const data = res.data;
            if (data.code === 0) {
                that.setState({
                    regList: data.data
                })
            } else {
                message.error(data.msg)
                that.timeError()
            }
        }).catch(function(error) {
            console.log('-----catch------');
            message.error(msgError)
            that.timeError()
        });
    }

    getMonitoringAuthList = () => {
        const that = this
        axios.post(baseUrl + '/msgManage/getMonitoringAuthList').then(function(res) {
            const data = res.data;
            if (data.code === 0) {
                that.setState({
                    authList: data.data
                })
            } else {
                message.error(data.msg)
                that.timeError()
            }
        }).catch(function(error) {
            console.log('-----catch------');
            message.error(msgError)
            that.timeError()
        });
    }
    render () {
        const { regList, authList } = this.state
        return (
            <section className="pageContent echartsRz">
                <div className="content-seat">
                    <header className="operationControl">
                        <h4>认证信息监控</h4>
                    </header>
                    <section className="cententMain">
                        <div className="scrollbox">
                            <div className="ovy-a">
                                <div className="echarts-rz">
                                    <section>
                                        <div className="echart-c">
                                            <div className="echart-title">
                                                <h4>实时用户注册信息</h4>
                                            </div>
                                            <div className="echart-box chartable">
                                                <section>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <td>平台</td>
                                                                <td>姓名</td>
                                                                <td>手机号</td>
                                                                <td>注册时间</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                          {
                                                            regList.map((t,i) => {
                                                                return <tr key={t.id} className={i === 1 ? 'cur-chartable': ''}>
                                                                  <td>{t.platform}</td>
                                                                  <td>{t.userName}</td>
                                                                  <td>{t.cellPhoneNumber}</td>
                                                                  <td>{t.authTime}</td>
                                                                </tr>
                                                              })
                                                          }
                                                        </tbody>
                                                    </table>
                                                </section>
                                            </div>
                                        </div>
                                        <i></i>
                                        <div className="echart-r">
                                            <div className="echart-title">
                                                <h4>实时用户注册走势图</h4>
                                            </div>
                                            <div className="echart-box">
                                                <Charts ref="AuthTrendReq"  timeError={this.timeError}/>
                                            </div>
                                        </div>
                                    </section>
                                    <section>
                                        <div className="echart-c">
                                            <div className="echart-title">
                                                <h4>不同等级认证信息</h4>
                                            </div>
                                            <div className="echart-box chartable">
                                                <section>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <td>等级</td>
                                                                <td>姓名</td>
                                                                <td>手机号</td>
                                                                <td>认证时间</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                          {
                                                            authList.map((t,i) => {
                                                              return <tr key={i} className={i === 1 ? 'cur-chartable' : ''}>
                                                                  <td>{t.authGrade}</td>
                                                                  <td>{t.userName}</td>
                                                                  <td>{t.cellPhoneNumber}</td>
                                                                  <td>{t.authTime}</td>
                                                              </tr>
                                                            })
                                                          }
                                                        </tbody>
                                                    </table>
                                                </section>
                                            </div>
                                        </div>
                                        <i></i>
                                        <div className="echart-r">
                                            <div className="echart-title">
                                                <h4>不同等级认证走势图</h4>
                                            </div>
                                            <div className="echart-box">
                                                <Charts1 ref="AuthTrendReq1" timeError={this.timeError} />
                                            </div>
                                        </div>
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

export default AuthenticationInfo