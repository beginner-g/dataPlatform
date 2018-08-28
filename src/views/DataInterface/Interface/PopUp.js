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
            list: {},
            stu: 'add',
            dictionaries: JSON.parse(localStorage.getItem('dictionaries')),
            platforms: [],
            types: [],
            methods: []
        }
    }
    componentDidMount() {
        const dictionaries = this.state.dictionaries
        this.setState({
            platforms: dictionaries.filter(t => '平台' === t.dictType),
            types: dictionaries.filter(t => '接口类别' === t.dictType),
            methods: dictionaries.filter(t => '请求方式' === t.dictType)
        })
    }
    setDictionaries = (id, name) => {
        const dictionaries = this.state.dictionaries
        const thisOne = dictionaries.filter(t => id === t.id)
        if (id && name.indexOf('Id') > 0 && dictionaries.length > 0) {
            return thisOne[0].dictName
        } else {
            return id || ''
        }
    }
    SelectChange = (name, value) => {
        let list = this.state.list
        list[name] = value
        this.setState({
            list: list
        })
    }
    formChange = (e) => {
        const target = e.target
        let list = this.state.list
        list[target.name] = target.value
        this.setState({
            list: list
        })
    }
    show = (list, stu) => {
        const dictionaries = this.state.dictionaries
        if (stu === 'add') {
            list = {
                platformId: dictionaries.filter(t => '平台' === t.dictType)[0].id,
                typeId: dictionaries.filter(t => '接口类别' === t.dictType)[0].id,
                methodId: dictionaries.filter(t => '请求方式' === t.dictType)[0].id,
                requestExample: '',
                responseExample: ''
            }
        }
        this.setState({
            popUpStu: true,
            list: list,
            stu: stu
        })
        setzIndex(3)
        scrollsY()
    }
    ok = () => {
        let list = this.state.list
        if (list.name.trim() === '') {
            message.warning('接口名称不能为空')
            return;
        }
        if (list.address.trim() === '') {
            message.warning('接口地址不能为空')
            return;
        }
        const that = this
        axios.post(baseUrl + '/bizBasicDataInterfaceManage/saveOrUpdate', this.state.list).then(function (res) {
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
    close = () => {
        this.setState({
            popUpStu: false
        })
        setzIndex(1)
    }
    render () {
        return (
            <div className="popUpControl popUpLong popUpLongInputs" style={{display:this.state.popUpStu?'flex':'none'}}>
                <div className="popUpBg"></div>
                <div className="popUpBox">
                    <i className="popUpClose" id="popUpClose" onClick={this.close}></i>
                    <div className="popUpCentent">
                        <div className="popUpTitle">
                            <h4>平台接口管理> 新增</h4>
                        </div>
                        <div className="popUpForm">
                            <div className="ovy-a">
                                <div className="popUpImgForm">
                                    <div className="label-form">
                                        <div>
                                            <label>平&emsp;&emsp;台</label>
                                            <div className="selectBox fz0">
                                                <Select onChange={this.SelectChange.bind(this, 'platformId')} value={this.setDictionaries(this.state.list.platformId, 'platformId')}>
                                                    {
                                                        this.state.platforms.map((t,key) => {
                                                            return <Option value={t.dictId} key={key}>{t.dictName}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <label>接口类别</label>
                                            <div className="selectBox fz0">
                                                <Select onChange={this.SelectChange.bind(this, 'typeId')} value={this.setDictionaries(this.state.list.typeId, 'typeId')}>
                                                    {
                                                        this.state.types.map((t,key) => {
                                                            return <Option value={t.dictId} key={key}>{t.dictName}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <label>接口名称</label>
                                            <div className="selectBox">
                                                <Input value={this.state.list.name} onChange={this.formChange} name="name"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label>接口地址</label>
                                            <div className="selectBox">
                                                <Input value={this.state.list.address} onChange={this.formChange} name="address"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label>请求方式</label>
                                            <div className="selectBox fz0">
                                                <Select onSelect={this.SelectChange.bind(this, 'methodId')} value={this.setDictionaries(this.state.list.methodId, 'methodId')}>
                                                    {
                                                        this.state.methods.map((t,key) => {
                                                            return <Option value={t.dictId} key={key}>{t.dictName}</Option>
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <label>返回格式</label>
                                            <div className="selectBox">
                                                <Input value={this.state.list.returnFormat} onChange={this.formChange} name="returnFormat"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="label-form">
                                        <div>
                                            <label>请求示例</label>
                                            <div className="textareaBox">
                                                <div className="scroll_seat">
                                                    <div className="ovy-a">
                                                        <textarea name="requestExample" value={this.state.list.requestExample} onChange={this.formChange}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label>返回示例</label>
                                            <div className="textareaBox">
                                                <div className="scroll_seat">
                                                    <div className="ovy-a">
                                                        <textarea name="responseExample" value={this.state.list.responseExample} onChange={this.formChange}></textarea>
                                                    </div>
                                                </div>
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