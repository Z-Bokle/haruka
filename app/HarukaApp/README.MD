# Haruka APP
Haruka ReactNative 客户端

## 技术栈
1. 核心 react-native
2. 状态管理 zustand
3. 页面导航 react-navigation
4. UI组件库 react-native-paper
5. 图标 react-native-vector-icons
6. 网络请求 原生fetch封装
7. 安全存储 react-native-sensitive-info

## 项目结构(仅RN部分)
- components 组件  
- pages 页面  
    - Authorization 登录注册  
    - Home 首页  
    - Session 会话/分步表单  
    - Sessions 会话列表  
    - Settings 设置  
- utils 工具  

## 非业务TODO
- [x] 状态管理
- [ ] 路由与底部导航
  - [x] 底部导航
  - [ ] 路由
    - [ ] Stack路由
    - [x] Screen路由
- [ ] 本地存储读写
- [ ] 网络请求与请求工具的封装
- [ ] UI特效，如TouchableRipple

## 业务TODO
每个业务包含UI和逻辑两部分
- [ ] 登录注册
  - [ ] 登录
  - [ ] 注册 
- [ ] 会话列表
  - [ ] 会话Card展示
  - [ ] 会话Card管理
- [ ] 设置页
  - [ ] 用户登出与Profile展示(头像给默认图片即可)
  - [ ] 填写请求目标的IP地址或域名
- [ ] 会话详情
  - [ ] 会话Card
  - [ ] 会话列表管理
- [ ] 首页
  - [ ] 会话创建入口
  - [ ] 用法简介

## 基本Auth逻辑
- 进入APP，查询本地Token
   - 有Token，验证Token有效性
        - Token有效，将Token读入状态管理使用，跳转到Home
        - Token过期，删除本地存储中的Token，跳转到登录页
   - 没有Token，跳转到登录页

- 发送一般请求(除注册和登录外的请求，这些请求需要验证Token)
   - Token有效，业务正常
   - Token过期，删除状态管理和本地存储中的Token，跳转到登录页

- 登录成功，获得Token
   - 将Token写入状态管理和本地存储