import React, {Component} from 'react';
import scrollsY from 'utils/scroll.min.js'
import { message, Input, Select } from 'antd'
import axios from 'axios'
import { axiosText } from 'utils/fetch.js'
import { baseUrl, msgError, setzIndex } from 'utils/common.js'

const Option = Select.Option;

class PopUpBox extends Component {
    constructor (props) {
        super(props)
        this.state = {
            popUpStu: this.props.popUpStu,
            list: [{ hostname:'',disableIPs: ['']}],
            stu: 'add',
            key: 0,
            index: 0
        }
    }
    show = (list, stu, index, key) => {
        this.setState({
            popUpStu: true,
            list: list,
            stu: stu,
            key: key,
            index: index
        })
        setzIndex(3)
        scrollsY()
        this.empty(list[index], stu, key)
    }
    empty = (list, stu, key) => {
        let ips = ['','','','']
        if (stu !== 'add') ips = list.disableIPs[key].split('.')
        document.getElementById('disableIPs1').value = ips[0] || ''
        document.getElementById('disableIPs2').value = ips[1] || ''
        document.getElementById('disableIPs3').value = ips[2] || ''
        document.getElementById('disableIPs4').value = ips[3] || ''
    }
    ok = () => {
        let that = this
        const disableIPs1 = document.getElementById('disableIPs1').value.trim();
        const disableIPs2 = document.getElementById('disableIPs2').value.trim();
        const disableIPs3 = document.getElementById('disableIPs3').value.trim();
        const disableIPs4 = document.getElementById('disableIPs4').value.trim();
        if (disableIPs1 === '' || disableIPs2 === '' || disableIPs3 === '' || disableIPs4 === '') {
            message.warning('限制IP不能为空')
            return;
        }
        let trueList = this.state.list
        let list = trueList[this.state.index];
        let disableIPs = list.disableIPs
        const thisIp = disableIPs1+'.'+disableIPs2+'.'+disableIPs3+'.'+disableIPs4
        if (disableIPs.includes(thisIp)) {
            message.warning('请勿禁止同一个ip')
            return;
        }
        if (this.state.stu === 'change') {
            disableIPs[this.state.key] = thisIp
        } else {
            disableIPs.splice(0,0,thisIp)
        }
        trueList[this.state.index] = list
        this.setState({
            list: trueList
        })
        axios.post(baseUrl + '/serverMonitor/server/update', list).then(function (res) {
            console.log('-----treeSave--then------');
            const data = res.data;
            if (data.code === 0) {
                that.props.getDatad()
                that.close()
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
    ipChange = (id) => {
        const el = document.getElementById(id)
        let value = el.value.trim()
        const re = /^[0-9]+.?[0-9]*$/;
    　　if (!re.test(value)) {
    　　　　message.warning('请输入数字')
    　　} else {
            if (value < 0) el.value = 0
            if (value > 255) el.value = 255
        }
    }
    close = () => {
        this.setState({
            popUpStu: false
        })
        setzIndex(1)
    }
    componentDidMount() {
    }
    render () {
        const tlist = this.state.list[this.state.index]

        return (
            <div className="popUpControl popUpsIp" style={{display:this.state.popUpStu?'flex':'none'}}>
                <div className="popUpBg"></div>
                <div className="popUpBox">
                    <i className="popUpClose" id="popUpClose" onClick={this.close}></i>
                    <div className="popUpCentent">
                        <div className="popUpForm">
                            <div className="ovy-a">
                                <div className="label-form">
                                    <div>
                                        <label>服务器名称</label>
                                        <div className="selectBox fz0 inputBox2">
                                            <Select onChange={this.handleChange} value={tlist.hostname}>
                                                {
                                                    this.state.list.map((t,key) => {
                                                        return <Option value={key} key={key}>{t.hostname}</Option>
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <label>限制IP</label>
                                        <div className="inputBoxs">
                                            <div className="inputBox2">
                                                <Input id="disableIPs1" onChange={this.ipChange.bind(this, 'disableIPs1')}/>
                                            </div>
                                            <i></i>
                                            <div className="inputBox2">
                                                <Input id="disableIPs2" onChange={this.ipChange.bind(this, 'disableIPs2')}/>
                                            </div>
                                            <i></i>
                                            <div className="inputBox2">
                                                <Input id="disableIPs3" onChange={this.ipChange.bind(this, 'disableIPs3')}/>
                                            </div>
                                            <i></i>
                                            <div className="inputBox2">
                                                <Input id="disableIPs4" onChange={this.ipChange.bind(this, 'disableIPs4')}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="popUpBtn">
                            <button className="pBtn-ok" id="pBtn-ok" onClick={this.ok}>确定</button>
                            <button className="pBtn-cancel" id="pBtn-cancel" onClick={this.close}>取消</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopUpBox