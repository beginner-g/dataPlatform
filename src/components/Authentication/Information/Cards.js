import React, {Component} from 'react';
import { message } from 'antd'
import axios from 'axios'
import { baseUrl, msgError } from 'utils/common.js'

class CradBox extends Component {
    constructor (props) {
        super(props)
        this.state = {
            list: [],
        }
    }
    load = (list, num) => {
        this.setState({
            list: num === 1 ? list : [...this.state.list, ...list]
        })
    }
    change = (id) => {
        this.props.showPopUp(id)
    }
    Blacklist = (type, idNumber) => {
        const that = this
        axios.get(baseUrl + '/msgManage/addOrRemoveBlacklist/'+idNumber+'/'+ type).then(function (res) {
            console.log('-----Blacklist--then------');
            const data = res.data;
            message.success(data.msg || '修改成功')
            if (data.code === 0) {
                that.props.hadLoad()
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
    render () {
        return (
            <div className="scrollbox-seat">
                {this.state.list.map((t,key) => {
                    return (
                        <div className="cardBox cardBoxA" key={key} id={t.id}>
                            <div className="cardSeat">
                                <div className="cardTitle">
                                    <h4>{t.platform}</h4>
                                    <button className="card-changeBtn card-searchBtn" onClick={this.change.bind(this, t.privateId)}></button>
                                </div>
                                <div className="label-form">
                                    <div>
                                        <label>姓&emsp;&emsp;名</label>
                                        <span>{t.name}</span>
                                    </div>
                                    <div>
                                        <label>手&ensp;机&ensp;号</label>
                                        <span>{t.cellPhoneNumber}</span>
                                    </div>
                                    <div>
                                        <label>认证等级</label>
                                        <span>{t.authGrade}</span>
                                    </div>
                                </div>
                                <div className="card-btn">
                                    <i></i>
                                    {
                                        t.deleteFlag === 2 ?
                                        <button onClick={this.Blacklist.bind(this, 1, t.idNumber)}>加入黑名单</button> :
                                        <button className="bcolor-blue" onClick={this.Blacklist.bind(this, 2, t.idNumber)}>移出黑名单</button>
                                    }
                                    <i></i>
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