import React, {Component} from 'react';
import { message } from 'antd'
import axios from 'axios'
import { baseUrl, msgError } from 'utils/common.js'

class CradBox extends Component {
	constructor (props) {
        super(props)
        this.state = {
        	list: this.props.list,
        }
    }
    load = (list) => {
        this.setState({
			list: list,
		})
    }
    change = (key) => {
		const filterData = this.state.list[key]
		this.props.showPopUp(filterData, 'change')
    }
    frozen = (id, stu) => {
        const that = this
        axios.get(baseUrl + '/bizBasicDataUser/freeze/'+id+'/'+stu).then(function (res) {
            console.log('-----freeze--then------');
            const data = res.data;
            if (data.code === 0) {
                that.props.getDatad()
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
    del = (id) => {
    	const that = this
    	console.log(id)
    	axios.get(baseUrl + '/bizBasicDataUser/delete/'+id).then(function (res) {
            console.log('-----delete--then------');
            const data = res.data;
            if (data.code === 0) {
            	that.props.getDatad()
            } else {
            	message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
 	render () {
     	return (
	        <div className="scrollbox-seat">
				{this.state.list.map((t,key) => {
					return (
						<div className="cardBox cardBoxH" key={key} id={t.bizBasicDataUser.id}>
							<div className="cardSeat">
                                {
                                    t.bizBasicDataUser.status === 1 ?
                                    <button className="card-changeBtn del-red" onClick={this.frozen.bind(this, t.bizBasicDataUser.id, 0)}>停用</button> :
                                    <button className="card-changeBtn" onClick={this.frozen.bind(this, t.bizBasicDataUser.id, 1)}>启用</button>
                                }
								<div className="label-form">
									<div>
										<label>用&ensp;户&ensp;名</label>
										<span>{t.bizBasicDataUser.usercode}</span>
									</div>
                                    <div>
                                        <label>真实姓名</label>
                                        <span>{t.bizBasicDataUser.username}</span>
                                    </div>
									<div>
										<label>密&emsp;&emsp;码</label>
										<span>{t.bizBasicDataUser.password}</span>
									</div>
									<div>
										<label>角&emsp;&emsp;色</label>
										<span title={
                                            t.bizBasicDataRoles.map((t1,key1) => {
                                                return t1.name+' '
                                            })
                                        }>
                                            {
                                                t.bizBasicDataRoles.map((t1,key1) => {
                                                    return <em key={key1}>{t1.name}</em>
                                                })
                                            }
                                        </span>
									</div>
								</div>
								<div className="card-btn">
									<i></i>
									<button onClick={this.change.bind(this, key)}>修改</button>
									<i>/</i>
                                    <button className="del-red" onClick={this.del.bind(this, t.bizBasicDataUser.id)}>删除</button>
                                    <i className="del-red"></i>
								</div>
							</div>
						</div>
					)
				})}
			</div>
     	)
 	}
}

export default CradBox