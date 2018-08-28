import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom'
import { Layout, Menu, Dropdown, message } from 'antd'
import PagesRoutes from 'routes/PagesRoutes'
import axios from 'axios'
import { axiosText } from 'utils/fetch.js'
import { baseUrl, msgError } from 'utils/common.js'
import Slider from 'react-slick'

const { Header, Content } = Layout

class Layouts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menucur: localStorage.getItem('menucur') || 'Y0',
            show: false,
            user: JSON.parse(localStorage.getItem('user')),
            acl: []
        }
    }
    // 退出
    exit = () => {
        localStorage.removeItem('user')
        this.props.history.push('/')
        message.success('已退出')
    }
    handleClick(text) {
        this.setState({
            menucur: text
        })
        localStorage.setItem('menucur', text)
    }
    componentDidMount() {
        this.getAcl(this.state.user)
    }
    getAcl = (user) => {
        const that = this
        axios.get(baseUrl + '/bizBasicDataUser/acl/'+user.id).then(function (res) {
            const data = res.data;
            if (data.code === 0) {
                that.setState({
                    acl: data.data
                })
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
    setAcl = (user) => {
        localStorage.setItem('user', JSON.stringify(user))
        this.setState({
            user: user
        })
    }
    getSildeNum = (num) => {
        return ~~(num === '' ? 0 : 1)
    }
    popUpUser = () => {
        this.handleClick('Y0');
        this.props.history.push('/home')
    }
    isMenuCur = (cur, first) => {
        cur = cur || this.state.menucur
        first = first || 0
        return cur.substring(first, first + 1)
    }
    render() {
        const menucur = this.state.menucur
        const isMenuCur0 = this.isMenuCur(menucur)
        const isMenuCur1 = this.isMenuCur(menucur, 1)
        const acl = this.state.acl
        let authentication = acl.filter(t => t.name === '统一身份认证') || []
        let menu1 = ''
        if (authentication.length) {
            menu1 = (
                <Menu>
                    {
                        authentication[0].aclList.filter(t => t.name === '认证信息管理').length ?
                        (<Menu.Item onClick={()=> this.handleClick('A0')}>
                            <Link className={(isMenuCur0 === 'A' && isMenuCur1 === '0') ? 'menu-acur' : ''} to='/home/authentication/AInformation'>认证信息管理</Link>
                        </Menu.Item>) : null
                    }
                    {
                        authentication[0].aclList.filter(t => t.name === '认证信息监控').length ?
                        (<Menu.Item onClick={()=> this.handleClick('A1')}>
                            <Link className={(isMenuCur0 === 'A' && isMenuCur1 === '1') ? 'menu-acur' : ''} to='/home/authentication/authentication'>认证信息监控</Link>
                        </Menu.Item>) : null
                    }
                    {
                        authentication[0].aclList.filter(t => t.name === '认证数据统计').length ?
                        (<Menu.Item onClick={()=> this.handleClick('A2')}>
                            <Link className={(isMenuCur0 === 'A' && isMenuCur1 === '2') ? 'menu-acur' : ''} to='/home/authentication/dataStatistics'>认证数据统计</Link>
                        </Menu.Item>) : null
                    }
                    {
                        authentication[0].aclList.filter(t => t.name === '用户名管理').length ?
                        (<Menu.Item onClick={()=> this.handleClick('A3')}>
                            <Link className={(isMenuCur0 === 'A' && isMenuCur1 === '3') ? 'menu-acur' : ''} to='/home/authentication/username'>用户名管理</Link>
                        </Menu.Item>) : null
                    }
                    {
                        authentication[0].aclList.filter(t => t.name === '系统日志').length ?
                        (<Menu.Item onClick={()=> this.handleClick('A4')}>
                            <Link className={(isMenuCur0 === 'A' && isMenuCur1 === '4') ? 'menu-acur' : ''} to='/home/authentication/systemLog'>系统日志</Link>
                        </Menu.Item>) : null
                    }
                </Menu>
            )
        }
        let dataInterfaceControl = acl.filter(t => t.name === '数据接口控制') || []
        let menu2 = ''
        if (dataInterfaceControl.length) {
            menu2 = (
                <Menu>
                    {
                        dataInterfaceControl[0].aclList.filter(t => t.name === '平台接口管理').length ?
                        (<Menu.Item onClick={()=> this.handleClick('B0')}>
                            <Link className={(isMenuCur0 === 'B' && isMenuCur1 === '0') ? 'menu-acur' : ''} to='/home/dataInterface/platformInterface'>平台接口管理</Link>
                        </Menu.Item>) : null
                    }
                    {
                        dataInterfaceControl[0].aclList.filter(t => t.name === '访问控制管理').length ?
                        (<Menu.Item onClick={()=> this.handleClick('B1')}>
                            <Link className={(isMenuCur0 === 'B' && isMenuCur1 === '1') ? 'menu-acur' : ''} to='/home/dataInterface/accessControl'>访问控制管理</Link>
                        </Menu.Item>) : null
                    }
                    {
                        dataInterfaceControl[0].aclList.filter(t => t.name === '数据传输管理').length ?
                        (<Menu.Item onClick={()=> this.handleClick('B2')}>
                            <Link className={(isMenuCur0 === 'B' && isMenuCur1 === '2') ? 'menu-acur' : ''} to='/home/dataInterface/dataTransmission'>数据传输管理</Link>
                        </Menu.Item>) : null
                    }
                </Menu>
            )
        }
        let serviceApplicationSupport = acl.filter(t => t.name === '服务应用支撑') || []
        let menu3 = ''
        if (serviceApplicationSupport.length) {
            menu3 = (
                <Menu>
                    {
                        serviceApplicationSupport[0].aclList.filter(t => t.name === '服务器监控').length ?
                        (<Menu.Item onClick={()=> this.handleClick('C0')}>
                            <Link className={(isMenuCur0 === 'C' && isMenuCur1 === '0') ? 'menu-acur' : ''} to='/home/ServerMonitoring'>服务器监控</Link>
                        </Menu.Item>) : null
                    }
                </Menu>
            )
        }
        const menu1Has = authentication.length && authentication[0].aclList.length
        const menu2Has = dataInterfaceControl.length && dataInterfaceControl[0].aclList.length
        const menu3Has = serviceApplicationSupport.length && serviceApplicationSupport[0].aclList.length
        const settings = {
            // dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: this.getSildeNum(menu1Has) + this.getSildeNum(menu2Has) + this.getSildeNum(menu3Has), // 4
            slidesToScroll: 1,
            arrows: true
        }
        let setHas = acl.filter(t => t.name === '系统管理') || []
        let setHasBoole = setHas.length ? true : false
        return (
            <Layout className="layout">
                <Header className="layout-header">
                    <div className="layout-title">
                        <h2>数据平台管理系统</h2>
                    </div>
                    <div className="layout-nav">
                        <Slider {...settings} className="layout-nav-box">
                            {
                                menu1Has ?
                                (<Dropdown overlay={menu1} placement="bottomLeft">
                                    <a className={isMenuCur0 === 'A' ? 'nav-option-active' : 'nav-option'} href="javascript:;">统一身份认证</a>
                                </Dropdown>) : null
                            }
                            {
                                menu2Has ?
                                (<Dropdown overlay={menu2} placement="bottomLeft">
                                    <a className={isMenuCur0 === 'B' ? 'nav-option-active' : 'nav-option'}  href="javascript:;">数据接口控制</a>
                                </Dropdown>) : null
                            }
                            {
                                menu3Has ?
                                (<Dropdown overlay={menu3} placement="bottomLeft">
                                    <a className={isMenuCur0 === 'C' ? 'nav-option-active' : 'nav-option'} href="javascript:;">服务应用支持</a>
                                </Dropdown>) : null
                            }
                        </Slider>
                    </div>
                    <div className={setHasBoole ? "layout-side-nav" : "layout-side-nav layout-side-nav2"}>
                        {
                            setHasBoole ? (
                                <div className={isMenuCur0 === 'W' ? 'side-setting side-cur' : 'side-setting'}>
                                    <i></i>
                                    <span>系统设置</span>
                                    <div className="side-setBox">
                                        <ul>
                                            {
                                                setHas[0].aclList.filter(t => t.name === '角色管理').length ? (
                                                    <li className={(isMenuCur0 === 'W' && isMenuCur1 === '0') ? 'setBox-cur' : ''} onClick={()=> this.handleClick('W0')}><Link to="/home/Setting/RoleManager">角色管理</Link></li>
                                                ) : null
                                            }
                                            {
                                                setHas[0].aclList.filter(t => t.name === '用户管理').length ? (
                                                    <li className={(isMenuCur0 === 'W' && isMenuCur1 === '1') ? 'setBox-cur' : ''} onClick={()=> this.handleClick('W1')}><Link to="/home/Setting/UserManager">用户管理</Link></li>
                                                ) : null
                                            }
                                        </ul>
                                    </div>
                                </div>
                            ) : null
                        }
                        <div className={isMenuCur0 === 'Y' ? 'side-username side-cur' : 'side-username'} onClick={this.popUpUser}>
                            <i></i>
                            <span>{this.state.user.username}</span>
                        </div>
                        <div className="side-exit" onMouseMove={this.handleMove} onClick={this.exit}>
                            <i></i>
                            <span>退出</span>
                        </div>
                    </div>
                </Header>
                <Content style={{ padding: '10 76px 0' }}>
                    <PagesRoutes />
                </Content>
            </Layout>
        )
    }
}

export default withRouter(Layouts)