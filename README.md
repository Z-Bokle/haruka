# Haruka
Haruka是AIGC新闻视频生成工具的工程项目。

## 名字来源
其名字Haruka来自于日语“<ruby>春风<rt>はるか</rt></ruby>”的一种读法，灵感来自于OpenAI发布的新大模型Sora。  
Sora是日语中“<ruby>天<rt>そら</rt></ruby>”的一种读法，意为“天空”，表示其无尽的创造力。而在日本的一些文学作品中，Sora和Haruka这两个名字有时会同时出现在主角一行人中，有的是家人的关系，也有的是前后辈的关系。起名为Haruka既表现了与Sora在部分功能上的一些相似性，也寄托了作者对Haruka的美好愿景，即为使用者带来便利，像“春风”一样带来温暖。  
此外，Haruka也可以表示晴朗的天空的含义，即“<ruby>晴空<rt>はるか</rt></ruby>”。

## 命令
```
# 初始化所有仓库(含APP)
pnpm run init

# 在开发环境下运行huruka后端
pnpm run dev:be

# 在开发环境下运行huruka客户端
pnpm run dev:app
```

## 注意
- Haruka APP使用yarn作为包管理工具，该模块不纳入pnpm workspace管理，需要操作该模块需要进入到该模块的目录中使用yarn命令。


## 环境支持
1. nodejs v20.11.1
2. jdk 17
3. pnpm 8.12.0
4. Android Studio (仅用于编译和调试Android应用)
5. yarn 1.22.21