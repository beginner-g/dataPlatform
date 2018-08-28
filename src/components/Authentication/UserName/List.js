import React, {Component} from 'react';
import { message, Checkbox } from 'antd'
import axios from 'axios'
import { baseUrl, msgError } from 'utils/common.js'

class ListBox extends Component {
	constructor (props) {
        super(props)
        this.state = {
            list: [],
            thead: this.props.thead,
            dictionaries: JSON.parse(localStorage.getItem('dictionaries'))
        }
    }
    load = (list, num) => {
        this.setState({
			list: num === 1 ? list : [...this.state.list, ...list]
        })
    }
    setDictionaries = (id, name) => {
        if (name.indexOf('Id') > 0) {
            id = parseInt(id)
            const thisOne = this.state.dictionaries.filter(t => id === t.id)
            return thisOne[0].dictName
        } else {
            return id
        }
    }
    change = (key) => {
        this.props.showPopUp(this.state.list[key], 'change')
    }
    del = (id) => {
        const that = this
        axios.get(baseUrl + '/bizBasicDataMinganci/delete/' + id).then(function (res) {
            console.log('-----delete--then------');
            const data = res.data;
            if (data.code === 0) {
                message.success('删除成功')
                that.props.getDatad()
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
    // 禁用，启动
    disable (id, status, key) {
        const that = this
        axios.get(baseUrl + '/bizBasicDataMinganci/freeze/' + id + '/' + status).then(function (res) {
            console.log('-----disable-then------');
            const data = res.data;
            if (data.code === 0) {
                message.success((status ? '禁用': '启动') +'成功')
                let list = that.state.list
                list[key].status = status
                that.setState({
                    list: list
                })
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
	        <div className="tableList-seat">
				{
                    this.state.list.map((t,key) => {
    					return (
                            <div className="tableList-cell" key={key}>
                                <div className="tablelist-tr">
                                    {
                                        this.state.thead.map((t1, key1) => {
                                            return <div key={t1.key} style={
                                                t1.width ? {
                                                    width: t1.width,
                                                    flex: 'none'
                                                } : {}
                                            }>{
                                                key1 === 0 ?
                                                <span className="checkBox" ids={t.id}><Checkbox name="checkedIds"></Checkbox></span> :
                                                <span>{this.setDictionaries(t[t1.key], t1.key)}</span>
                                            }</div>
                                        })
                                    }
                                </div>
                                <div className="tablelist-btns">
                                    {
                                        t.status ?
                                        <button className="tableBtn-green" onClick={() => this.disable(t.id, 0, key)}>启用</button> :
                                        <button className="tableBtn-orange" onClick={() => this.disable(t.id, 1, key)}>禁用</button>
                                    }
                                    <button className="tableBtn-blue" onClick={this.change.bind(this, key)}>修改</button>
                                    <button className="tableBtn-red" onClick={this.del.bind(this, t.id)}>删除</button>
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