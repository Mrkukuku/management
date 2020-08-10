<template>
<!-- 巡检任务 -->
    <div id='inspection_record' class='allcontent'>
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
            <el-col :span="20" style='height:100%'>
         <!-- 头部 -->
        <div class="top">
                <!-- value-format="yyyy-MM-dd" -->

            <div>
              <!-- &nbsp;巡检类型 <el-select v-model="type" placeholder="请选择">
                    <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select> -->
                &nbsp;姓名：<el-input v-model="username"></el-input>&nbsp;
                时间筛选：<el-date-picker
                v-model="startTime"
                type="date"
                placeholder="选择开始日期时间"
                :picker-options="expireTimeOptionStart"
                class="picker">
                </el-date-picker> -
                <el-date-picker
                v-model="endTime"
                type="date"
                :picker-options="expireTimeOptionEnd"
                placeholder="选择结束日期时间"
                class="picker">
                </el-date-picker>
                <el-button type="primary" @click="seach"> 查询</el-button>
                <el-button type="primary" @click="handleReset">重置</el-button>
                <el-button type="primary" @click="exportList" :disabled="addFalg||fileLoading"> 导出</el-button>
                <span class="online">当天巡检数:{{todayCount}}</span>
            </div>
        </div>
        <!-- 内容 -->
        <div style='margin-top:10px;height: 88%;position: relative;'>
            <!-- 表格 -->
            <el-table					
                :data="tableData"
                border
                style="width: 150"
                v-loading="fileLoading"
                >
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="unitName"
                label="单位名称"
                width="250">
                </el-table-column>
                <el-table-column
                prop="checkName"
                label="检查人员"
                width="250">
                </el-table-column>
                <el-table-column
                prop="checkTotal"
                label="检查总数"
                width="100">
                </el-table-column>
                <el-table-column
                prop="exceptionTotal"
                label="异常总数"
                width="100">
                </el-table-column>
                <el-table-column
                prop="checkTime"
                label="检查时间"
                width="250">
                </el-table-column>
                <el-table-column label="操作">
                    <!-- <template slot-scope='scope'>
                        <el-button
                        size="mini"
                        type="primary"
                        class='el-icon-edit'
                        @click="editData(scope.row.id)">查看</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        class='el-icon-delete'
                        @click="handleDelete(scope.row.id)">删除</el-button>
                    </template> -->
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
            module:'inspectionRecord',//模块
            userType:"",//用户类型
            unitId:'',//单位id
            currentPage:1,
            rows:10,
            total:1,
            addFalg:true,
            tableData:[],//巡检记录
            startTime:'',
            endTime:'',
            username:"",//员工名称
            todayCount:'',
            expireTimeOptionStart: {
                disabledDate: time => {
                    let beginDateVal = this.endTime;
                    if (beginDateVal) {
                        return (
                            time.getTime() >new Date(beginDateVal).getTime() || (time.getTime() > Date.now())
                        );
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
            fileLoading:false,
            type:1,//巡检类型
            typeList:[
                {
                    id:1,
                    name:"日检"
                },
                {
                    id:2,
                    name:'月检'
                }
            ]
       }
   },
 methods:{
    seach(){
        this.currentPage = 1
        this.getDatas()
    },
    getData(){

    },
    getDatas () {

        this.axios({
            url:"/api/admin/fire/inspection/list",
            method:"post",
            data:{
                name:this.username,
                startTime:this.startTime,
                endTime:this.endTime,
                unitId:this.unitId,
                pageSize:this.rows,
                pageNum:this.currentPage
            }
        }).then( res =>{
            if( res.data.code ==0 ){
                res.data.list.map( (item) =>{
                    item.checkTime = item.checkTime && this.$moment( item.checkTime).format("YYYY-MM-DD HH:mm") || ''
                })
                this.tableData = res.data.list
                this.total = res.data.total
            }
        })
    },
    getCount(){
         this.axios({
            url:"/api/admin/fire/inspection/count",
            method:"post",
            data:{
                unitId:this.unitId,
                pageSize:this.rows,
                pageNum:this.currentPage
            }
        }).then( res =>{
            if( res.data.code ==0 ){
                this.todayCount =res.data.data.total
            }
        })
    },
    editData (id) {
    
    },
    exportList () {//导出
        if( this.startTime && this.endTime ) {
            this.fileLoading =true
            this.axios({
                url:"/api/admin/fire/inspection/inof/excel",
                method:"post",
                data:{
                    startTime:this.startTime,
                    endTime:this.endTime,
                    unitId:this.unitId,
                }
            }).then( res =>{
                if( res.data.code==0 ){
                    if( res.data.data ){
                        location.href=res.data.data
                    }
                    this.fileLoading = false
                    if( res.data.msg ){
                        this.$alert(res.data.msg)
                    }
                }else{
                     this.$alert(res.data.msg)
                }
            })
            setTimeout( ()=>{
                this.fileLoading = false
            },20000)
        }else{
            this.$alert('请选择时间')
        }

    }, 
    handleReset () {//重置
        //   Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
        this.username = ''
        this.startTime = ''
        this.endTime = ''
        this.currentPage=1
        // this.rows=10
        this.$refs.paginations.changePageNum(1)
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
         if( data.type == 0 ) {
            this.addFalg = true
        }else{
            this.addFalg = false
        }
        this.getCount()
        this.handleReset()
    },
    pageChange (item) {//页数页码改变页面重新刷新
        this.currentPage = item.page_index;
        this.rows = item.page_limit;
        this.getDatas()
    },
},
    mounted() {
        this.userType = sessionStorage.getItem('userTypes')
        if( this.userType ==3 ){
            this.addFalg = false
        }
        this.unitId =Number(sessionStorage.getItem('unitId'))
        this.getDatas()
        this.getCount()
    },
}
</script>

<style lang="scss" >
    #inspection_record{
        .el-table:before{
            width:0;
        }
        .el-input{
            width:140px;
        }
        .filter_text{
            width:230px;
        }
        .el-table th div{
            line-height: normal
        }
        .top .el-date-editor{
            width:180px!important;
        }
        .top .online{
            margin-left: 10px;
            color: #909399;
            font-size: 14px;
            font-weight: 700;
            float: right;
        }
        .page{
            .el-input{
            width:120px;
            }
            .el-input__suffix{
                top:-7px
            }
        }
        .demo-ruleForm,.detail-ruleForm{
            .number{
                width: 76px!important;
            }
            .plus{
                font-size: 21px;
                margin-left: 3px;
                cursor: pointer;
            }
            .picker_time{
                width: 230px!important;
            }
            .formfooter{
                text-align: left;
            }
            .textarea1{
                width: 392px;
                
            }
            .textarea{
                width: 392px;
                textarea{
                    min-height: 85px!important;
                }
            }
            .position{
                width: 310px;
            }
        }
        .detail-ruleForm{
            .el-input.is-disabled .el-input__inner,.more input{
                color: #606266;
                cursor: default;
                background-color: #F5F7FA;
                border-color: #E4E7ED;
            }
            .more input{
                cursor: pointer;
            }
            .el-input{
                width:275px;
            }
             .textarea1{
                width: 407px;
                textarea{
                     color: #606266;
                    cursor: default;
                }
            }
            .textarea{
                width: 407px;
                color: #606266;
                cursor: default;
            }
            .el-button{
                padding: 7px 1px;
                margin-left: 2px;
            }
           
        }
        .device_detail{
            .el-form-item__content,.el-form-item__label{
                line-height: normal
            }
            .line{
               height: 0;
               width: 100%;
               border-bottom: 1px solid #eee;
               margin-bottom: 2px;
           }
        }
    }
</style>