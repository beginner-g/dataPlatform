import React, {Component} from 'react';
import { message } from 'antd'
import axios from 'axios'
import { baseUrl, msgError } from 'utils/common.js'

class ListBox extends Component {
	constructor (props) {
        super(props)
        this.state = {
            list: [{disableIPs: []}],
            index: 0
        }
    }
    load = (list, value) => {
        this.setState({
			list: list,
            index: value
		})
    }
    change = (key) => {
		this.props.showPopUp(this.state.list, 'change', this.state.index, key)
    }
    del = (key) => {
        const that = this
        let list = this.state.list[this.state.index];
        let disableIPs = list.disableIPs
        disableIPs.splice(key, 1)
        list.disableIPs = disableIPs
        axios.post(baseUrl + '/serverMonitor/server/update', list).then(function (res) {
            console.log('-----serverMonitor--then------');
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
        const lists = this.state.list[this.state.index]
     	return (
	        <div className="tableList-seat">
				{
                    lists.disableIPs.map((t,key) => {
    					return (
                            <div className="tableList-cell" key={key}>
                                <div className="tablelist-tr">
                                    <div><span>{lists.hostname}</span></div>
                                    <div><span>{lists.ip_adress}</span></div>
                                    <div><span>{t}</span></div>
                                </div>
                                <div className="tablelist-btns">
                                    <button className="tableBtn-blue" onClick={this.change.bind(this, key)}>修改</button>
                                    <button className="tableBtn-red" onClick={this.del.bind(this, key)}>删除</button>
                                </div>
                            </div>
    					)
    				})
                }
			</div>
     	)
 	}
}

export default ListBox