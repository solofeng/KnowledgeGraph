# To start

``` bash
# 客户端

# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build

# 服务端
cd server

node index

```

录屏演示DEMO：</br>
![image](https://github.com/yard214/KnowledgeGraph/raw/master/static/gif/demo.gif)  
</br>

PPT： static\ppt\【PPT】出版物知识图谱查询及关联推荐可视化系统.pptx</br>

出版物知识图谱查询及关联推荐可视化系统：</br>

主要实现的功能是针对所输入的出版物名称进行实体模糊匹配查询及相关联实体的推荐，对查询及推荐结果通过力引导布局图的形式动态可视化展示出来。</br>
同时支持进行进一步图谱实体详细信息查询功能，以图的节点形式深度搜索下去，同样支持力引导图动态展示，将主要关系通过节点形式绘制出，详细描述信息则通过右侧说明栏位进行展示。</br>
客户端主要通过Vue.js技术，框架选用elementUI。</br>
服务端主要通过Node.js实现，框架选用Express，请求及返回报文通过json处理。</br>
知识图谱源为开放的中文知识图谱CN-DBPedia。</br>
数据通过mock进行中间态数据存储。</br>
图谱查询推荐结果力引导图展示部分使用百度Echarts图表Graph组件。</br>


# Browser support

Modern browsers and IE 10+.

# License
[MIT](http://opensource.org/licenses/MIT)
