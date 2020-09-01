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
                  &nbsp;设备名称：<el-input v-model="department"></el-input>&nbsp;
                 &nbsp;检查人 <el-select v-model="type" placeholder="请选择">
                    <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.text"
                    :value="item.text">
                    </el-option>
                </el-select>
                 &nbsp;检查项 <el-select v-model="type1" placeholder="请选择">
                    <el-option
                    v-for="item in typeList1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
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
                    prop="updateTime"
                    label="时间"
                    align="center"
                    width="160"
                    >
                 </el-table-column>
                 <el-table-column
                    prop="name"
                    label="设备名称"
                    align="center"
                    width="140"
                    >
                 </el-table-column>
                 <el-table-column
                    prop="address"
                    label="地址"
                    align="center"
                    width="160"
                    >
                 </el-table-column>
               <el-table-column
                :label="items.deviceTypeName"
                align="center"
                v-for="(items, indexs) in checkList" :key="indexs"
                >
                    <el-table-column
                        :label="item.checkTypeName"
                        align="center"
                        width="90"
                        v-for="(item, index) in items.checkTypeList" :key="index"
                        >
                            <template slot-scope="scope">
                                <span >{{ scope.row.checkList[(indexs)*8+index].status }}</span>
                            </template>
                    </el-table-column>
                
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
         <el-dialog
            width="475px"
            title="巡检任务详情"
            :visible.sync="pollingVisible"
            id="polling"
            >
                <div class="content">
                 <div>
                    <div class="title">巡检记录</div>
                    <div class="descript">
                        <div class="title1">检查情况</div>
                        <div class="textarea">
                           {{pollingDetail.content}}
                        </div>
                    </div>
                    <div class="checkImage">
                        <div class="title1">
                            巡查照片
                        </div>
                        <div class="imageList">
                            <img  class="img" v-for="(items, index) in pollingDetail.checkImages" :key="index" :src="items" alt="">
                        </div>
                    </div>
                </div>
                <div class="sign_head">
                    签名
                </div>
                <div class="sign">
                    <img :src="pollingDetail.watchkeeperImgUrl" alt="">
                </div>
            </div>
        </el-dialog>
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

     },
     editData(id){
         this.$post('/api/admin/device/inspection/single',{
             id
         }).then( res =>{
             this.pollingVisible =true
             this.pollingDetail = res.data
         })
     },
     getTypeList(id){
         this.$post('/api/admin/device/inspection/check/types',{
         }).then( res =>{
             this.typeList1 =res.data
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
                    // this.tableData&&this.tableData.map( item =>{
                    //     item.lastLoginTime = item.lastLoginTime&&item.lastLoginTime.slice(0,10)
                    // })
                    this.total = res.data.data.startPage.total
                    this.checkList = res.data.data.deviceTypeList
            }else{
                this.$alert(res.data.msg)
            }
        })
    },
    getpeople(){
        this.axios({
            url:"/api/admin/user/fire/inspection/list",
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
        this.getpeople()
        this.getTypeList()
    },
},
    mounted() {
        this.userType = sessionStorage.getItem('userTypes')
        this.unitId = Number(sessionStorage.getItem('unitId'))
        if(  this.userType==3 ){
            this.getDatas()
            this.getpeople()
            this.getTypeList()
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
        #polling{
            ul{
                padding-inline-start: 0px;
            }
            .top{
                width: 110%;
            }
            .content{
                background-color: #FBFBFB;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                padding-top: 10px;
                overflow: hidden;
            }
            .content1{
                background-color: #FFF;
            }
            .select{
                height: 50px;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 15px;
                .left {
                    width: 132px;
                    height: 40px;
                    line-height: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal;
                    border-bottom: 1px solid #EDE9E5;
                }
                .right{
                    border-bottom: 1px solid #EDE9E5;
                    height: 40px;
                    line-height: 40px;
                    width: 160px;
                    text-align: right;
                }

            }
            .taskName{
                display: flex;
                justify-content: space-between;
                align-items: center;
                // border-top: 1px solid #F5F3F1;
                border-bottom: 1px solid #F5F3F1;
                height: 50px;
                background-color: #FFF;
                padding: 0 15px;
                 .line{
                    height: 12px;
                    width: 4px;
                    background-color: #1B9BDF;
                    margin-right: 10px;
                    border-radius: 2px;
                }
                .flex{
                    display: flex;
                    align-items: center;
                }
            }
            .title{
                font-size: 12px;
                background-color: #FBFBFB;
                height: 20px;
                color: #8E9497;
                line-height: 30px;
                padding: 0 15px;
            }
             .title1{
                margin-top: 10px;
            }
            .descript{
                padding: 0 15px;
                margin: 10px 0;
                background-color: #FFF;
                .textarea{
                    min-height:136px;
                    width: 100%;
                    padding: 2%;
                    background: #F5F5F5;
                    border-radius: 4px;
                    margin-top: 10px;
                }
            }
            .checkImage{
                padding: 0 15px;
                font-size: 15px;
                color: #5A4B41;
                display: flex;
                flex-direction: column;
                background-color: #FFF;
                .imageList{
                    margin: 10px 0 13px;
                    .img{
                        width: 78px;
                        height: 78px;
                        margin-right: 18px;

                    }
                }
            }
            .heads{
                height:  44px;
                display: flex;
                align-items: center;
                font-size: 15px;
                font-weight:600;
                background-color: #FBFBFB;
                width: 100%;
                .line{
                    height: 12px;
                    width: 4px;
                    background-color: #1B9BDF;
                    margin-right: 10px;
                    border-radius: 2px;
                }
            }
            .head{
                background-color: #FFF;
               border-bottom: 1px solid #EDE9E5;
            }
            .device{
                padding: 0 30rpx;
                width: 100%;
                height: 40px;
                line-height: 40px;
                background-color: #F5F5F5;
                margin-top: 10px;
                 width: calc(100% - 15px) ;
            }
            .sign_head{
                 padding: 0 15px;
                font-size: 15px;
                margin-bottom: 10px;
            }
            .sign{
                width: calc(100% - 30px) ;
                height: 75px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px dashed rgba(142,148,151,0.5);
                margin-left: 15px;
                margin-bottom: 10px;
                img{
                    transform: rotate(-90deg);
                    width: 70px;
                    height: 400px;
                }
            }
        }
    }
</style>