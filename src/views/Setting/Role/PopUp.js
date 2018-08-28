import React, {Component} from 'react';
import scrollsY from 'utils/scroll.min.js'
import { Tree, message, Input, Select } from 'antd'
import axios from 'axios'
import { axiosText } from 'utils/fetch.js'
import { baseUrl, msgError, setzIndex } from 'utils/common.js'

const TreeNode = Tree.TreeNode;
const Option = Select.Option;

class RolePopUp extends Component {
	constructor (props) {
        super(props)
        this.state = {
            popUpStu: this.props.popUpStu,
		    autoExpandParent: true,
		    checkedKeys: [],
		    treeData: [],
		    list: {}
        }
    }
    show = (list) => {
    	this.empty(list)
    	this.setState({
			popUpStu: true,
			list: list
		})
		setzIndex(3)
		scrollsY()
		this.getTree(list.id)
    }
    empty = (list) => {
    	document.getElementById('formName').value = list.name || ''
    	document.getElementById('formRemark').value = list.remark || ''
    }
    ok = () => {
    	let that = this
    	let formName = document.getElementById('formName');
    	let formRemark = document.getElementById('formRemark');
    	if (formName.value.trim() === '') {
    		message.warning('角色名称不能为空')
    		return;
    	}
    	let list = this.state.list;
    	list.name = formName.value.trim()
    	list.remark = formRemark.value.trim()
    	let checkedKeysd = that.state.checkedKeys;
    	checkedKeysd = checkedKeysd.filter(item => item>0);
    	let checkedIds = new Array(checkedKeysd);
    	list.aclIds = checkedIds.join(',')
    	this.setState({
			list: list
		})
    	axios.post(baseUrl + '/bizBasicDataRole/saveOrUpdate', list).then(function (res) {
            console.log('-----treeSave--then------');
            const data = res.data;
            if (data.code === 0) {
                that.props.getDatad()
                that.close()
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
		setzIndex(1)
    }
    handleChange = (value) => {
    	let list = this.state.list;
    	list.status = parseInt(value)
    	this.setState({
			list: list
		})
    }
    componentDidMount() {
	}
	setTreeData = (data) => {
		let treeDataTure = []
		let checkedKeysd = []
		for(let i = 0; i < data.length; i++){
			let tdata = data[i];
			let tdd = new Object()
			tdd.title = tdata.name
			tdd.key = 'A'+i
			tdd.children = []
			var taclList = tdata.aclList
			for(let n in taclList){
				let tddn = new Object()
				tddn.title = taclList[n].name
				tddn.key = taclList[n].id
				tdd.children.push(tddn);
				if (taclList[n].checked) {
					checkedKeysd.push(taclList[n].id)
				}
			}
			treeDataTure.push(tdd);
		}
		this.setState({
            treeData: treeDataTure,
            checkedKeys: checkedKeysd
        })
	}
	// 获取权限树
    getTree = (id) => {
        const that = this;
        let treeUrl = '/bizBasicDataAclModule/tree';
        if (id) treeUrl = '/bizBasicDataRole/roleTree/'+id;
        axiosText({
            url: treeUrl,
        }).then(function (res) {
            console.log('-----tree--then------');
            const data = res.data;
            if (data.code === 0) {
                that.setTreeData(data.data)
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
            message.error(msgError)
        });
    }
	onExpand = (expandedKeys) => {
	    console.log('onExpand', expandedKeys);
	    this.setState({
	      expandedKeys,
	      autoExpandParent: false,
	    });
	    setTimeout(function () {
           	scrollsY()
        }, 300);
	}
	onCheck = (checkedKeys) => {
	    console.log('onCheck', checkedKeys);
	    this.setState({ checkedKeys });
	}
	renderTreeNodes = (data) => {
	    return data.map((item) => {
	      	if (item.children) {
		        return (
		          	<TreeNode title={item.title} key={item.key} dataRef={item}>
		            	{this.renderTreeNodes(item.children)}
		          	</TreeNode>
		        );
	      	}
	      	return <TreeNode {...item} />;
	    });
	}
 	render () {
     	return (
	        <div className="popUpControl"  style={{display:this.state.popUpStu?'flex':'none'}}>
				<div className="popUpBg"></div>
				<div className="popUpBox">
					<i className="popUpClose" id="popUpClose" onClick={this.close}></i>
					<div className="popUpCentent">
						<div className="popUpForm">
							<div className="ovy-a">
								<div className="label-form">
									<div>
										<label>角色名称</label>
										<div className="selectBox">
											<Input defaultValue={this.state.list.name} id="formName"/>
										</div>
									</div>
									<div>
										<label>描&emsp;&emsp;述</label>
										<div className="selectBox">
											<Input defaultValue={this.state.list.remark} id="formRemark"/>
										</div>
									</div>
									<div>
										<label>状&emsp;&emsp;态</label>
										<div className="selectBox fz0">
									    	<Select className="popUpDropdown" defaultValue='有效' value={this.state.list.status === 0 ? '冻结' : '有效'} onChange={this.handleChange}>
										      	<Option value="1">有效</Option>
										      	<Option value="0">冻结</Option>
										    </Select>
									    </div>
									</div>
									<div>
										<label>权&ensp;限&ensp;树</label>
										<div className="tureBox" id="formTree">
											<Tree
										        checkable
										        onExpand={this.onExpand}
										        expandedKeys={this.state.expandedKeys}
										        autoExpandParent={this.state.autoExpandParent}
										        onCheck={this.onCheck}
										        checkedKeys={this.state.checkedKeys}
										    >
										        {this.renderTreeNodes(this.state.treeData)}
										    </Tree>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="popUpBtn popUpBtn-bt">
							<button className="pBtn-ok" id="pBtn-ok" onClick={this.ok}>确定</button>
							<button className="pBtn-cancel" id="pBtn-cancel" onClick={this.close}>取消</button>
						</div>
					</div>
				</div>
			</div>
     	)
 	}
}

export default RolePopUp