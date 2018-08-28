import React, {Component} from 'react';
import { message, Checkbox } from 'antd'
import axios from 'axios'
import { baseUrl, msgError, getDictionaries } from 'utils/common.js'

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
        axios.get(baseUrl + '/bizBasicDataInterfaceManage/delete/'+id).then(function (res) {
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