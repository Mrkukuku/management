<template>
<!-- 巡检任务 -->
    <div id='fire_watch' class='allcontent'>
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
                  &nbsp;部门/部位：<el-input v-model="department"></el-input>&nbsp;
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
                prop="checkDepartment"
                label="被检查部门或部位"
                width="280">
                </el-table-column>
                <el-table-column
                prop="checkPerson"
                label="参加检查人员"
                width="320">
                </el-table-column>
                <el-table-column
                prop="maintenanceType"
                label="维保方式"
                width="180">
                 <template slot-scope="scope">
                    <span >{{ scope.row.maintenanceType==1&&'自我维保'||'第三方维保' }}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="提交时间"
                width="220">
                  <template slot-scope="scope">
                    <span >{{ scope.row.date }}</span>
                </template>
                </el-table-column>
                 <el-table-column label="详情">
                    <template slot-scope='scope'>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="editData(scope.row)">查看</el-button>
                        <el-button
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
            :visible.sync="pollingVisible1"
            id="pollings"
            >
                <div class="checkImage" v-if="maintenance.maintenanceImgUrl">
                <div class="title1">
                    维保照片
                </div>
                <div class="imageList">
                    <el-image 
                        style="width: 100px; height: 100px"
                        v-for="(items, index) in maintenance.maintenanceImgUrl" :key="index"
                        :src="items"
                        class="img"
                        :preview-src-list="maintenance.maintenanceImgUrl">
                    </el-image>
                </div>
            </div>
         </el-dialog>
         <el-dialog
            width="475px"
            title="巡检任务详情"
            :visible.sync="pollingVisible"
            id="polling"
            >
                <div class="content">
                     <div class="taskName">
                        <div>被检查部门或部位</div>
                        <div>{{pollingDetail.department}}</div>
                    </div>
                     <div class="taskName">
                        <div>检查时间</div>
                        <div>{{pollingDetail.endTimeValue|timeFormat}}</div>
                    </div>
                     <div class="taskName">
                        <div>参加检查人员</div>
                        <div>
                            <span v-for="(item, index) in pollingDetail.checkPeople" :key="index">{{item}}、</span>
                        </div>
                    </div>
                    <template v-for="(item, index) in pollingDetail.list" v-if="item.status==1">
                        <div class="taskName">
                            <div class="flex">
                                 <div class="line"></div>
                                <template v-if="item.type==0">火灾隐患整改及防范措施落实情况</template>
                                <template v-if="item.type==1">安全疏散通道疏散标志、应急照明和安全出口情况</template>
                                <template v-if="item.type==2">消防车道、消防水源情况</template>
                                <template v-if="item.type==3">用火、用电有无违章情况</template>
                                <template v-if="item.type==4">灭火器配置及有效情况</template>
                                <template v-if="item.type==5">抽查重点工种人员以及其他员工消防知识掌握情况</template>
                                <template v-if="item.type==6">消防安全重点部位管理情况</template>
                                <template v-if="item.type==7">危险品和场所防火防爆落实情况以及重要物资防火安全情况</template>
                                <template v-if="item.type==8">消控室值班和设施运行、记录情况（抽查系统）</template>
                                <template v-if="item.type==9">防火巡查情况（查记录表、电脑等）</template>
                                <template v-if="item.type==10">消防安全标志的设置情况和完好、有效情况</template>
                                <template v-if="item.type==11">其他情况</template>
                            </div>
                        </div>
                        <div class="taskName">
                            <div>是否存在违章情况</div>
                            <div>
                                <el-radio-group v-model="item.status1">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="2">否</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div v-if="item.status1==1">
                            <div class="title">巡检记录</div>
                            <div class="descript">
                                <div class="title1">检查情况</div>
                                <div class="textarea">
                                    {{item.content}}
                                </div>
                            </div>
                            <div class="checkImage" v-if="item.checkImg.length">
                                <div class="title1">
                                    巡查照片
                                </div>
                                <div class="imageList">
                                    <img  class="img" v-for="(items, index) in item.checkImg" :key="index" :src="items" alt="">
                                </div>
                            </div>
                        </div>
                    </template>
                 <div class="descript">
                    <div class="flex">
                        <div class="line"></div> 处理情况
                    </div>
                    <div class="textarea">
                        {{pollingDetail.content}}
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
            department:'',
            pollingVisible:false,
            pollingVisible1:false,
            pollingDetail:{},
            maintenance:{},
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
                    let curDate = new Date(beginDateVal).getTime()
                    // let one = 365 * 24 * 3600 * 1000
                    // let oneYear = curDate + one
                    if (beginDateVal) {
                        return (
                            (time.getTime() < curDate )|| (time.getTime() > Date.now())
                        )
                    }
                        return time.getTime() > Date.now()
                },
            },
       }
   },
 methods:{
     editData(data){
         this.axios({
            url:"/api/admin/month/inspection/single",
            method:"post",
            data:{
                id:data.id,
                type:data.maintenanceType
            }
        }).then( res =>{
            if( res.data.code ==0 ){
                if(data.maintenanceType==1){
                    this.pollingDetail = res.data.data
                    this.pollingVisible = true
                }else{
                    this.maintenance = res.data.data
                    this.pollingVisible1 = true
                }
            }else{
                this.$alert(res.data.msg)
            }
        })
     },
    exportPolling(){
        this.axios({
            url:"/api/admin/month/inspection/info/excel",
            method:"post",
            data:{
                startTime:this.startTime,
                endTime:this.endTime,
                unitId:this.unitId,
                type:1
            }
        }).then( res =>{
            if( res.data.code ==0 ){
                if( res.data.data){
                    location.href=res.data.data
                }
            }
            if(res.data.msg){

                this.$alert(res.data.msg)
            }
            
        })
    },
    seach(){
        this.currentPage = 1
        this.getDatas()
    },
    getDatas () {
        this.axios({
            url:"/api/admin/month/inspection/list",
            method:"post",
            data:{
                startTime:this.startTime,
                endTime:this.endTime,
                unitId:this.unitId,
                pageSize:this.rows,
                pageNum:this.currentPage,
                uname:this.department,
            }
        }).then( res =>{
            if( res.data.code ==0 ){
                    this.tableData = res.data.data.list
                    this.total = res.data.data.total
            }else{
                this.$alert(res.data.msg)
            }
        })
    },
    getData(){
         
    },
    handleReset () {//重置
        this.startTime = ''
        this.endTime = ''
        this.department = ''
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
            this.getDatas()
        }
    },
}
</script>

<style lang="scss">
      
    #fire_watch{
         .el-table{
            border-bottom: 1px solid #EBEEF5;
        }
        .el-table:before{
            width:0;
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
         #pollings,#polling{
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