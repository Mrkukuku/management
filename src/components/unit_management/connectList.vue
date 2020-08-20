<template>
<!-- 巡检任务 -->
    <div id='connect_list' class='allcontent'>
        <el-row style='height:100%'>
            <el-col :span="4" class="tree_box" v-if="userType!=3">
                <div>
                    <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText" 
                        class="filter_text"
                        >
                    </el-input>
                    <el-tree 
                        :data="Treedata" 
                        :props="defaultProps" 
                        @node-click="handleNodeClick" 
                        :render-content="renderContent"
                        highlight-current
                        :filter-node-method="filterNode"
                        ref="tree"
                    >
                    </el-tree>
                </div>
            </el-col> 
         <!-- 头部 -->
          <el-col :span="userType==3&&24||20" style='height:100%'>
            <div class="top">
                <div>
              
                 &nbsp;人员 <el-select v-model="type" placeholder="请选择">
                    <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                    </el-option>
                </el-select>
                 &nbsp;异常情况 <el-select v-model="type1" placeholder="请选择">
                    <el-option
                    v-for="item in typeList1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
                 &nbsp;
                时间筛选：<el-date-picker
                v-model="startTime"
                type="date"
                placeholder="开始日期"
                :picker-options="expireTimeOptionStart"
                class="picker">
                </el-date-picker> -
                <el-date-picker
                v-model="endTime"
                type="date"
                :picker-options="expireTimeOptionEnd"
                placeholder="结束日期"
                class="picker">
                </el-date-picker>

                <el-button type="primary" @click="seach"> 查询</el-button>
                <el-button type="primary" @click="exportPolling">导出</el-button>
                <el-button type="primary" @click="handleReset">重置</el-button>
            </div>
            </div>
            <!-- 内容 -->
            <div style='margin-top:10px;height: 88%;position: relative;'>
            <!-- 表格 -->
            <el-table					
                :data="tableData"
                border
                style="width: 150"
                >
                <el-table-column
                prop="uname"
                label="值班人"
                width="120">
                </el-table-column>
                <el-table-column
                prop="nextHandUname"
                label="交接人"
                width="120">
                </el-table-column>
                <el-table-column
                prop="lastHandUname"
                label="接班人"
                width="120">
                </el-table-column>
                <el-table-column
                label="值班开始时间"
                width="160">
                  <template slot-scope="scope">
                    <span >{{ scope.row.watchStartTime|timeFormat }}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="值班结束时间"
                width="160">
                  <template slot-scope="scope">
                    <span > {{ scope.row.watchEndTime|timeFormat }}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="消防设施运行情况"
                width="140">
                 <template slot-scope="scope">
                    <span >{{ scope.row.checkList[0].status==1&&'正常'||scope.row.checkList[0].content&&scope.row.checkList[0].content||'异常' }}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="监控录像运行情况"
                width="140">
                 <template slot-scope="scope">
                    <span >{{ scope.row.checkList[1].status==1&&'正常'||scope.row.checkList[1].content&&scope.row.checkList[1].content||'异常' }}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="设备故障及排除情况"
                width="150">
                 <template slot-scope="scope">
                    <span >{{ scope.row.checkList[2].status==1&&'正常'||scope.row.checkList[2].content&&scope.row.checkList[2].content||'异常' }}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="其他情况"
                width="140">
                 <template slot-scope="scope">
                    <span >{{ scope.row.checkList[3].status==1&&'正常'||scope.row.checkList[3].content&&scope.row.checkList[3].content||'异常' }}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="对讲机(台)"
                width="100">
                 <template slot-scope="scope">
                    <span >{{ scope.row.deviceList[0].num }}</span>
                 </template>
                </el-table-column>
                <el-table-column
                label="钥匙(把)"
                width="100">
                 <template slot-scope="scope">
                    <span >{{ scope.row.deviceList[1].num }}</span>
                 </template>
                </el-table-column>
                <el-table-column
                label="空气呼吸器(套)"
                width="120">
                 <template slot-scope="scope">
                    <span >{{ scope.row.deviceList[2].num }}</span>
                 </template>
                </el-table-column>
                <el-table-column
                prop="otherArticle"
                label="其他物品"
                width="100">
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="position:absolute;bottom:0;" class="page">
                <pagination :total='total' @pageChange="pageChange" ref="paginations"></pagination>
            </div>
            </div>

        </el-col>
        </el-row>
</div>
</template>

<script>
import {Common} from './../../js/common'
import pagination from '../Children/Pagination'
export default {
    mixins:[Common],
    components:{
        pagination:pagination
    },
   data() {
       return {
            radio:1,
            module:'inspectionRecord',//模块
            userType:"",//用户类型
            unitId:'',//单位id
            currentPage:1,
            rows:10,
            total:100,
            tableData:[],//巡检记录
            startTime:'',
            endTime:'',
            expireTimeOptionStart: {
                disabledDate: time => {
                    let beginDateVal = this.endTime;
                    if (beginDateVal) {
                        return (
                            time.getTime() >new Date(beginDateVal).getTime() || (time.getTime() > Date.now())
                        )
                    }
                    return time.getTime() > Date.now()
                },
            },
            expireTimeOptionEnd: {
                disabledDate: time => {
                    let beginDateVal = this.startTime;
                    if (beginDateVal) {
                        return (
                            (time.getTime() < new Date(beginDateVal).getTime()) || (time.getTime() > Date.now())
                        )
                    }
                        return time.getTime() > Date.now()
                },
            },
            type:'',//日检
            typeList:[
                {
                    id:1,
                    name:"是"
                },
                {
                    id:0,
                    name:'否'
                }
            ],
            type1:'',//消控值班
            typeList1:[
                {
                    id:1,
                    name:"消防设施运行情况"
                },
                {
                    id:2,
                    name:'监控录像运行情况'
                },
                {
                    id:3,
                    name:'设备故障及排除情况'
                },
                {
                    id:4,
                    name:'其他情况'
                },
            ],
          
       }
   },
 methods:{
     exportPolling(){
          this.axios({
            url:"/api/admin/fire/control/handover/info/excel",
            method:"post",
            data:{
                startTime:this.startTime,
                endTime:this.endTime,
                unitId:this.unitId,
            }
        }).then( res =>{
            if( res.data.code ==0 ){
                if( res.data.data){
                    location.href = res.data.data
                }
            }
                if( res.data.msg)this.$alert(res.data.msg)
            
        })
     },
    seach(){
        this.currentPage = 1
        this.getDatas()
    },
    getDatas () {
        this.axios({
            url:"/api/admin/fire/control/handover/list",
            method:"post",
            data:{
                startTime:this.startTime,
                endTime:this.endTime,
                unitId:this.unitId,
                pageSize:this.rows,
                pageNum:this.currentPage,
                uid:this.type,
                exceptionType:this.type1,
            }
        }).then( res =>{
            if( res.data.code ==0 ){
                    this.tableData = res.data.list
                    // this.tableData&&this.tableData.map( item =>{
                    //     item.lastLoginTime = item.lastLoginTime&&item.lastLoginTime.slice(0,10)
                    // })
                    this.total = res.data.total
            }else{
                this.$alert(res.data.msg)
            }
        })
    },
    getpeople(){
        this.axios({
            url:"/api/admin/user/fire/control/list",
            method:"post",
            data:{
                id:this.unitId,
            }
        }).then( res =>{
            if( res.data.code ==0 ){
               this.typeList =res.data.data
            }else{
                this.$alert(res.data.msg)
            }
        })
    },
     getData(){
         
     },
    handleReset () {//重置
        //   Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
        this.startTime = ''
        this.endTime = ''
        this.type = ''
        this.type1 = ''
        this.currentPage=1
        this.$refs.paginations.changePageNum(1)
        this.getDatas()
    },
    pageChange (item) {//页数页码改变页面重新刷新
        this.currentPage = item.page_index;
        this.rows = item.page_limit;
        this.getDatas()
    },
    renderContent(h, { node, data}) {//树前小图标
        return (
        <span>
            <i class={data.icon}></i>
            &nbsp;<span>{node.label}</span>
        </span>
        );
    },
    handleNodeClick(data) { //点击树节点
        this.unitId = data.id
        this.getDatas()
        this.getpeople()
    },
},
    mounted() {
        this.userType = sessionStorage.getItem('userTypes')
        this.unitId = Number(sessionStorage.getItem('unitId'))
        if(  this.userType==3 ){
            this.getDatas()
            this.getpeople()
        }
    },
}
</script>

<style lang="scss">
      
    #connect_list{
        .el-table:before{
            width:0;
        }
        .el-input{
            width:190px;
        }
        .filter_text{
            width:230px;
        }
        .el-table th div{
            line-height: normal
        }
        .top .el-date-editor{
            width:140px!important;
        }
        .page{
            .el-input{
            width:120px;
            }
            .el-input__suffix{
                top:-7px
            }
        }
    }
</style>