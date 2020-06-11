# 咕咕报
基于`Node.js`、`Socket.io`、`Vue.js`的点对点在线聊天系统。

## 功能
- 认证
  - 登录
  - 注册
  - 退出登录
- 聊天
  - 在线/离线聊天
  - 未读消息显示
  - 好友在线状态显示
  - 发送文本/emoji/文件
  - 黄暴信息屏蔽
  - 按时间范围/关键词查看聊天记录
  - 根据聊天记录生成词云
- 联系人
  - 查看联系人资料
  - 搜索/删除列表中已有联系人
  - 查找/添加新联系人
  - 发送/接受/拒绝好友申请
  - 设置好友备注
- 设置
  - 修改昵称/简介/头像/密码
  - 明色/暗色模式切换

## 快速开始
### 本地运行
1. 开启数据库
```shell
$ docker run -p 3306:3306 --name mysql 
				 -e MYSQL_USER=rjgc 
				 -e MYSQL_PASSWORD=rjgc123 
				 -e MYSQL_DATABASE=seproject 
				 -e MYSQL_ROOT_PASSWORD=pwd 
				 -d mysql:5.7 
				 --character-set-server=utf8mb4
				 --collation-server=utf8mb4_unicode_ci
```

2. 克隆仓库
```shell
$ git clone https://github.com/zcl1115/chat-online-demo.git
```

3. 进入仓库
```shell
$ cd chat-online-demo
```

4. 安装依赖
```shell
$ npm install
```

5. 运行
- 后端

```shell
$ cd server
$ node main.js
```

- 前端

```shell
$ npm run serve
```

6. 访问 http://localhost:8080

## 页面展示
### 认证
- 登录

![](./screenshots/login.png)

- 注册

![](./screenshots/signup.png)

### 聊天
- 主页面

![](./screenshots/chat-default.png)

![](./screenshots/chat-detail.png)

- 历史记录

![](./screenshots/chat-history-general.png)

![](./screenshots/chat-history-advanced.png)

- 生成词云

![](./screenshots/chat-wordcloud.png)

### 联系人
- 主页面

![](./screenshots/contacts-default.png)

- 查看信息

![](./screenshots/contacts-user-info.png)

- 搜索已有联系人

![](./screenshots/contacts-search.png)

- 搜索新联系人

![](./screenshots/contacts-add.png)

- 发送好友申请

![](./screenshots/contacts-send-req.png)

- 接收好友申请

![](./screenshots/contacts-receive-req.png)
![](./screenshots/contacts-receive-req-detail.png)

### 设置
- 修改个人信息

![](./screenshots/setting-edit-info.png)

- 修改帐号密码

![](./screenshots/setting-edit-pwd.png)

- 主题模式切换

![](./screenshots/setting-mode.png)

### 暗色

- 聊天

![](./screenshots/darkmode-chat.png)

- 联系人

![](./screenshots/darkmode-contacts.png)

- 设置

![](./screenshots/darkmode-setting-info.png)

![](./screenshots/darkmode-setting-pwd.png)

![](./screenshots/darkmode-setting-mode.png)
