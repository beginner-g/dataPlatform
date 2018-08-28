import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom'

// 统一身份认证
import AInformation from 'components/Authentication/Information/index'
import Authentication from 'views/Charts/AuthenticationInfo'
import ADataStatistics from 'components/Authentication/ADataStatistics'
import AUsername from 'components/Authentication/UserName/index'
import ASystemLog from 'components/Authentication/ASystemLog'

// 数据接口控制
import DPlatformInterface from 'views/DataInterface/Interface/index'
import DAccessControl from 'views/DataInterface/IP/index'
import DataTransmission from 'views/DataInterface/DataTransmission/index'

// 服务应用支持
import ServerMonitoring from 'views/Charts/ServerMonitoring'

// 系统设置
import RoleManager from 'views/Setting/Role/index'
import UserManager from 'views/Setting/User/index'
import User from 'components/Layouts/User'

import '../styles/styles.less'
class PagesRoutes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/home" component={User}/>

                <Route exact path="/home/authentication/AInformation" component={AInformation}/>
                <Route exact path="/home/authentication/authentication" component={Authentication}/>
                <Route exact path="/home/authentication/dataStatistics" component={ADataStatistics}/>
                <Route exact path="/home/authentication/username" component={AUsername}/>
                <Route exact path="/home/authentication/systemLog" component={ASystemLog}/>

                <Route exact path="/home/dataInterface/platformInterface" component={DPlatformInterface}/>
                <Route exact path="/home/dataInterface/accessControl" component={DAccessControl}/>
                <Route exact path="/home/dataInterface/dataTransmission" component={DataTransmission}/>

                <Route exact path="/home/ServerMonitoring" component={ServerMonitoring}/>

                <Route exact path="/home/Setting/RoleManager" component={RoleManager}/>
                <Route exact path="/home/Setting/UserManager" component={UserManager}/>
            </Switch>
        );
    }
}

export default PagesRoutes
