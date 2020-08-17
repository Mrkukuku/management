<template>
<!-- 巡检任务 -->
    <div id='fire_facility' class='allcontent'>
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
              
                 &nbsp;提交人 <el-select v-model="type" placeholder="请选择">
                    <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                    </el-option>
                </el-select>
                 &nbsp;维修人 <el-select v-model="type2" placeholder="请选择">
                    <el-option
                    v-for="item in typeList2"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                    </el-option>
                </el-select>
                 &nbsp;完成情况 <el-select v-model="type1" placeholder="请选择">
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
                >
               <el-table-column
                     label="故障情况"
                     align="center"
                     >
                          <el-table-column
                            prop="time"
                            label="发现时间"
                            align="center"
                            width="140">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="发现人签名"
                             align="center"
                            width="100">
                                  <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="故障部位"
                            align="center"
                            width="140">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="故障情况描述"
                             align="center"
                            width="140">
                                  <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                </el-table-column>
               <el-table-column
                     label="故障维修情况"
                     align="center"
                     >
                          <el-table-column
                            prop="time"
                            label="是否停用系统"
                            align="center"
                            width="140">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="现场图片"
                             align="center"
                            width="100">
                                  <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="安全保护措施"
                            align="center"
                            width="140">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="维修时间"
                             align="center"
                            width="160">
                                  <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="维修人员（单位）"
                             align="center"
                            width="140">
                                  <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="维修方法"
                             align="center"
                            width="160">
                                  <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="整改图片"
                             align="center"
                            width="140">
                                  <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                       
                </el-table-column>
                 <el-table-column
                    prop="time"
                    label="故障排除确认"
                    align="center"
                    >
                        <template slot-scope="scope">
                            <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==1&&'√'||'' }}</span>
                        </template>
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
            total:0,
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
            type:'',
            typeList:[
            ],
            type1:'',
            typeList1:[
                {
                    id:0,
                    name:"未完成"
                },
                {
                    id:1,
                    name:'已完成'
                },
            ],
            type2:'',
            typeList2:[
            ],

          
       }
   },
 methods:{
     exportPolling(){

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
            // this.getDatas()
            // this.getpeople()
        }
    },
}
</script>

<style lang="scss">
      
    #fire_facility{
        .el-table{
            border-bottom: 1px solid #EBEEF5;
        }
        .el-table:before{
            width:0;
        }
        .el-table thead.is-group th{
         background-color: #FFF;
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