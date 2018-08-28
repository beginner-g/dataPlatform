import React, {Component} from 'react';
import { Input, message, Spin } from 'antd'
import { msgError, baseUrl } from 'utils/common.js'
import InfiniteScroll from 'react-infinite-scroller'
import axios from 'axios'
import scrollsY from 'utils/scroll.min.js'

const pageSize = 10
class ASystemLog extends Component {
    constructor (props) {
        super(props)
        this.state = {
            list: [],
            text: '',
            loading: false,
            hasMore: true,
            thead: [
                {
                    title: '平台',
                    key: 'platform'
                }, {
                    title: '账号名称',
                    key: 'userName',
                }, {
                    title: '姓名',
                    key: 'name',
                }, {
                    title: '认证等级',
                    key: 'authGrade',
                }, {
                    title: '认证结果',
                    key: 'authResult',
                }, {
                    title: '认证时间',
                    key: 'authTime',
                }
            ]
        }
     }
     componentDidMount () {
         this.getData()
     }
    //  获取列表
     getData = (num) => {
        const that = this
        num = num || 1
        const { text } = this.state
        let param = {
            pagenumber: num,
            pagesize: pageSize
        }
        if (text.trim() !== '') param = {
            pagenumber: num,
            pagesize: pageSize,
            paramMsg: text
        }
        axios.post(baseUrl + '/log/getSystemLogList', param).then(function (res) {
            // console.log('-----then------');
            const data = res.data;
            if (data.code === 0) {
                that.setState({
                    list: num === 1 ? data.data.records : [...that.state.list, ...data.data.records],
                    loading: false,
                    hasMore: data.data.current >= data.data.pages ? false : true
                })
                scrollsY()
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
     }
    //  查询
    Inputchange = (e) => {
        this.setState({
            text: e.target.value
        })
    }
    render () {
        const { list, index } = this.state
         return (
            <section className="pageContent">
                <div className="content-seat">
                    <header className="operationControl">
                        <section className="progressDefl">
                            <h4>系统日志</h4>
                            <div className="operationBox">
                                <div className="operationSeat">
                                    <div className="searchBox">
                                        <label>姓名</label>
                                        <div className="selectBox fz0">
                                            <Input id="searchText" onChange={this.Inputchange}/>
                                        </div>
                                        <button onClick={this.getData.bind(this, 1)}>查询</button>
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
                                                                            }>
                                                                                <span>{t[t1.key]}</span>
                                                                            </div>
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
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
            </section>
         )
     }
 }
 export default ASystemLog