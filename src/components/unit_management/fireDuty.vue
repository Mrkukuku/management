<template>
<!-- 巡检任务 -->
    <div id='fire_duty' class='allcontent'>
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
                 &nbsp;值班人 <el-select v-model="type" placeholder="请选择">
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
                时间筛选：<el-date-picker
                v-model="startTime"
                type="date"
                placeholder="开始日期"
                :picker-options="expireTimeOptionStart"
                value-format="yyyy-MM-dd"
                class="picker">
                </el-date-picker> -
                <el-date-picker
                v-model="endTime"
                type="date"
                :picker-options="expireTimeOptionEnd"
                value-format="yyyy-MM-dd"
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
                </el-table-column>
                <el-table-column
                prop="unitName"
                label="记录时间"
                width="140">
                </el-table-column>
                <el-table-column
                prop="fireControlRoomWatchTotal"
                label="火灾报警控制器运行情况"
                width="210">
                <template slot-scope="scope">
                    <span >{{ scope.row.fireControlRoomWatchTotal }}</span>
                </template>
                </el-table-column>
                <el-table-column
                prop="a"
                label="火灾报警控制器检查内容"
                width="210">
                </el-table-column>
                <el-table-column
                prop="a"
                label="控制室内其他消防系统运行情况"
                width="220">
                </el-table-column>
                <el-table-column
                prop="realityFireInspectionTotal"
                label="值班人"
                width="120">
                </el-table-column>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope='scope'>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="editData(scope.row.unitId,scope.row.unitName)">查看</el-button>
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
            title="消控值班详情"
            :visible.sync="dutyVisible"
            id="duty"
            >
                   <div class="content content1">

                        <div class="heads head">
                            <div class="line"></div>火灾报警控制器运行情况
                        </div>
                         <div class="taskName">
                            <div>是否有报警</div>
                            <div>
                               <el-radio-group v-model="dutyDetail.fireAlarmStatus">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="2">否</el-radio>
                                </el-radio-group>
                            </div>
                         </div>
                         
                         <div v-for="(item, index) in dutyDetail.fireAlarmDesc" :key="index" v-if="dutyDetail.fireAlarmStatus==1">
                              <div class="title1" style="margin-left:10px">报警类型和报警时间</div>
                              <div class="select">
                                  <div class="left">{{item.deviceName}}</div>
                                  <div class="right">{{item.alarmTime}}-{{item.alarmTime1}}</div>
                              </div>
                              <div class="title1" style="margin-left:10px">报警、故障部位</div>
                              <div class="device" style="margin-left:10px"> {{item.part}}</div>
                              <div class="descript">
                                <div class="title1">处理情况</div>
                                <div class="textarea">
                                  {{item.describe}}
                                </div>
                            </div>
                         </div>

                         <div class="heads head">
                            <div class="line"></div>火灾报警控制器检查内容
                         </div>
                         <div class="taskName">
                            <div>自检</div>
                            <div>
                                 <el-radio-group v-model="dutyDetail.selfInspectionStatus">
                                    <el-radio :label="1">正常</el-radio>
                                    <el-radio :label="2">异常</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="descript" v-if="dutyDetail.selfInspectionStatus==2">
                            <div class="title1">处理情况</div>
                            <div class="textarea">
                                {{detail.selfInspectionDesc&&etail.selfInspectionDesc||'无'}}
                            </div>
                        </div>
                         <div class="taskName">
                            <div>消音</div>
                            <div>
                                 <el-radio-group v-model="dutyDetail.muteStatus">
                                    <el-radio :label="1">正常</el-radio>
                                    <el-radio :label="2">异常</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="descript" v-if="dutyDetail.muteStatus==2">
                            <div class="title1">处理情况</div>
                            <div class="textarea">
                                {{detail.muteDesc&&detail.muteDesc||'无'}}
                            </div>
                        </div>
                         <div class="taskName">
                            <div>复位</div>
                            <div>
                                 <el-radio-group v-model="dutyDetail.resetStatus">
                                    <el-radio :label="1">正常</el-radio>
                                    <el-radio :label="2">异常</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="descript" v-if="dutyDetail.resetStatus==2">
                            <div class="title1">处理情况</div>
                            <div class="textarea">
                                {{dutyDetail.resetDesc&&dutyDetail.resetDesc||'无'}}
                            </div>
                        </div>
                         <div class="taskName">
                            <div>主电</div>
                            <div>
                                 <el-radio-group v-model="dutyDetail.mainElectricStatus">
                                    <el-radio :label="1">正常</el-radio>
                                    <el-radio :label="2">异常</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="descript" v-if="dutyDetail.mainElectricStatus==2">
                            <div class="title1">处理情况</div>
                            <div class="textarea">
                                {{dutyDetail.mainElectricDesc&&dutyDetail.mainElectricDesc||'无'}}
                            </div>
                        </div>
                         <div class="taskName">
                            <div>备电</div>
                            <div>
                                 <el-radio-group v-model="dutyDetail.forElectricityStatus">
                                    <el-radio :label="1">正常</el-radio>
                                    <el-radio :label="2">异常</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="descript" v-if="dutyDetail.forElectricityStatus==2">
                            <div class="title1">处理情况</div>
                            <div class="textarea">
                                {{dutyDetail.forElectricityDesc&&dutyDetail.forElectricityDesc||'无'}}
                            </div>
                        </div>

                         <div class="heads head">
                            <div class="line"></div>控制室内其他消防系统运行
                         </div>
                         <div class="taskName">
                            <div>是否有报警</div>
                            <div>
                               <el-radio-group v-model="dutyDetail.otherAlarmStatus">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="2">否</el-radio>
                                </el-radio-group>
                            </div>
                         </div>
                         
                         <div v-for="(item, index) in dutyDetail.otherAlarmDesc" :key="index" v-if="dutyDetail.otherAlarmStatus==1">
                              <div class="title1" style="margin-left:10px">设备名称</div>
                              <div class="device" style="margin-left:10px">{{item.deviceName}} </div>
                              <div class="taskName">
                                <div>控制状态</div>
                                <div>
                                     <el-radio-group v-model="item.status">
                                         <el-radio  :label="0">自动</el-radio>
                                        <el-radio  :label="1">手动</el-radio>
                                     </el-radio-group>
                                </div>
                             </div>
                             <div class="descript">
                                <div class="title1">报警、故障部位、原因及处理情况：</div>
                                <div class="textarea">
                                   {{item.describe}}
                                </div>
                            </div>
                         </div>

                         <div class="sign_head">
                            签名
                        </div>
                        <div class="sign">
                            <img :src="dutyDetail.watchkeeperImgUrl" alt="">
                        </div>
                        <div>
                            <el-timeline >
                                <el-timeline-item
                                :timestamp="dutyDetail.handTime">
                               {{dutyDetail.uname}} 交接给 {{dutyDetail.handName}}
                                </el-timeline-item>
                            </el-timeline>
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
            username:"",//单位名称
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
            ],
            type1:'',//消控值班
            typeList1:[
                  {
                    id:1,
                    name:"火灾报警控制器运行情况"
                },
                {
                    id:2,
                    name:'火灾报警控制器检查内容'
                },
                {
                    id:3,
                    name:'控制室内其他消防系统运行情况'
                },
            ],
            type2:'',//远程监控
            dialogVisible:false,//详情开关
            pollingVisible:false,//巡查任务详情开关
            dutyVisible:false,//巡查任务详情开关
            noDetail:{},
            unitName:'',
            taskDate:'',
            fireInspectionList:[],
            fireControlRoomWatchList:[],
            pollingDetail:{},
            dutyDetail:{}
       }
   },
 methods:{
     exportPolling(){
            this.axios({
                url:"/api/admin/fire/control/statistics/info/export",
                method:"post",
                data:{
                    unitName:this.username,
                    startTime:this.startTime,
                    endTime:this.endTime,
                    unitId:this.unitId,
                    pageSize:this.total,
                    pageNum:this.currentPage,
                    fireInspectionStatus:this.type,
                    fireControlRoomWatchStatus:this.type1,
                    installStatus:this.type2,
                }
            }).then( res =>{
                if( res.data.code ==0 ){
                    if( res.data.data){
                        location.href=res.data.data
                    }
                }else{
                    this.$alert(res.data.msg)
                }
            })
     },
     closeDialog(){
        this.dialogVisible = false
        this.fireInspectionList=[]
        this.fireControlRoomWatchList=[]
        this.taskDate=''
     },
     dutyClick(data){//值班记录
        this.axios({
            url:"/api/admin/watch/records/single",
            method:"post",
            data:{
                id:data.adminClockInId,
            }
        }).then( res =>{
            if( res.data.code ==0 ){
                this.dutyVisible = true
                this.dutyDetail = res.data.data
                this.dutyDetail.fireAlarmDesc = JSON.parse(this.dutyDetail.fireAlarmDesc)
                this.dutyDetail.otherAlarmDesc = JSON.parse(this.dutyDetail.otherAlarmDesc)
            }else{
                this.$alert(res.data.msg)
            }
        })
     },
 
    seach(){
        this.currentPage = 1
        this.getDatas()
    },
    getDatas () {
        // this.axios({
        //     url:"/api/admin/fire/control/statistics/list",
        //     method:"post",
        //     data:{
        //         unitName:this.username,
        //         startTime:this.startTime,
        //         endTime:this.endTime,
        //         unitId:this.unitId,
        //         pageSize:this.rows,
        //         pageNum:this.currentPage,
        //         fireInspectionStatus:this.type,
        //         fireControlRoomWatchStatus:this.type1,
        //         installStatus:this.type2,
        //     }
        // }).then( res =>{
        //     if( res.data.code ==0 ){
        //         if( res.data.data){
        //             this.tableData = res.data.data.list
        //             this.tableData&&this.tableData.map( item =>{
        //                 item.lastLoginTime = item.lastLoginTime&&item.lastLoginTime.slice(0,10)
        //             })
        //             this.total = res.data.data.total
        //         }else{
        //              this.tableData =[]
        //         }
        //     }else{
        //         this.$alert(res.data.msg)
        //     }
        // })
    },
     getData(){

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
    editData (id,name) {
        this.dialogVisible = true
        this.unitName = name
         this.axios({
            url:"/api/admin/fire/control/statistics/unit/single",
            method:"post",
            data:{
                startTime:this.startTime,
                endTime:this.endTime,
                unitId:id,
                pageSize:10,
                pageNum:1,
            }
        }).then( res =>{
            if( res.data.code ==0 ){
            this.noDetail= res.data.data
            }else{
                this.$alert(res.data.msg)
            }
        })
    },
    handleReset () {//重置
        //   Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
        this.username = ''
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
        this.getpeople()
        this.handleReset()
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
    #duty{
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
                    display: inline-block;
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
                    img{
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
                background-color: #F5F5F5;
                margin-top: 10px;
                 width: calc(100% - 15px) ;
                 line-height: 40px;
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
    #fire_duty{
       
        .el-table:before{
            width:0;
        }
         .el-table{
            border-bottom: 1px solid #EBEEF5;
        }
        .box-card{
            margin-bottom: 20px;
            .head{
                font-size: 19px;
            }
            .content{
                 margin-bottom: 10px;
            }
            .title{
                margin-bottom: 10px;
                font-size: 18px;
            }
            .tags{
                margin-right: 10px;
                margin-bottom: 10px;
                cursor: pointer;
            }
        }

        .el-input{
            width:128px;
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
    }
</style>