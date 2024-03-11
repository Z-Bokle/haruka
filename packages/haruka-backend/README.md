# Haruka Backend
Haruka的后端实现

## 注意
仓库中不包含sqlite的数据库文件，请根据entity目录下的实体类自行创建数据库和表

## 客户端分布表单流程
1. 创建会话 step设为0
2. 选择模型，输入APIKey，输入或获取Prompt
3. 生成文本 step设为1
4. 生成音频 step设为2
5. 生成视频 step设为3

## TODO
- [ ] 任务进度查询
- [x] Session列表按照时间倒序排序