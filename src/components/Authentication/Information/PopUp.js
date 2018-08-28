import React, {Component} from 'react';
import { message } from 'antd'
import { baseUrl, msgError } from 'utils/common.js'
import axios from 'axios'
import rzImg from 'imgs/rzImg.png'
import card1 from 'imgs/card1.png'
import card2 from 'imgs/card2.png'
class RolePopUp extends Component {
    constructor (props) {
        super(props)
        this.state = {
            popUpStu: this.props.popUpStu,
            list: []
        }
    }
    show = (privateId) => {
        const that = this
        axios.get(baseUrl + '/msgManage/getPersonUserMsg/' + privateId).then(function (res) {
            console.log('-----getPersonUserMsg--then------');
            const data = res.data;
            if (data.code === 0) {
                that.setState({
                    popUpStu: true,
                    list: data.data
                })
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
    close = () => {
        this.setState({
            popUpStu: false
        })
    }
    render () {
        const list = this.state.list
        return (
            <div className="popUpControl popUpLong popUpLongImgs" style={{display:this.state.popUpStu?'flex':'none'}}>
                <div className="popUpBg"></div>
                <div className="popUpBox">
                    <i className="popUpClose" id="popUpClose" onClick={this.close}></i>
                    <div className="popUpCentent">
                        <div className="popUpTitle">
                            <h4>认证信息管理> 查看</h4>
                        </div>
                        <div className="popUpForm">
                            <div className="ovy-a">
                                <div className="popUpImgForm">
                                    <div className="label-form">
                                        <div>
                                            <label>平&emsp;&emsp;台</label>
                                            <span>{list.platform}</span>
                                        </div>
                                        <div>
                                            <label>姓&emsp;&emsp;名</label>
                                            <span>{list.name}</span>
                                        </div>
                                        <div>
                                            <label>性&emsp;&emsp;别</label>
                                            <span>{list.grander === 1 ? '男': '女'}</span>
                                        </div>
                                        <div>
                                            <label>手&ensp;机&ensp;号</label>
                                            <span>{list.cellPhoneNumber}</span>
                                        </div>
                                        <div>
                                            <label>身份证号</label>
                                            <span>{list.idNumber}</span>
                                        </div>
                                        <div>
                                            <label>银行卡号</label>
                                            <span>{list.bankCardNumber}</span>
                                        </div>
                                        <div>
                                            <label>认证等级</label>
                                            <span>{list.level}</span>
                                        </div>
                                        <div>
                                            <label>五证合一编号</label>
                                            <span>{list.legalFiveCardCode}</span>
                                        </div>
                                        <div>
                                            <label>注册时间 </label>
                                            <span>{list.authTimeReg}</span>
                                        </div>
                                        <div>
                                            <label>最新认证时间 </label>
                                            <span>{list.authTimeNew}</span>
                                        </div>
                                        <div>
                                            <label>是否加入黑名单</label>
                                            <span>{list.deleteFlag === 1? '是' : '否'}</span>
                                        </div>
                                    </div>
                                    <div className="popUpImg-box">
                                        <div className="popUpImg-rz">
                                            <div className="img-box">
                                                <img src={ list.humanFacePath ? baseUrl+'/img?id='+list.humanFacePath : rzImg} alt=""/>
                                            </div>
                                            <p>人脸识别信息</p>
                                        </div>
                                        <div className="popUpImg-card">
                                            <div className="cardImgs">
                                                <div className="img-box">
                                                    <img src={ list.idcardBack ? baseUrl+'/img?id='+list.idcardBack : card1} alt=""/>
                                                </div>
                                                <div className="img-box">
                                                    <img src={ list.idcardFront ? baseUrl+'/img?id='+list.idcardFront : card2} alt=""/>
                                                </div>
                                            </div>
                                            <p>身份证照片</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RolePopUp