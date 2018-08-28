import React, {Component} from 'react';
import RolePopUp from './PopUp';
import CradBox from './Cards';
import { message, Input, Select, Spin } from 'antd'
import axios from 'axios'
import { axiosText } from 'utils/fetch.js'
import { msgError } from 'utils/common.js'
import scrollsY from 'utils/scroll.min.js'
import InfiniteScroll from 'react-infinite-scroller';

const Option = Select.Option
const pageSize = 10

class UserManager extends Component {
	constructor (props) {
        super(props)
        this.state = {
            platform: '',
            deleteFlag: 0,
            loading: false,
            hasMore: true
        }
    }
    componentDidMount() {
        this.getData()
    }
    popUpShow = (id) => {
        id = id || null;
        this.refs.rolePopUps.show(id);
    }
    // 获取数据
    platform = (value) => {
        this.setState({
            platform: value
        })
        this.getData(1, {
            pagenumber: 1,
            pagesize: pageSize,
            platform: value,
            deleteFlag: this.state.deleteFlag,
        })
    }
    deleteFlag = (value) => {
        this.setState({
            deleteFlag: value
        });
        this.getData(1, {
            pagenumber: 1,
            pagesize: pageSize,
            platform: this.state.platform,
            deleteFlag: value,
        })
    }
    getData = (num, params) => {
        const that = this
        this.setState({
            loading: true,
        });
        num = num || 1
        params = params || {
            pagenumber: num,
            pagesize: pageSize
        }
        axiosText({
            url: '/msgManage/getMsgManageList',
            method: 'post',
            data: params
        }).then(function (res) {
            console.log('-----then------');
            const data = res.data;
            if (data.code === 0) {
                that.setState({
                    loading: false,
                    hasMore: data.data.current >= data.data.pages ? false : true
                })
                that.refs.cradBoxs.load(data.data.records, num);
                scrollsY()
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
    						<h4>认证信息管理</h4>
    						<div className="operationBox">
    							<div className="operationSeat">
    								<div className="searchBox">
    									<label>平台</label>
                                        <div className="selectBox fz0">
                                            <Select value={this.state.platform} onChange={this.platform}>
                                                <Option value="">全部</Option>
                                                <Option value="个人app">个人app</Option>
                                                <Option value="个人pc">个人pc</Option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="searchBox" style={{marginLeft: '2.5em'}}>
                                        <label>是否加入黑名单</label>
                                        <div className="selectBox fz0">
                                            <Select value={this.state.deleteFlag} onChange={this.deleteFlag}>
                                                <Option value={0}>全部</Option>
                                                <Option value={1}>是</Option>
                                                <Option value={2}>否</Option>
                                            </Select>
                                        </div>
    								</div>
    							</div>
    						</div>
                        </section>
					</header>
					<section className="cententMain">
						<div className="scrollbox">
							<div className="ovy-a">
                                <InfiniteScroll
                                    pageStart={1}
                                    initialLoad={false}
                                    loadMore={this.getData.bind(this)}
                                    hasMore={!this.state.loading && this.state.hasMore}
                                    useWindow={false}
                                >
                                    <CradBox ref="cradBoxs" showPopUp={this.popUpShow} hadLoad={this.getData} />
                                    {
                                        this.state.loading && this.state.hasMore && (
                                            <div className="demo-loading-container">
                                                <Spin />
                                            </div>
                                        )
                                    }
                                </InfiniteScroll>
							</div>
						</div>
					</section>
				</div>
				<RolePopUp ref="rolePopUps" popUpStu={false} getDatad={this.getData} />
			</section>
     	)
 	}
}

export default UserManager