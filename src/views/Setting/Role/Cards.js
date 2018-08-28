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
		this.props.showPopUp(filterData)
    }
    frozen = (id, stu) => {
    	const that = this
    	axios.get(baseUrl + '/bizBasicDataRole/freeze/'+id+'/'+stu).then(function (res) {
            console.log('-----freeze..then------');
            const data = res.data;
            if (data.code === 0) {
            	that.props.getDatad()
            } else {
            	message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----freeze..catch------');
            message.error(msgError)
        });
    }
 	render () {
     	return (
	        <div className="scrollbox-seat">
				{this.state.list.map((t,key) => {
					return (
						<div className="cardBox" key={key} id={t.id}>
							<div className="cardSeat">
								<div className="label-form">
									<div>
										<label>角色名称</label>
										<span>{t.name}</span>
									</div>
									<div>
										<label>描&emsp;&emsp;述</label>
										<span>{t.remark}</span>
									</div>
									<div>
										<label>状&emsp;&emsp;态</label>
										<span>{t.status === 1 ? '有效' : '冻结'}</span>
									</div>
								</div>
								<div className="card-btn">
									<i></i>
									<button onClick={this.change.bind(this, key)}>修改</button>
									<i>/</i>
									{
										t.status === 1 ?
										<button className="del-red" onClick={this.frozen.bind(this, t.id, 0)}>冻结</button> :
										<button className="" onClick={this.frozen.bind(this, t.id, 1)}>解冻</button>
									}
									<i className={t.status === 0 ? '' : 'del-red'}></i>
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