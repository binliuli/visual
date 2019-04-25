<template>
  <div class="search">
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单点查询" name="first">
          <el-select v-model="SingleValue" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="inputValue">
            <el-input v-model="inputSingle" placeholder="请输入内容"></el-input>
          </span>
          <span class="connect">查询最大深度：{{sliderValue}}</span>
          <span class="slideValue">
            <el-slider v-model="sliderValue" :step="1" :max="5" :min="1" show-stops></el-slider>
          </span>
          <el-button class="btn" type="primary" plain @click="handelSearchSingle()">查询</el-button>
        </el-tab-pane>
        <el-tab-pane label="关系查询" name="second">
          <div class="searchCon">
            <el-select v-model="relationshipValueL" placeholder="请选择">
              <el-option
                v-for="item in optionsCon"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="inputValue">
              <el-input v-model="inputRelationshipValueL" placeholder="请输入内容"></el-input>
            </span>
            <el-select v-model="relationshipValueR" placeholder="请选择" style="margin-left:60px;">
              <el-option
                v-for="item in optionsCon"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="inputValue">
              <el-input v-model="inputRelationshipValueR" placeholder="请输入内容"></el-input>
            </span>
            <el-button class="btn" type="primary" plain @click="handelSearchRelationship()">查询</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      class="visjs"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <p v-show="isPlay" class="noData">未查询到该搜索对象！</p>
      <div v-show="!isPlay" id="visjs"></div>
    </div>
    <div class="export">
      <p>{{shouData}}</p>
      <p class="right">*右键另存为图片</p>
    </div>
  </div>
</template>

<script>
import vis from "vis";
export default {
  name: "HelloWorld",
  data() {
    return {
      img: "",
      Person: require("./../assets/image/person.png"),
      PersonNo: require("./../assets/image/personNo.png"),
      Addr: require("./../assets/image/addr.png"),
      BankAcc: require("./../assets/image/bank.png"),
      Company: require("./../assets/image/company.png"),
      CompanyNo: require("./../assets/image/companyNo.png"),
      Device: require("./../assets/image/computer.png"),
      PRJ: require("./../assets/image/prj.png"),
      Tel: require("./../assets/image/tel.png"),
      Vehicel: require("./../assets/image/car.png"),
      carNo: require("./../assets/image/carNo.png"),
      carNum: require("./../assets/image/carnum.png"),
      carnumNo: require("./../assets/image/carnumNo.png"),
      default: require("./../assets/image/default.png"),
      group: require("./../assets/image/group.png"),
      activeName: "first",
      options: [
        {
          value: "Addr",
          label: "地址"
        },
        {
          value: "供应商银行账户",
          label: "银行卡号"
        },
        {
          value: "集团成员", //没有
          label: "集团成员"
        },
        {
          value: "Company",
          label: "公司"
        },
        {
          value: "PRJ",
          label: "合同号"
        },
        {
          value: "Tel",
          label: "电话"
        },
        {
          value: "Vehicle",
          label: "VIN"
        },
        {
          value: "车牌号",
          label: "车牌号"
        },
        {
          value: "集团",
          label: "集团名称"
        },
        {
          value: "PersonName", //没有
          label: "人员(姓名)"
        },
        {
          value: "PersonNo", //没有
          label: "人员(身份证)"
        }
      ],
      optionsCon: [
        {
          value: "Addr",
          label: "地址"
        },
        {
          value: "供应商银行账户",
          label: "银行卡号"
        },
        {
          value: "Company",
          label: "公司"
        },
        {
          value: "PRJ",
          label: "合同号"
        },
        {
          value: "Tel",
          label: "电话"
        },
        {
          value: "Vehicle",
          label: "VIN"
        },
        {
          value: "车牌号",
          label: "车牌号"
        },
        {
          value: "PersonName", //没有
          label: "人员(姓名)"
        },
        {
          value: "PersonNo", //没有
          label: "人员(身份证)"
        }
      ],
      SingleValue: "",
      relationshipValueL: "",
      relationshipValueR: "",
      inputSingle: "",
      inputRelationshipValueL: "",
      inputRelationshipValueR: "",
      sliderValue: 3,
      loading: false,
      isPlay: false,
      isVis: true,
      visjsData: {},
      shouData: ""
    };
  },
  mounted() {},
  methods: {
    handelSearchSingle() {
      if (this.SingleValue && this.inputSingle) {
        const data = {
          startNode: this.SingleValue,
          startValue: this.inputSingle,
          arra: `${this.sliderValue}`,
          type: "0"
        };
        this.getData(data);
      } else {
        this.open3();
      }
    },
    open3() {
      this.$message({
        message: "请输入要查询的内容！",
        type: "warning"
      });
    },
    async getData(data) {
      const ajaxIp = this.$GLOBALCONFIG.webapi; //接口ip
      this.loading = true;
      const dat = await this.$ajax({
        method: "post",
        url: ajaxIp + "/sq/queryNodeRelation",
        data: data
      });
      if ((dat.data.code = 200)) {
        if (dat.data.data && dat.data.data.nodes.length > 0) {
          this.isPlay = false;
          this.visjsData = dat.data.data;
          console.log(this.visjsData);
          this.handleData(dat.data.data, "visjs");
        } else {
          this.isPlay = true;
          this.loading = false;
        }
      } else {
        this.isPlay = true;
        this.loading = false;
      }
    },
    handelSearchRelationship() {
      if (
        this.relationshipValueL &&
        this.inputRelationshipValueL &&
        this.relationshipValueR &&
        this.inputRelationshipValueR
      ) {
        const data = {
          startNode: this.relationshipValueL,
          endNode: this.relationshipValueR,
          startValue: this.inputRelationshipValueL,
          endValue: this.inputRelationshipValueR,
          type: "1"
        };
        this.getData(data);
      } else {
        this.open3();
      }
    },
    visData(nodes, edges, id) {
      // create a network
      let container = document.getElementById(id);
      container.style.width = "100%";
      container.style.height = 700 + "px";
      let data = {
        nodes: nodes,
        edges: edges
      };
      let options = {
        edges: {
          font: { align: "middle" },
          shadow: true, //连接线阴影配置
          smooth: true, //是否显示方向箭头
          arrows: { to: true } //箭头指向from节点
        },
        layout: {
          improvedLayout: false //解决节点多，展示节点之间的关系
        },
        //设置节点的相互作用
        interaction: {
          //鼠标经过改变样式
          hover: true
          //设置禁止缩放
          //zoomView:false
        },
        //力导向图效果
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -4000,
            centralGravity: 0.3,
            springLength: 120,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0
          }
        },
        nodes: {
          shape: "dot",
          size: 30,
          color: {
            background: "#fff"
          },
          font: {
            size: 16
          },
          borderWidth: 1,
          shadow: false
        }
      };
      let network = new vis.Network(container, data, options);
      const _this = this;
      let stabilizedTimer;
      network.on("stabilized", function(params) {
        // 会调用两次？
        window.clearTimeout(stabilizedTimer);
        stabilizedTimer = setTimeout(function() {
          options.physics.enabled = true; // 开启物理系统
          network.setOptions(options);
          _this.loading = false;
        }, 200);
      });

      network.on("dragEnd", function(params) {
        if (params.nodes && params.nodes.length > 0) {
          network.clustering.updateClusteredNode(params.nodes[0], {
            physics: false
          });
        }
      });
      network.on("click", function(params) {
        const id = params.nodes;
        const nodes = _this.visjsData.nodes;
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id == id) {
            console.log(nodes[i]);
            // _this.shouData = nodes[i].properties;
            let properties = nodes[i].properties;
            let label = JSON.stringify(nodes[i].label);
            if (!properties) {
              return;
            }
            if (label.indexOf("Person") !== -1 && properties.c_no) {
              _this.shouData = `身份证号：${properties.c_no}`;
            } else if (label.indexOf("BankAcc") !== -1) {
              let biz = properties.BIZ_TYP_CD;
              if (biz == 0) {
                _this.shouData = "供应商账户类型：对公";
              } else if (biz == 1) {
                _this.shouData = "供应商账户类型：对私";
              }
            } else if (label.indexOf("Vehicle") !== -1 && properties.vin) {
              _this.shouData = `VIN：${properties.vin}`;
            } else if (
              label.indexOf("内部员工") !== -1 &&
              properties.EMPLOYEE_ID
            ) {
              _this.shouData = `内部员工工号：${properties.EMPLOYEE_ID}`;
            } else if (label.indexOf("PRJ") !== -1 && properties.PRJ_TYP_CD) {
              const PGJ = _this.$GLOBALCONFIG.prj;
              if (PGJ[properties.PRJ_TYP_CD]) {
                _this.shouData = `项目类型：${PGJ[properties.PRJ_TYP_CD]}`;
              }
            } else {
              _this.shouData = "";
            }
          }
        }
      });
      network.on("stabilized", function(params) {});
    },
    handleData(res, id) {
      const objEdges = {
        color: { color: "rgba(30,30,30,0.6)", highlight: "red" }
      };
      const imageNode = {
        Person: this.Person,
        Addr: this.Addr,
        BankAcc: this.BankAcc,
        Company: this.Company,
        Device: this.Device,
        PRJ: this.PRJ,
        Tel: this.Tel,
        Vehicle: this.Vehicel,
        carNum: this.carNum,
        default: this.default,
        group: this.group,
        PersonNo: this.PersonNo,
        CompanyNo: this.CompanyNo,
        carNo: this.carNo,
        carnumNo: this.carnumNo
      };
      const nodes = res.nodes;
      const newNodes = [];
      const edges = res.edges;
      const newEdges = [];
      for (let i = 0; i < nodes.length; i++) {
        var label = "";
        var imageLable = "";
        var colorFont = "#000";

        // 头像 下 名字 label
        if (nodes[i].label[0] == "PRJ") {
          if (
            nodes[i].properties &&
            nodes[i].properties.LS_CNT_NO &&
            nodes[i].properties.LS_CNT_NO !== ""
          ) {
            label = nodes[i].properties.LS_CNT_NO;
          } else {
            label = nodes[i].properties.name;
          }
        } else if (nodes[i].properties && nodes[i].properties.name) {
          label = nodes[i].properties.name;
        } else {
          label = "label";
        }

        const highName = JSON.stringify(nodes[i].properties);
        const highLable = JSON.stringify(nodes[i].label);
        // 单点查询
        if (this.inputSingle) {
          let singleLeft = "";
          if (this.SingleValue == "集团成员") {
            singleLeft = "Company";
          } else if (
            this.SingleValue == "PersonName" ||
            this.SingleValue == "PersonNo"
          ) {
            singleLeft = "Person";
          } else {
            singleLeft = this.SingleValue;
          }
          if (highLable.indexOf(singleLeft) !== -1) {
            if (highName.indexOf(this.inputSingle) !== -1) {
              colorFont = "red";
            } else {
              colorFont = "#000";
            }
          }
        }

        // 关系查询
        if (this.inputRelationshipValueL || this.inputRelationshipValueR) {
          let valueLeft = "";
          let valueRight = "";
          if (
            this.relationshipValueL == "PersonName" ||
            this.relationshipValueL == "PersonNo"
          ) {
            valueLeft = "Person";
          } else {
            valueLeft = this.relationshipValueL;
          }
          if (
            this.relationshipValueR == "PersonName" ||
            this.relationshipValueR == "PersonNo"
          ) {
            valueRight = "Person";
          } else {
            valueRight = this.relationshipValueR;
          }
          if (
            highLable.indexOf(valueLeft) !== -1 ||
            highLable.indexOf(valueRight) !== -1
          ) {
            if (
              highName.indexOf(this.inputRelationshipValueL) !== -1 ||
              highName.indexOf(this.inputRelationshipValueR) !== -1
            ) {
              colorFont = "red";
            } else {
              colorFont = "#000";
            }
          }
        }

        if (
          nodes[i].label[0] &&
          nodes[i].label[0] !== "车牌号" &&
          imageNode[nodes[i].label[0]]
        ) {
          imageLable = imageNode[nodes[i].label[0]];
        } else if (nodes[i].label[0] == "车牌号") {
          imageLable = imageNode.carNum;
        } else if (nodes[i].label[0] == "集团") {
          imageLable = imageNode.group;
        } else {
          imageLable = imageNode.default;
        }
        // 公司黑名单
        if (nodes[i].label[0] && nodes[i].label[0] == "Company") {
          if (
            nodes[i].properties &&
            nodes[i].properties.IS_BLACK_LIST &&
            nodes[i].properties.IS_BLACK_LIST == 1
          ) {
            imageLable = imageNode.CompanyNo;
          }
        }
        // 人黑名单
        if (nodes[i].label[0] && nodes[i].label[0] == "Person") {
          if (
            nodes[i].properties &&
            nodes[i].properties.RSK_LVL_CD &&
            nodes[i].properties.RSK_LVL_CD == 3
          ) {
            imageLable = imageNode.PersonNo;
          }
        }

        // 车牌黑名单
        if (nodes[i].label[0] && nodes[i].label[0] == "车牌号") {
          if (
            nodes[i].properties &&
            nodes[i].properties.RSK_LVL_CD &&
            nodes[i].properties.RSK_LVL_CD == 3
          ) {
            imageLable = imageNode.carnumNo;
          }
        }

        var objNodes = {
          shape: "circularImage",
          font: { color: colorFont }
        };
        newNodes.push({
          id: nodes[i].id,
          label: label,
          ...objNodes,
          image: imageLable
        });
      }
      for (let i = 0; i < edges.length; i++) {
        newEdges.push({
          from: edges[i].form,
          to: edges[i].to,
          label: edges[i].label,
          ...objEdges
        });
      }
      const nodeSet = new vis.DataSet(newNodes);
      const edgeSet = new vis.DataSet(newEdges);
      this.visData(nodeSet, edgeSet, id);
    },
    handleClick(tab, event) {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.el-slider__runway {
  margin: 0px !important;
}
.el-loading-spinner i {
  font-size: 60px;
  color: #409eff;
}
</style>

<style scoped lang="less">
.search {
  margin: 0 auto;
  .btn {
    margin-left: 60px;
    width: 140px;
  }
  .connect {
    margin-left: 30px;
    font-size: 14px;
  }
  .searchCon {
    overflow: hidden;
  }
  .slideValue {
    width: 300px;
    display: inline-block;
    margin-left: 30px;
  }
  .inputValue {
    width: 200px;
    display: inline-block;
    margin-left: 20px;
  }
  .visjs {
    height: 700px;
    border: 1px solid #e4e2e2;
    margin-top: 16px;
    .noData {
      text-align: center;
      font-size: 20px;
      color: #949494;
    }
  }
  .export {
    width: 100%;
    margin-top: 20px;
    font-size: 12px;
    color: #656464;
    .right {
      text-align: right;
    }
  }
}
</style>
