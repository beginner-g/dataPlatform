import React, {Component} from 'react';
import { message, Input } from 'antd'
import axios from 'axios'
import { baseUrl, msgError } from 'utils/common.js'
import scrollsY from 'utils/scroll.min.js'

class UserManager extends Component {
	constructor (props) {
        super(props)
        let userJson = JSON.parse(localStorage.getItem('user'))
        this.state = {
            popUpStu: this.props.popUpStu,
            user: userJson
        }
    }
    inputChange = (name, e) => {
        let user = this.state.user
        user[name] = e.target.value.trim()
        this.setState({
            user: user
        })
    }
    ok = () => {
        const user = this.state.user
        if (user.username.trim() === '') {
            message.warning('真实姓名不能为空')
            return;
        }
        const telephone = user.telephone.trim()
        if (telephone === '') {
            message.warning('手机不能为空')
            return;
        }
        var tels = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!tels.test(telephone)) {
            message.warning('请输入正确的手机号')
            return;
        }
        const that = this
        axios.post(baseUrl + '/bizBasicDataUser/updatePersonal', user).then(function (res) {
            const data = res.data;
            if (data.code === 0) {
                message.success(data.msg)
                user.password = ''
                localStorage.setItem('user', JSON.stringify(user))
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
    Reset = () => {
        this.setState({
            user: JSON.parse(localStorage.getItem('user'))
        })
    }
 	render () {
     	return (
	        <section className="pageContent">
				<div className="content-seat">
					<header className="operationControl">
                        <section>
    						<h4>个人信息</h4>
                        </section>
					</header>
					<section className="cententMain">
						<div className="scrollbox">
							<div className="ovy-a userContorl">
                                <div className="label-form">
                                    <div>
                                        <label>真实姓名</label>
                                        <div className="selectBox">
                                            <Input value={this.state.user.username} onChange={this.inputChange.bind(this, 'username')}/>
                                        </div>
                                    </div>
                                    <div>
                                        <label>手&ensp;机&ensp;号</label>
                                        <div className="selectBox">
                                            <Input value={this.state.user.telephone} onChange={this.inputChange.bind(this, 'telephone')}/>
                                        </div>
                                    </div>
                                    <div>
                                        <label>密&emsp;&emsp;码</label>
                                        <div className="selectBox">
                                            <Input type="password" value={this.state.user.password} onChange={this.inputChange.bind(this, 'password')}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="popUpBtn">
                                    <button className="pBtn-ok" id="pBtn-ok" onClick={this.ok}>确定</button>
                                    <button className="pBtn-cancel" id="pBtn-cancel" onClick={this.Reset}>重置</button>
                                </div>
							</div>
						</div>
					</section>
				</div>
			</section>
     	)
 	}
}

export default UserManager