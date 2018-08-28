import React, { Component } from 'react'
import { Form, Input, message } from 'antd'
import { withRouter } from 'react-router-dom'
import $ from "jquery"
import { axiosText } from 'utils/fetch.js'
import { baseUrl, randoms, getDictionaries } from 'utils/common.js'
import titleImg  from 'assets/img/login/title.png'

const FormItem = Form.Item
class Login extends Component {
	constructor (props) {
		super(props)
		this.state = {
			focus: false,
			focus1: false,
			focusBtn: false
		}
	}
	onFocus = () => {
		this.setState({
			focus: true
		})
	}
	onFocus1 = () => {
		this.setState({
			focus1: true
		})
	}
	onBlur = () => {
		this.setState({
			focus: false
		})
	}
	onBlur1 = () => {
		this.setState({
			focus1: false
		})
	}
	onFocusBtn = () => {
		this.setState({
			focusBtn: true
		})
	}
	onBlurBtn = () => {
		this.setState({
			focusBtn: false
		})
	}
	componentDidMount() {
		this.hacker()
	}
	hacker = () => {
		// hacker
        let fontNum = 25;
        let fontSize = [8, 10, 11, 12, 13, 14, 16, 18, 22, 24];
        let listNum = 50;
        let timeNum = 120;
        let lel = $('#divList');
        function add() {
            let fontSized = fontSize[randoms(0, 9)];
            let html = `<div class="divText" style="
                left: ${randoms(0, lel.width())}px;
                bottom: ${lel.height()}px;
                font-size: ${fontSized}px;
                opacity: ${0.1 * randoms(4, 10)}
            ">`;
            for (let i = 1; i < fontNum; i++) {
                let f = 1 - (i / fontNum);
                if (i < fontNum / 2) f = i / fontNum;
                html += `<span class="s${i}" style="color: rgba(30, 90, 192, ${f});">${randoms(0, 1)}</span>`;
            }
            lel.append(html + '</div>');
        }
        function add2(el) {
            let fontSized = fontSize[randoms(0, 9)];
            el.css({
                'left': randoms(0, lel.width()) + 'px',
                'bottom': lel.height() + 'px',
                'font-size': fontSized + 'px',
                'opacity': 0.1 * randoms(4, 10)
            });
        }
        function run() {
            if ($('.divText').length < listNum) add();
            $('.divText').each(function () {
                let that = $(this);
                let y = parseInt(that.css('bottom'));
                y -= that.find('span').eq(0).height();

                // 速度
                y += randoms(-5, 1);
                that.css('bottom', y + 'px');

                if (y + that.height() <= 0) {
                    add2(that);
                    return;
                }
                // $(this).find('span').each(function () {
                //     $(this).html(randoms(0, 1));
                // });
            });

            window.setTimeout(run, timeNum);
        }
        run();
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const that = this;
		this.props.form.validateFields((err, values) => {
			if (!err) {
				axiosText({
					url: baseUrl+'/bizBasicDataUser/login',
					method: 'post',
					data: {
						usercode: values.userName,
						password: values.password
					}
				}).then(function(res){
					console.log('-----Login-then------');
					const data = res.data;
					if (data.code === 0) {
					    message.success('登陆成功')
						const user = data.data
		                localStorage.setItem('user', JSON.stringify(user))
		                that.props.history.push('/home')
		                // 字典
						getDictionaries()
					} else {
						message.error(data.msg)
					}
				}).catch(function(error){
					console.log('-----catch------');
				});
			} else {
				message.error('内容不能为空')
			}
		})
	}
	render () {
		const { getFieldDecorator } = this.props.form
		const { focus, focus1, focusBtn } = this.state
		return (
			<section className="login">
                <div className="login-bg">
                    <div id="divList"></div>
                </div>
                <div className="login-contorl">
                    <header>
                        <div className="preloader- preloader-r">
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
                        <div className="img-box">
                            <img src={titleImg} alt="" />
                        </div>
                        <div className="preloader- preloader-l">
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
                    </header>
                    <section>
                        <div className="seat">
                            <span><i></i><i></i></span>
                            <div className="seat-bg"></div>
                            <div className="login-box">
                                <h4>登 录</h4>
                                <Form onSubmit={this.handleSubmit} className="login-form" >
                                    <FormItem className=''>
                                        {getFieldDecorator('userName', {
                                            rules: [{ required: true, message: '请输入用户名' }],
                                        })(
                                            <div>
                                                <label></label><i></i>
                                                <Input type="user" placeholder="lyt"/>
                                            </div>
                                        )}
                                    </FormItem>
                                    <FormItem className=''>
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true, message: '请输入密码' }],
                                        })(
                                            <div>
                                                <label></label><i></i>
                                                <Input type="password" placeholder="123"/>
                                            </div>
                                        )}
                                    </FormItem>
                                </Form>
                                <div className="button-box">
                                    <button type="submit" onClick={this.handleSubmit.bind(this)}>登 录</button>
                                </div>
                            </div>
                            <span><i></i><i></i></span>
                        </div>
                    </section>
                </div>
            </section>
		)
	}
}
export default withRouter(Form.create()(Login))