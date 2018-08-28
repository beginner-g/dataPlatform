/*
 *  axios 封装
 */
import axios from 'axios'
import { baseUrl, baseUrl1 } from 'utils/common.js'

let axiosText = axios.create({
    baseURL: baseUrl, //这里配置你自己的url
    // baseURl1: baseUrl1,
    timeout: 15000,
    method: 'get',
    // headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'  //请求头
    // },
    responseType: 'text',
    transformResponse: [function (data) {
        // 可以对data做任何操作
        data = data.replace(/id\":(\d+)/g,"id\":\"$1\"");
        data = data.replace(/id\":(\d+),/g,"id\":\"$1\",");
        data = data.replace(/privateId\":(\d+)/g,"privateId\":\"$1\"");
        data = data.replace(/privateId\":(\d+),/g, "privateId\":\"$1\",");
        data = JSON.parse(data);
        return data;
    }],
})

export {
    axiosText,
};