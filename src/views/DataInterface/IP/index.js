import React, {Component} from 'react';
import PopUpBox from './PopUp';
import ListBox from './List';
import { message, Select } from 'antd'
import axios from 'axios'
import { axiosText } from 'utils/fetch.js'
import { baseUrl, msgError } from 'utils/common.js'
import scrollsY from 'utils/scroll.min.js'

const Option = Select.Option;

class DAccessControl extends Component {
	constructor (props) {
        super(props)
        this.state = {
            select: 0,
            list: [],
            thead: [
                {
                    title: '服务器名称',
                    key: 'name'
                }, {
                    title: '服务器IP',
                    key: 'ip'
                }, {
                    title: '限制IP',
                    key: 'limit',
                }
            ]
        }
    }
    popUpShow = (list, stu, index, key) => {
        list = list || null;
        stu = stu || 'add'
        index = index || 0
        key = key || 0
        this.refs.rolePopUps.show(list, stu, index, key);
    }
	componentDidMount() {
        this.getData()
    }
    handleChange = (value) => {
        console.log(value)
        const list = this.state.list
        this.setState({
            select: list[value].hostname
        })
        this.refs.listBoxs.load(list, value);
    }
    // 获取数据
    getData = () => {
        const that = this;
        axiosText({
            url: '/serverMonitor/server/publishlist',
        }).then(function(res){
            console.log('-----list--then------');
            const data = res.data;
            if (data.code === 0) {
                that.setState({
                    list: data.data,
                    select: data.data[0].hostname
                })
                that.refs.listBoxs.load(data.data, 0);
                scrollsY()
            } else {
                message.error(data.msg)
            }
        }).catch(function(error){
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
    						<h4>访问控制管理</h4>
    						<div className="operationBox">
    							<div className="operationSeat">
    								<div className="searchBox">
    									<label>服务器名称</label>
    									<div className="selectBox fz0">
                                            <Select onChange={this.handleChange} value={this.state.select}>
                                                {
                                                    this.state.list.map((t,key) => {
                                                        return <Option value={key} key={key}>{t.hostname}</Option>
                                                    })
                                                }
                                            </Select>
    									</div>
    								</div>
    								<div className="btnsBox">
    									<button onClick={this.popUpShow.bind(this, this.state.list, 'add', 0, 0)}>新&emsp;增</button>
    								</div>
    							</div>
    						</div>
                        </section>
					</header>
					<section className="cententMain">
                        <div className="tableList-control">
                            <div className="tablelist-tr">
                                {
                                    this.state.thead.map(t => {
                                        return <div key={t.key}><span>{t.title}</span></div>
                                    })
                                }
                            </div>
                            <div className="tablelist-box">
                                <div className="ovy-a">
                                    <ListBox ref="listBoxs" showPopUp={this.popUpShow} getDatad={this.getData} />
                                </div>
                            </div>
                        </div>
					</section>
				</div>
				<PopUpBox ref="rolePopUps" popUpStu={false} getDatad={this.getData} />
			</section>
     	)
 	}
}

export default DAccessControl