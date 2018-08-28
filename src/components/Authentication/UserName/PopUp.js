import React, {Component} from 'react';
import { message, Input, Select } from 'antd'
import axios from 'axios'
import { baseUrl, msgError, setzIndex } from 'utils/common.js'

const Option = Select.Option;

class RolePopUp extends Component {
	constructor (props) {
        super(props)
        this.state = {
            popUpStu: this.props.popUpStu,
            typeId: null,
            typeIds: [],
            id: null,
            name: '',
		    status: 0,
            dictionaries: JSON.parse(localStorage.getItem('dictionaries'))
        }
    }
    componentDidMount() {
        const typeIds = this.state.dictionaries.filter(t => t.dictType === '敏感词')
        this.setState({
            typeIds: typeIds,
        })
    }
    show = (list) => {
        const typeIds = this.state.typeIds
        this.setState({
			popUpStu: true,
			typeId: list.length !== 0 ? list.typeId : typeIds[0].dictId,
            name: list.name,
            id: list.id,
            status: list.length !== 0 ? list.status : 0
		})
		setzIndex(3)
    }
    inputChange = (name, e) => {
        let state = this.state
        state[name] = e.target.value.trim()
        this.setState(state)
    }
    setDictionaries = (id, name) => {
        const dictionaries = this.state.dictionaries
        if (!dictionaries) return;
        const thisOne = dictionaries.filter(t => id === t.id)
        if (id && name.indexOf('Id') > 0 && dictionaries.length > 0) {
            return thisOne[0].dictName
        } else {
            return id || ''
        }
    }
    SelectChange = (name, value) => {
        let state = this.state
        state[name] = value
        this.setState(state)
    }
    ok = () => {
    	const that = this
        const state = this.state
    	axios.post(baseUrl + '/bizBasicDataMinganci/saveOrUpdate', {
            id: state.id,
            typeId: state.typeId,
            name: state.name,
            status: state.status
        }).then(function (res) {
            console.log('-----saveOrUpdate--then------');
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
	        <div className="popUpControl"  style={{display:this.state.popUpStu?'flex':'none'}}>
				<div className="popUpBg"></div>
				<div className="popUpBox popUpUser" style={{height: '380px'}}>
					<i className="popUpClose" id="popUpClose" onClick={this.close}></i>
					<div className="popUpCentent">
						<div className="popUpForm">
							<div className="ovy-a">
								<div className="label-form label-w300">
									<div>
										<label>词汇类别</label>
                                        <div className="selectBox fz0">
                                            <Select onChange={this.SelectChange.bind(this, 'typeId')} value={this.setDictionaries(this.state.typeId, 'typeId')}>
                                                {
                                                    this.state.typeIds.map((t,key) => {
                                                        return <Option value={t.dictId} key={key}>{t.dictName}</Option>
                                                    })
                                                }
                                            </Select>
                                        </div>
									</div>
                                    <div>
                                        <label>敏&ensp;感&ensp;词</label>
                                        <div className="selectBox">
                                            <Input value={this.state.name} onChange={this.inputChange.bind(this, 'name')}/>
                                        </div>
                                    </div>
									<div>
										<label>是否启用</label>
                                        <div className="selectBox fz0">
                                            <Select onChange={this.SelectChange.bind(this, 'status')} value={this.state.status}>
                                                <Option value={0}>启用</Option>
                                                <Option value={1}>禁用</Option>
                                            </Select>
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

export default RolePopUp