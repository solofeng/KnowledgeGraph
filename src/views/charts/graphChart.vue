<template>
    <section class="chart-container">
      <el-row>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="form">
            <el-form-item>
              <el-input v-model="form.queryText" placeholder="出版物名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-on:click="getInfo">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div id="chartGraph" style="width:75%; height:550px;margin-top:5px;float:left;"></div>
      <div style="width:25%;float:left;">
        <el-input
          type="textarea"
          :autosize="{ minRows: 24, maxRows: 24}"
          placeholder="图谱实体详情简介区域，双击左侧图谱实体节点查看关联实体及相关信息"
          v-model="textarea">
        </el-input>
      </div>
    </section>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartGraph: null,
                form: {
                  queryText: ""
                },
                displayFlag: false,
                nodes: [],
                links: [],
                categories: [],
                countCategory: 0,
                textarea: "",
                rootText: "",
                tmpText: ""
            }
        },

        methods: {
            drawGraphChart(_this) {
                _this.chartGraph = echarts.init(document.getElementById('chartGraph'));
                let option = ({
                  title: {
                      text: '出版物知识图谱',
                      subtext: '',
                      top: 'bottom',
                      left: 'right'
                  },
                  tooltip: {},
                  legend: [{
                      data: _this.categories.map(function (a) {
                          return a.name;
                      })
                  }],
                  animation: true,

                  series : [
                      {
                          name: '出版物知识图谱',
                          type: 'graph',
                          layout: 'force',
                          symbolSize: 30,
                          animation: true,
                          data: this.nodes,
                          links: this.links,
                          categories: this.categories,
                          edgeSymbol: [null, 'arrow'],
                          label: {
                            normal: {
                              position: 'right',
                              formatter: '{b}',
                              show: true
                            }
                          },
                          edgeLabel: {
                            normal: {
                              show: true,
                              textStyle: {
                                fontSize: 10
                              },
                              formatter: '{c}'
                            }
                          },
                          // 主要通过调节以下参数，获得良好的力引导布局
                          force: {
                            edgeLength: 100,
                            repulsion: 400,
                            gravity: 0.01
                          }
                      }
                  ]
                });
                this.chartGraph.setOption(option);
                // 双击图表中节点时显示选取控件
                this.chartGraph.on('dblclick', function (params) {
                  _this.tmpText = params.data.name;
                  _this.queryCNDBavpair(params.data.name,_this);
                });
            },
            drawCharts(_this) {
                this.drawGraphChart(_this);
            },

            getInfo: function () {
              this.nodes = [];
              this.links = [];
              this.queryCNDBpedia(this.form.queryText);
            },

      			queryCNDBpedia: function (req) {
              console.log(req);
              this.$http.post('/api/cnDBpedia/cnDBpedia', {
                'queryText': req
              },{}).then((response) => {
                console.log(response.data.body);
                if(response.data.body.status == "ok") {
                  this.pediaDataProcessor(req,response.data.body.ret);
                }
              });
      			},

            queryCNDBavpair: function (req,_this) {
              console.log(req);
              _this.$http.post('/api/cnDBavpair/cnDBavpair', {
                'queryText': req
              },{}).then((response) => {
                console.log(response.data.body);
                if(response.data.body.status == "ok") {
                  _this.avpairDataProcessor(req,response.data.body.ret,_this);
                }
              });
      			},

            pediaDataProcessor: function(root,res) {
              this.categories = [];
              var _this = this;
              let nodeSet = [];
              let linkSet = [];
              let rootNode = {
                'name': root.toString(),
                'value': root.toString(),
                'symbolSize': 30,
                'category': _this.countCategory,
                'draggable': true
              }
              nodeSet.push(rootNode);
              this.rootText = root;
              this.categories.push({'name': root+'的实体关系'});
              res.forEach(function (data) {
                let newNode = {
                  'name': data,
                  'value': data,
                  'symbolSize': 30,
                  'category': _this.countCategory,
                  'draggable': true
                }
                let newEdge = {
                  'source': rootNode.name,
                  'target': newNode.name,
                  'value': "关联实体推荐"
                };
                if(data != root){
                  nodeSet.push(newNode);
                  linkSet.push(newEdge);
                }
              });
              if(nodeSet.length != 1) {
                nodeSet.forEach(function (node) {
                  _this.nodes.push(node);
                });
                linkSet.forEach(function (link) {
                  _this.links.push(link);
                });
              }
              this.drawCharts(this);
            },

            avpairDataProcessor: function(root,res,_this) {
              _this.countCategory = _this.countCategory + 1;
              let nodeSet = [];
              let linkSet = [];
              let rootNode = {
                'name': root.toString(),
                'value': root.toString(),
                'symbolSize': 30,
                'category': _this.countCategory,
                'draggable': true
              }
              nodeSet.push(rootNode);

              res.forEach(function (data) {
                let nodeName = data[1];
                let linkName = data[0];
                if(linkName == "DESC") {
                  let temp = "图谱实体节点名称：\n"+_this.tmpText;
                  let webLink = "\n\n" +"网页链接：\n"+ "http://kw.fudan.edu.cn/cndbpedia/search/?mention=" + _this.rootText +"&entity=" + root;
                  let desc = "\n\n图谱实体详情简介：\n"+nodeName;
                  _this.textarea = temp+webLink+desc;
                  console.log(_this.textarea);
                }else {
                  let newNode = {
                    'name': nodeName,
                    'value': nodeName,
                    'symbolSize': 30,
                    'category': _this.countCategory,
                    'draggable': true
                  }
                  let newEdge = {
                    'source': rootNode.name,
                    'target': newNode.name,
                    'value': linkName
                  };
                  if(nodeName != root){
                    nodeSet.push(newNode);
                    linkSet.push(newEdge);
                  }
                }
              });
              let nodeAddFlag = true;
              if(nodeSet.length != 1) {
                nodeSet.forEach(function (node1) {
                  nodeAddFlag = true;
                  _this.nodes.forEach(function (node2) {
                    if(node1.name == node2.name) {
                      nodeAddFlag = false;
                    }
                  });
                  if(nodeAddFlag) {
                    _this.nodes.push(node1);
                  }
                });

                linkSet.forEach(function (link) {
                  _this.links.push(link);
                });

                _this.categories.push({'name': root+'的实体关系'});
              }
              _this.drawCharts(_this);
            }
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/
</style>
