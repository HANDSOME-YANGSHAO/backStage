
//第一种封装方法
// export function request(config,success,failure){
//   //1.创建axios实例
//     const instance = axios.create({
//       baseURL:'http://123.207.32.32:8000',
//       timeout:5000
//     })

//     instance(config).then(res => {
//         success(res);
//     }).catch(err => {
//       failure(err);
//     })
// }

//第二种封装模式
// export function request(config){
//   //1.创建axios实例
//     const instance = axios.create({
//       baseURL:'http://123.207.32.32:8000',
//       timeout:5000
//     })

//     instance(config.baseConfig).then(res => {
//        config.success(res);
//     }).catch(err => {
//       config.failure(err);
//     })
//   }

//第四种封装模式
// export function request(config){
//   return new Promise((resolve,reject) =>{
    
//     const instance = axios.create({
//       baseURL:'http://123.207.32.32:8000',
//       timeout: 5000    
//     });
  
//     instance(config).then(res =>{
//       resolve(res);
//     }).catch(err => {
//       reject(err);
//     })

//   })
// }



//第三种封装模式(最终选择)

import axios from "axios";//导入axios框架
// 导入进度条库和它的样式
import NProcess from "nprogress" 
import 'nprogress/nprogress.css'

export function request(config){
  //1.定义axios实例 
  const instance = axios.create({
    baseURL:'https://lianghj.top:8888/api/private/v1',
    timeout: 5000
  });

  //2.axios拦截器
      //2.1 请求拦截
  instance.interceptors.request.use(config => {
    NProcess.start()
    console.log("开发环境有console")
    if(window.sessionStorage.getItem('token')) {
      config.headers.Authorization = window.sessionStorage.getItem('token')
    }
    return config;//!!!!!!你拦截之后一定要把返回的东西给返回过去喔！！！
  },err => {
    console.log(err);
  });

      //2.2响应拦截
  instance.interceptors.response.use(res => {
    // console.log(res,'响应拦截器');
    NProcess.done()
    return res.data;
  },err => {
    console.log(err);
  });

  //3.发送真正的网络请求
  return instance(config);
}