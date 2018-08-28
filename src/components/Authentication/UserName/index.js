import React, {Component} from 'react';
import PopUpBox from './PopUp';
import ListBox from './List';
import { message, Input, Spin, Select } from 'antd'
import axios from 'axios'
import { axiosText } from 'utils/fetch.js'
import { baseUrl, msgError } from 'utils/common.js'
import scrollsY from 'utils/scroll.min.js'
import InfiniteScroll from 'react-infinite-scroller';

const Option = Select.Option;
const pageSize = 10

class DPlatformInterface extends Component {
	constructor (props) {
        super(props)
        this.state = {
            select: 0,
            list: [],
            typeId: '',
            typeIds: [],
            thead: [
                {
                    title: '',
                    key: 'check',
                    width: '4em'
                }, {
                    title: '敏感词',
                    key: 'name'
                }, {
                    title: '词汇类别',
                    key: 'typeId',
                    width: '6em'
                }, {
                    title: '创建时间',
                    key: 'createDate',
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
        const dictionaries = JSON.parse(localStorage.getItem('dictionaries'))
        this.setState({
            typeIds: dictionaries.filter(t => t.dictType === '敏感词')
        })
        this.getData()
    }
    selectChange = (value) => {
        this.setState({
            typeId: value
        })
        this.getData(1, value)
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
        axios.get(baseUrl + '/bizBasicDataMinganci/deleteMore?idList='+disableIPs).then(function (res) {
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
    getData = (num, typeId) => {
        num = num || 1
        const that = this;
        this.setState({
            loading: true,
        });
        let iurl = '/bizBasicDataMinganci/list/'+num+'/'+pageSize;
        typeId = typeId || ''
        if (typeId && typeId != '') iurl += '?typeId='+typeId;
        axiosText({
            url: iurl,
        }).then(function (res) {
            console.log('-----then------');
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
    						<h4>用户名管理</h4>
    						<div className="operationBox">
    							<div className="operationSeat">
    								<div className="searchBox">
    									<label>词汇类别</label>
    									<div className="selectBox fz0">
                                            <Select onChange={this.selectChange} value={this.state.typeId}>
                                                <Option value=''>全部</Option>
                                                {
                                                    this.state.typeIds.map((t,key) => {
                                                        return <Option value={t.dictId} key={key}>{t.dictName}</Option>
                                                    })
                                                }
                                            </Select>
                                        </div>
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