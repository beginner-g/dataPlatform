import React, {Component} from 'react';
import PopUpBox from './PopUp';
import ListBox from './List';
import { message, Input, Spin } from 'antd'
import axios from 'axios'
import { axiosText } from 'utils/fetch.js'
import { baseUrl, msgError } from 'utils/common.js'
import scrollsY from 'utils/scroll.min.js'
import InfiniteScroll from 'react-infinite-scroller';

const pageSize = 10

class DPlatformInterface extends Component {
	constructor (props) {
        super(props)
        this.state = {
            list: [],
            thead: [
                {
                    title: '',
                    key: 'check',
                    width: '4em'
                }, {
                    title: '平台',
                    key: 'platformId'
                }, {
                    title: '接口类别',
                    key: 'typeId',
                    width: '6em'
                }, {
                    title: '接口名称',
                    key: 'name',
                }, {
                    title: '接口地址',
                    key: 'address',
                }
            ],
            loading: false,
            hasMore: true
        }
    }
    popUpShow = (list, stu,) => {
        list = list || null;
        stu = stu || 'add'
        this.refs.rolePopUps.show(list, stu);
    }
	componentDidMount() {
        this.getData()
    }
    delLot = () => {
        const that = this
        const els = document.getElementsByName('checkedIds')
        let disableIPs = '';
        for(let i = 0; i< els.length; i++){
            if (els[i].checked) disableIPs += els[i].parentNode.parentNode.parentNode.getAttribute('ids')+',';
        }
        if (disableIPs === '') {
            message.warning('请选择一条进行删除')
            return;
        } else {
            disableIPs = disableIPs.substring(0, disableIPs.length-1);
        }
        axios.get(baseUrl + '/bizBasicDataInterfaceManage/deleteBatch?ids='+disableIPs).then(function (res) {
            console.log('-----delete--then------');
            const data = res.data;
            if (data.code === 0) {
                that.getData()
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
    // 获取数据
    getData = (num) => {
        num = num || 1
        const that = this;
        let iurl = '/bizBasicDataInterfaceManage/list/'+num+'/'+pageSize;
        let searchText = document.getElementById('searchText').value.trim();
        if (searchText !== '') iurl += '?paramMsg='+searchText;
        this.setState({
            loading: true,
        });
        axiosText({
            url: iurl
        }).then(function(res){
            console.log('-----list--then------');
            const data = res.data;
            if (data.code === 0) {
                that.setState({
                    loading: false,
                    hasMore: data.data.current >= data.data.pages ? false : true
                })
                that.refs.listBoxs.load(data.data.records, num);
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
    									<label>接口名称</label>
    									<div className="selectBox fz0">
                                            <Input id="searchText"/>
                                        </div>
                                        <button onClick={this.getData.bind(this, 1)}>查询</button>
    								</div>
    								<div className="btnsBox">
                                        <button onClick={this.popUpShow.bind(this, [], 'add')}>新&emsp;增</button>
    									<button onClick={this.delLot} className="btnShadow-red">删&emsp;除</button>
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
                                        return <div key={t.key} style={
                                            t.width ? {
                                                width: t.width,
                                                flex: 'none'
                                            } : {}
                                        }><span>{t.title}</span></div>
                                    })
                                }
                            </div>
                            <div className="tablelist-box">
                                <div className="ovy-a">
                                    <InfiniteScroll
                                        pageStart={1}
                                        initialLoad={false}
                                        loadMore={this.getData.bind(this)}
                                        hasMore={!this.state.loading && this.state.hasMore}
                                        useWindow={false}
                                    >
                                        {
                                            <ListBox ref="listBoxs" thead={this.state.thead} showPopUp={this.popUpShow} getDatad={this.getData} />
                                        }
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
                        </div>
					</section>
				</div>
				<PopUpBox ref="rolePopUps" popUpStu={false} getDatad={this.getData} />
			</section>
     	)
 	}
}

export default DPlatformInterface