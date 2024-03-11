# Haruka APP
Haruka ReactNative 客户端

## 各功能组件与第三方依赖
1. 状态管理 zustand / useState
2. 页面导航 react-navigation
3. UI组件库 react-native-paper
4. 图标 react-native-vector-icons
5. 网络请求 原生fetch封装
6. 安全存储 react-native-sensitive-info
7. 视频播放 react-native-video
8. 毛玻璃 react-native-blur
9.  弹窗选择器 react-native-modal-selector
10. 进度条 react-native-progress
11. 音频播放 react-native-sound
12. 相册资源管理 react-native-image-picker

## 开发工具
1. UI调试 react-devtools
2. JS逻辑与网络调试 Reactotron

## 项目结构(仅RN部分)
- components 组件  
- pages 页面  
    - Authorization 登录注册  
    - Home 首页(暂不使用)  
    - Session 会话/分步表单  
    - Sessions 会话列表  
    - Settings 设置  
- utils 工具  
- hooks 抽象复杂业务逻辑的Hooks
- api 映射后端接口
- assets 资源

## 非业务TODO
- [x] 状态管理
- [x] 路由与底部导航
  - [x] 底部导航
  - [x] 路由
    - [x] Stack路由
    - [x] Screen路由
- [x] 本地存储读写
- [x] 网络请求与请求工具的封装
- [x] UI特效，如TouchableRipple
- [ ] 夜间模式适配（次要）

## 业务TODO
每个业务包含UI和逻辑两部分
- [x] 登录注册
  - [x] 登录
  - [x] 注册 
- [x] 会话列表
  - [x] 会话Card展示
  - [ ] 会话Card管理
- [x] 设置页
  - [x] 用户登出与Profile展示(头像给默认图片即可)
  - [x] 填写请求目标的IP地址或域名
    - [x] 登录注册页也要给一个入口
- [ ] 会话详情
  - [ ] 会话详情页分步表单
  - [ ] 详情页的回显

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