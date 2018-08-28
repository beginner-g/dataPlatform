/*
 *  公共
 */
import $ from "jquery"
import scrollsY from 'utils/scroll.min.js'
import axios from 'axios'
import { message } from 'antd'

// 公共变量
    const baseUrl = 'http://192.168.100.56:8018';
    const baseUrl1 = 'http://192.168.100.77:8018';
    // 系统提示
    const msgError = '服务器访问失败，请稍后再试。';

// 公共函数
    // 生成随机数
    function randoms(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // scrollsY
    $.fn.resizeEnd = function (callback, timeout) {
        $(this).resize(function () {
            const $this = $(this);
            if ($this.data('resizeTimeout')) {
                clearTimeout($this.data('resizeTimeout'));
            }
            $this.data('resizeTimeout', setTimeout(callback, timeout));
        });
    };
    $(window).resizeEnd(function() {
        if (typeof scrollsY === "function") {
            scrollsY();
        }
    }, 300);
    // 跳页
    let goHref = (url) => {
        this.props.history.push({pathname: '/home/'+url})
    }
    // popUp
    let setzIndex = (i) => {
        document.getElementsByClassName('ant-layout-content')[0].style.zIndex = i;
    }
    // 字典
    let getDictionaries = () => {
        let dictionaries = localStorage.getItem('dictionaries')
        dictionaries = (dictionaries && dictionaries !== 'undefined') ? JSON.parse(dictionaries) : [];
        if (dictionaries.length !== 0) return dictionaries;
        axios.get(baseUrl + '/bizBasicDataDict/list/all').then(function (res) {
            console.log('-----bizBasicDataDict-then------');
            const data = res.data;
            if (data.code === 0) {
                localStorage.setItem('dictionaries', JSON.stringify(data.data))
            } else {
                message.error(data.msg)
            }
        }).catch(function (error) {
            console.log('-----catch------');
        });
    }

export {
    baseUrl,
    baseUrl1,
    msgError,
    randoms,
    goHref,
    setzIndex,
    getDictionaries
};