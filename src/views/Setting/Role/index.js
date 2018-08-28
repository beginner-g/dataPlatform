import React, {Component} from 'react';
import RolePopUp from './PopUp';
import CradBox from './Cards';
import { message, Input } from 'antd'
import axios from 'axios'
import { axiosText } from 'utils/fetch.js'
import { baseUrl, msgError } from 'utils/common.js'

import scrollsY from 'utils/scroll.min.js'

class RoleManager extends Component {
	constructor (props) {
        super(props)
        this.state = {
            list: []
        }
    }
    popUpShow = (list) => {
        list = list || null;
        this.refs.rolePopUps.show(list);
    }
	componentDidMount() {
        this.getData()
    }
    // 获取数据
    getData = () => {
        const that = this;
        let iurl = '/bizBasicDataRole/list';
        let searchText = document.getElementById('searchText').value;
        if (searchText) iurl += '?paramMsg='+searchText;
        axiosText({
            url: iurl,
        }).then(function(res){
            console.log('-----list--then------');
            const data = res.data;
            if (data.code === 0) {
                that.setState({
                    list: data.data
                })
                that.refs.cradBoxs.load(data.data);
                scrollsY()
            } else {
                message.error(data.msg)
            }
        }).catch(function(error){
            console.log('-----catch------');
            message.error(msgError)
        });
    }

    // 获取权限树
    getTree = (id) => {
        const that = this;
        console.log('id', id);
        axios.get(baseUrl + `/bizBasicDataUser/acl/${id}`).then(function (res) {
            console.log('-----list--then------');
            const data = res.data;
            if (data.code === 0) {
                that.setState({
                    dataTree: data.data
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
	        <section className="pageContent">
				<div className="content-seat">
					<header className="operationControl">
                        <section className="progressDefl">
    						<h4>角色管理</h4>
    						<div className="operationBox">
    							<div className="operationSeat">
    								<div className="searchBox">
    									<label>真实姓名</label>
    									<div className="inputBox">
                                            <Input id="searchText"/>
    									</div>
    									<button onClick={this.getData}>查询</button>
    								</div>
    								<div className="btnsBox">
    									<button onClick={this.popUpShow.bind(this, {})}>新&emsp;增</button>
    								</div>
    							</div>
    						</div>
                        </section>
					</header>
					<section className="cententMain">
						<div className="scrollbox">
							<div className="ovy-a">
								<CradBox ref="cradBoxs" list={this.state.list} showPopUp={this.popUpShow} getDatad={this.getData} />
							</div>
						</div>
					</section>
				</div>
				<RolePopUp ref="rolePopUps" popUpStu={false} getDatad={this.getData} />
			</section>
     	)
 	}
}

export default RoleManager