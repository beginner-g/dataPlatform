import React, {Component} from 'react';
import scrollsY from 'utils/scroll.min.js'
import { message, Input, Select, Checkbox } from 'antd'
import axios from 'axios'
import { axiosText } from 'utils/fetch.js'
import { baseUrl, msgError, setzIndex } from 'utils/common.js'

const Option = Select.Option;

class RolePopUp extends Component {
	constructor (props) {
        super(props)
        this.state = {
            popUpStu: this.props.popUpStu,
		    list: {
		    	bizBasicDataRoles: [],
		    	bizBasicDataUser: {}
		    },
		    rolelist: [],
		    stu: 'add'
        }
    }
    show = (list, stu) => {
    	stu = stu || 'add'
    	list = stu === 'add' ? {
	    	bizBasicDataRoles: [],
	    	bizBasicDataUser: {}
	    } : list;
    	this.setState({
			popUpStu: true,
			list: list,
			stu: stu
		})
		this.setData(list.bizBasicDataUser)
		if (list.bizBasicDataUser) {
			this.getAllRole(list.bizBasicDataUser.id)
		} else {
			this.getAllRole(null)
		}
		setzIndex(3)
    }
    setData = (list) => {
    	let formUser = document.getElementById('formUser')
    	if (formUser) {
    		formUser.value = list.usercode || ''
    	} else {
    		document.getElementById('formUser2').innerHTML = list.usercode || ''
    	}
    	document.getElementById('formName').value = list.username || ''
    	document.getElementById('formPass').value = list.password || ''
    }
    ok = () => {
    	let that = this
    	let trueList = this.state.list
    	let list = trueList.bizBasicDataUser;
    	let formUser = document.getElementById('formUser')
    	if (formUser) {
    		if (formUser.value.trim() === '') {
	    		message.warning('用户名不能为空')
	    		return;
	    	} else {
	    		list.usercode = formUser.value.trim()
	    	}
    	}
    	let formName = document.getElementById('formName');
    	if (formName.value.trim() === '') {
    		message.warning('真实姓名不能为空')
    		return;
    	}
    	let formPass = document.getElementById('formPass');
    	if (formPass.value.trim() === '') {
    		message.warning('密码不能为空')
    		return;
    	}
    	list.username = formName.value.trim()
    	list.password = formPass.value.trim()

    	// roleIds
    	let checks = document.getElementsByName('role')
    	let checkeds = []
    	for(let k in checks){
	        if(checks[k].checked) checkeds.push(checks[k].id);
	    }
	    let checkedIds = new Array(checkeds);
	    list.roleIds = checkedIds.join(',')

    	trueList.bizBasicDataUser = list
    	this.setState({
			list: trueList
		})
    	axios.post(baseUrl + '/bizBasicDataUser/saveOrUpdate', list).then(function (res) {
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
    checkChange = (key, e) => {
    	let rolelist = this.state.rolelist
    	rolelist[key].selected = e.target.checked
    	this.setState({
	      	rolelist: rolelist
	    });
    }
    handleChange = (value) => {
    	let trueList = this.state.list
    	let list = trueList.bizBasicDataUser
    	list.status = parseInt(value)
    	trueList.bizBasicDataUser = list
    	this.setState({
			list: trueList
		})
    }
    getAllRole = (id) => {
    	const that = this
    	var rurl = '/bizBasicDataRole/listFront'
    	if (id) rurl += '?id=' + id
    	axiosText({
            url: rurl
        }).then(function(res){
            console.log('-----listFront--then------');
            const data = res.data;
            if (data.code === 0) {
                that.setState({
					rolelist: data.data
				})
				scrollsY()
            } else {
                message.error(data.msg)
            }
        }).catch(function(error){
            console.log('-----catch------');
            message.error(msgError)
        });
    }
    componentDidMount() {
	}
 	render () {
     	return (
	        <div className="popUpControl"  style={{display:this.state.popUpStu?'flex':'none'}}>
				<div className="popUpBg"></div>
				<div className="popUpBox" style={{height: '460px'}}>
					<i className="popUpClose" id="popUpClose" onClick={this.close}></i>
					<div className="popUpCentent">
						<div className="popUpForm">
							<div className="ovy-a">
								<div className="label-form label-w300">
									<div>
										<label>用&ensp;户&ensp;名</label>
										{
											this.state.stu === "add" ?
											(<div className="selectBox">
												<Input id="formUser"/>
											</div>) :
											<span className="textBox" id="formUser2">{this.state.list.bizBasicDataUser.usercode}</span>
										}
									</div>
									<div>
										<label>真实姓名</label>
										<div className="selectBox">
											<Input defaultValue={this.state.list.bizBasicDataUser.username} id="formName"/>
										</div>
									</div>
									<div>
										<label>密&emsp;&emsp;码</label>
										<div className="selectBox">
											<Input defaultValue={this.state.list.bizBasicDataUser.password} id="formPass"/>
										</div>
									</div>
									<div>
										<label>角&emsp;&emsp;色</label>
										<div className="checkBox fz0">
											{
                                                this.state.rolelist.map((t1,key1) => {
                                                    return <Checkbox key={key1} id={t1.id} name="role" checked={t1.selected ? true : false} onChange={this.checkChange.bind(this, key1)}>{t1.name}</Checkbox>
                                                })
                                            }
									    </div>
									</div>
									<div>
										<label>状&emsp;&emsp;态</label>
										<div className="selectBox fz0">
									    	<Select className="popUpDropdown" defaultValue='启用' value={this.state.list.bizBasicDataUser.status === 0 ? '停用' : '启用'} onChange={this.handleChange}>
										      	<Option value="1">启用</Option>
										      	<Option value="0">停用</Option>
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