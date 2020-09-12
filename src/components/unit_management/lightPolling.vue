<template>
<!-- 巡检任务 -->
    <div id='spot_check' class='allcontent'>
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
                 &nbsp;检查人: <el-select v-model="type" placeholder="请选择">
                    <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.text"
                    :value="item.text">
                    </el-option>
                </el-select>
                 &nbsp;
                时间筛选：<el-date-picker
                v-model="startTime"
                type="date"
                placeholder="开始日期"
                 value-format="yyyy-MM-dd"
                :picker-options="expireTimeOptionStart"
                class="picker">
                </el-date-picker> -
                <el-date-picker
                v-model="endTime"
                type="date"
                :picker-options="expireTimeOptionEnd"
                placeholder="结束日期"
                 value-format="yyyy-MM-dd"
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
                    prop="updateTime"
                    label="日期"
                    align="center"
                    width="160"
                    >
                 </el-table-column>
                 <el-table-column
                    prop="name"
                    label="总数量"
                    align="center"
                    width="140"
                    >
                 </el-table-column>
                 <el-table-column
                    prop="address"
                    label="异常数"
                    align="center"
                    width="160"
                    >
                 </el-table-column>
                 <el-table-column
                    prop="address"
                    label="正常数"
                    align="center"
                    width="90"
                    >
                 </el-table-column>
                 <el-table-column
                    prop="uname"
                    label="检查人"
                    align="center"
                    width="100"
                    >
                 </el-table-column>
                 <el-table-column
                    prop="time"
                    label="详情"
                    align="center"
                    >
                    <template slot-scope='scope'>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="editData(scope.row.id)">查看</el-button>
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
                    name:"正常"
                },
                {
                    id:1,
                    name:'异常'
                },
            ],
            department:'',
            checkList:[],
            pollingVisible:false,
            pollingDetail:{}
       }
   },
 methods:{
     exportPolling(){
         this.$post('/api/admin/device/inspection/info/excel',{
               startTime:this.startTime,
                endTime:this.endTime,
                // unitId:2511,
                unitId:this.unitId,
         }).then( res =>{
             if( res.data ){
                 location.href=res.data
             }
         })
     },
     editData(id){
         this.$post('/api/admin/device/inspection/single',{
             id
         }).then( res =>{
             this.pollingVisible = true
             this.pollingDetail = res.data
         })
     },
    seach(){
        this.currentPage = 1
        this.getDatas()
    },
    getDatas () {
        this.axios({
            url:"/api/admin/device/inspection/list",
            method:"post",
            data:{
                startTime:this.startTime,
                endTime:this.endTime,
                // unitId:2511,
                unitId:this.unitId,
                pageSize:this.rows,          
                pageNum:this.currentPage,
                uname:this.type,
                checkTypeName:this.type1,
                name:this.department
            }
        }).then( res =>{
            if( res.data.code ==0 ){
                    this.tableData = res.data.data.startPage.list
                    this.total = res.data.data.startPage.total
                    this.checkList = res.data.data.deviceTypeList
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
        this.department=""
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
    },
},
    mounted() {
        this.userType = sessionStorage.getItem('userTypes')
        this.unitId = Number(sessionStorage.getItem('unitId'))
        if(  this.userType==3 ){
            // this.getDatas()
        }
    },
}
</script>

<style lang="scss">
      
    #spot_check{
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