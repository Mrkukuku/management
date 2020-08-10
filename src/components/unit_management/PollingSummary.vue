<template>
    <!-- 公告管理 -->
    <div id="pollingSummary" class='allcontent'>
      
         <!-- 头部 -->
            <div class="top">
               
                <div class="date">
                    <!-- 每日防火巡查记录 -->
                     <el-page-header @back="goBack" content="每日防火巡查记录">
                </el-page-header>
                </div>
                <div>巡查日期：{{date}}</div>
            </div>
            <!-- 内容 -->
            <div style='margin-top:10px;height: 88%;position: relative;'>
                <!-- 表格 -->
                <el-table					
                    :data="tableData"
                    border
                   >
                    <el-table-column
                    label="时间"
                     align="center"
                    width="140">
                    <template slot-scope="scope">
                        <span >{{ scope.row.updatedTime }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                     label="用火用电"
                     align="center"
                     >
                          <el-table-column
                            prop="time"
                            label="正常"
                            align="center"
                            width="70">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="异常"
                             align="center"
                            width="70">
                                  <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                    align="center"
                     label="安全出口、疏散通道">
                          <el-table-column
                            prop="time"
                            label="畅通"
                             align="center"
                            width="70">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.exportsFlowing==1&&scope.row.exportsFlowingDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="违章"
                             align="center"
                            width="70">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.exportsFlowing==1&&scope.row.exportsFlowingDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                    align="center"
                     label="疏散指示标志、应急照明">
                          <el-table-column
                            prop="time"
                            label="正常"
                             align="center"
                            width="70">
                             <template slot-scope="scope">
                                    <span >{{ scope.row.evacuationPassageway==1&&scope.row.evacuationPassagewayDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="故障"
                             align="center"
                            width="70">
                             <template slot-scope="scope">
                                    <span >{{ scope.row.evacuationPassageway==1&&scope.row.evacuationPassagewayDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                    align="center"
                     label="消防安全标志、消防设施器材">
                          <el-table-column
                            prop="time"
                            label="正常"
                             align="center"
                            width="70">
                             <template slot-scope="scope">
                                    <span >{{ scope.row.fireEquipment==1&&scope.row.fireEquipmentDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="故障"
                             align="center"
                            width="70">
                             <template slot-scope="scope">
                                    <span >{{ scope.row.fireEquipment==1&&scope.row.fireEquipmentDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                    align="center"
                     label="防火门、防火卷帘">
                          <el-table-column
                            prop="time"
                            label="正常"
                             align="center"
                            width="70">
                             <template slot-scope="scope">
                                    <span >{{ scope.row.closedFireDoorStatus==1&&scope.row.closedFireDoorStatusDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="故障"
                             align="center"
                            width="70">
                             <template slot-scope="scope">
                                    <span >{{ scope.row.closedFireDoorStatus==1&&scope.row.closedFireDoorStatusDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                    align="center"
                     label="消防安全重点部位的人员在岗">
                          <el-table-column
                            prop="time"
                            label="在岗"
                             align="center"
                            width="70">
                             <template slot-scope="scope">
                                    <span >{{ scope.row.importantPersonJob==1&&scope.row.importantPersonJobDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                          <el-table-column
                            prop="time"
                            label="脱岗"
                             align="center"
                            width="70">
                             <template slot-scope="scope">
                                    <span >{{ scope.row.importantPersonJob==1&&scope.row.importantPersonJobDesc.status==1&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                    </el-table-column>
                     <el-table-column
                        prop="time"
                        align="center"
                        label="其他消防安全情况"
                        width="140">
                    </el-table-column>
                    <el-table-column label="具体问题及处理情况" align="center">
                        <template slot-scope='scope'>
                             <el-button
                            size="mini"
                            type="primary"
                            @click="editData(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                     <el-table-column
                        prop="uname"
                        align="center"
                        label="巡查人签字"
                        width="140">
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <!-- <div style="position:absolute;bottom:0;">
                    <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
                </div> -->
                <div class="bottom"> 
                    <div class="date">
                         <el-tag v-for="(item, index) in allDate" 
                        :key="index"
                        @click="dateClick(item)"
                        class="tags">
                           {{item}}
                        </el-tag>
                    </div>
                    <div>
                        主管人员（签名）<span class="name">{{auditor&&auditor||'无'}}</span>          
                    </div>
                </div>
            </div>
            <el-dialog
                width="475px"
                title="巡查任务详情"
                :visible.sync="pollingVisible"
                id="polling"
                >
                <div class="content">

                <div v-if="pollingDetail.fireViolation==1">
                    <div class="taskName">
                        <div>
                         <div class="line"></div> 用火用电违章情况
                        </div>
                    </div>
                    <div class="taskName">
                        <div>是否违章</div>
                        <div>
                            <el-radio-group v-model="pollingDetail.fireViolationDesc.status">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="taskName">
                       <div> 巡检时间</div>
                        <div>{{pollingDetail.fireViolationDesc.time&&pollingDetail.fireViolationDesc.time||''}}</div>
                    </div>
                    <div class="taskName">
                       <div> 巡检经纬度</div>
                        <div>
                            {{pollingDetail.fireViolationDesc.longitude&&pollingDetail.fireViolationDesc.longitude||''}},
                            {{pollingDetail.fireViolationDesc.latitude&&pollingDetail.fireViolationDesc.latitude||''}}
                        </div>
                    </div>
                    <div v-if="pollingDetail.fireViolationDesc.status==1">
                        <div class="title">巡检记录</div>
                        <div class="descript">
                            <div class="title1">检查情况</div>
                            <div class="textarea">
                                {{pollingDetail.fireViolationDesc.content}}
                            </div>
                        </div>
                        <div class="checkImage" v-if="pollingDetail.fireViolationDesc.checkImg.length">
                            <div class="title1">
                                巡查照片
                            </div>
                            <div class="imageList">
                                <img  v-for="(item, index) in pollingDetail.fireViolationDesc.checkImg" :key="index" :src="item" alt="">
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="pollingDetail.exportsFlowing==1">
                    <div class="taskName">
                          <div>
                            <div class="line"></div>  安全出口、疏散通道
                        </div>
                    </div>
                    
                    <div class="taskName">
                        <div>出口是否畅通</div>
                        <div>
                            <el-radio-group v-model="pollingDetail.exportsFlowingDesc.status">
                                    <el-radio :label="1">否</el-radio>
                                    <el-radio :label="2">是</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="taskName">
                       <div> 巡检时间</div>
                        <div>{{pollingDetail.exportsFlowingDesc.time&&pollingDetail.exportsFlowingDesc.time||''}}</div>
                    </div>
                    <div class="taskName">
                       <div> 巡检经纬度</div>
                        <div>
                            {{pollingDetail.exportsFlowingDesc.longitude&&pollingDetail.exportsFlowingDesc.longitude||''}},
                            {{pollingDetail.exportsFlowingDesc.latitude&&pollingDetail.exportsFlowingDesc.latitude||''}}
                        </div>
                    </div>
                    <div v-if="pollingDetail.exportsFlowingDesc.status==1">
                        <div class="title">巡检记录</div>
                        <div class="descript">
                            <div class="title1">检查情况</div>
                            <div class="textarea">
                                {{pollingDetail.exportsFlowingDesc.content}}
                            </div>
                        </div>
                        <div class="checkImage" v-if="pollingDetail.exportsFlowingDesc.checkImg.length">
                            <div class="title1">
                                巡查照片
                            </div>
                            <div class="imageList">
                                <img  v-for="(item, index) in pollingDetail.exportsFlowingDesc.checkImg" :key="index" :src="item" alt="">
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="pollingDetail.evacuationPassageway==1">
                    <div class="taskName">
                         <div>
                            <div class="line"></div>  疏散指示标志、应急照明
                        </div>
                       </div>
                    <div class="taskName">
                        <div>是否存在违章情况</div>
                        <div>
                            <el-radio-group v-model="pollingDetail.evacuationPassagewayDesc.status">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                     <div class="taskName">
                       <div> 巡检时间</div>
                        <div>{{pollingDetail.evacuationPassagewayDesc.time&&pollingDetail.evacuationPassagewayDesc.time||''}}</div>
                    </div>
                    <div class="taskName">
                       <div> 巡检经纬度</div>
                        <div>
                            {{pollingDetail.evacuationPassagewayDesc.longitude&&pollingDetail.evacuationPassagewayDesc.longitude||''}},
                            {{pollingDetail.evacuationPassagewayDesc.latitude&&pollingDetail.evacuationPassagewayDesc.latitude||''}}
                        </div>
                    </div>
                    <div v-if="pollingDetail.evacuationPassagewayDesc.status==1">
                        <div class="title">巡检记录</div>
                        <div class="descript">
                            <div class="title1">检查情况</div>
                            <div class="textarea">
                                {{pollingDetail.evacuationPassagewayDesc.content}}
                            </div>
                        </div>
                        <div class="checkImage" v-if="pollingDetail.evacuationPassagewayDesc.checkImg.length">
                            <div class="title1">
                                巡查照片
                            </div>
                            <div class="imageList">
                                <img  v-for="(item, index) in pollingDetail.evacuationPassagewayDesc.checkImg" :key="index" :src="item" alt="">
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="pollingDetail.importantPersonJob==1">
                    <div class="taskName">
                         <div>
                            <div class="line"></div>  重点部位人员在岗情况
                        </div>
                        </div>
                    <div class="taskName">
                        <div>是否按要求在岗</div>
                        <div>
                            <el-radio-group v-model="pollingDetail.importantPersonJobDesc.status">
                                    <el-radio :label="1">否</el-radio>
                                    <el-radio :label="2">是</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                     <div class="taskName">
                       <div> 巡检时间</div>
                        <div>{{pollingDetail.importantPersonJobDesc.time&&pollingDetail.importantPersonJobDesc.time||''}}</div>
                    </div>
                    <div class="taskName">
                       <div> 巡检经纬度</div>
                        <div>
                            {{pollingDetail.importantPersonJobDesc.longitude&&pollingDetail.importantPersonJobDesc.longitude||''}},
                            {{pollingDetail.importantPersonJobDesc.latitude&&pollingDetail.importantPersonJobDesc.latitude||''}}
                        </div>
                    </div>
                    <div v-if="pollingDetail.importantPersonJobDesc.status==1">
                        <div class="title">巡检记录</div>
                        <div class="descript">
                            <div class="title1">检查情况</div>
                            <div class="textarea">
                                {{pollingDetail.importantPersonJobDesc.content}}
                            </div>
                        </div>
                        <div class="checkImage" v-if="pollingDetail.importantPersonJobDesc.checkImg.length">
                            <div class="title1">
                                巡查照片
                            </div>
                            <div class="imageList">
                                <img  v-for="(item, index) in pollingDetail.importantPersonJobDesc.checkImg" :key="index" :src="item" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="pollingDetail.fireEquipment==1">
                    <div class="taskName">
                         <div>
                            <div class="line"></div>  消防安全标志、消防设施器材
                        </div>
                        </div>
                    <div class="taskName">
                        <div>是否完好</div>
                        <div>
                            <el-radio-group v-model="pollingDetail.fireEquipmentDesc.status">
                                    <el-radio :label="1">否</el-radio>
                                    <el-radio :label="2">是</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                     <div class="taskName">
                       <div> 巡检时间</div>
                        <div>{{pollingDetail.fireEquipmentDesc.time&&pollingDetail.fireEquipmentDesc.time||''}}</div>
                    </div>
                    <div class="taskName">
                       <div> 巡检经纬度</div>
                        <div>
                            {{pollingDetail.fireEquipmentDesc.longitude&&pollingDetail.fireEquipmentDesc.longitude||''}},
                            {{pollingDetail.fireEquipmentDesc.latitude&&pollingDetail.fireEquipmentDesc.latitude||''}}
                        </div>
                    </div>
                    <div v-if="pollingDetail.fireEquipmentDesc.status==1">
                        <div class="title">巡检记录</div>
                        <div class="descript">
                            <div class="title1">检查情况</div>
                            <div class="textarea">
                                {{pollingDetail.fireEquipmentDesc.content}}
                            </div>
                        </div>
                        <div class="checkImage" v-if="pollingDetail.fireEquipmentDesc.checkImg.length">
                            <div class="title1">
                                巡查照片
                            </div>
                            <div class="imageList">
                                <img  v-for="(item, index) in pollingDetail.fireEquipmentDesc.checkImg" :key="index" :src="item" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="pollingDetail.closedFireDoorStatus==1">
                    <div class="taskName">
                          <div>
                            <div class="line"></div>  防火门、防火卷帘状态
                        </div>
                        </div>
                    <div class="taskName">
                        <div>是否存在违章情况</div>
                        <div>
                            <el-radio-group v-model="pollingDetail.closedFireDoorStatusDesc.status">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                      <div class="taskName">
                       <div> 巡检时间</div>
                        <div>{{pollingDetail.closedFireDoorStatusDesc.time&&pollingDetail.closedFireDoorStatusDesc.time||''}}</div>
                    </div>
                    <div class="taskName">
                       <div> 巡检经纬度</div>
                        <div>
                            {{pollingDetail.closedFireDoorStatusDesc.longitude&&pollingDetail.closedFireDoorStatusDesc.longitude||''}},
                            {{pollingDetail.closedFireDoorStatusDesc.latitude&&pollingDetail.closedFireDoorStatusDesc.latitude||''}}
                        </div>
                    </div>
                    <div v-if="pollingDetail.closedFireDoorStatusDesc.status==1">
                        <div class="title">巡检记录</div>
                        <div class="descript">
                            <div class="title1">检查情况</div>
                            <div class="textarea">
                                {{pollingDetail.closedFireDoorStatusDesc.content}}
                            </div>
                        </div>
                        <div class="checkImage" v-if="pollingDetail.closedFireDoorStatusDesc.checkImg.length">
                            <div class="title1">
                                巡查照片
                            </div>
                            <div class="imageList">
                                <img  v-for="(item, index) in pollingDetail.closedFireDoorStatusDesc.checkImg" :key="index" :src="item" alt="">
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background-color: #FFF;" v-for="(item, index) in pollingDetail.customPatrolTask" :key="index">
                    <div class="heads">
                        <div class="line"></div>自定义巡查任务
                    </div>
                    <div>
                        <div class="title1" style="margin-left:10px">设备名称</div>
                        <div class="device" style="margin-left:10px">{{item.deviceName}}</div>
                        <div class="taskName">
                            <div>是否存在异常</div>
                            <div>
                                <el-radio-group v-model="item.status">
                                        <el-radio :label="1">是</el-radio>
                                        <el-radio :label="2">否</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                         <div class="taskName">
                       <div> 巡检时间</div>
                        <div>{{item.time&&item.time||''}}</div>
                    </div>
                    <div class="taskName">
                       <div> 巡检经纬度</div>
                        <div>
                            {{item.longitude&&item.longitude||''}},
                            {{item.latitude&&item.latitude||''}}
                        </div>
                    </div>
                        <div v-if="item.status==1">
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
                                    <img v-for="(item1, index) in item.checkImg" :key="index" :src="item1" alt="">
                                </div>
                            </div>
                             </div>  
                        </div>  

                </div>
                <div class="sign_head">
                    签名
                </div>
                <div class="sign">
                    <img :src="pollingDetail.watchkeeperImgUrl" alt="">
                </div>
                <div style="margin-left:15px">巡检人员:{{pollingDetail.uname}}</div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
// import pagination from '../Children/Pagination'
export default {
    components:{
        // pagination:pagination
    },
    data(){
       
        return {
            pageNum:1,
            pageSize:10,
            total:0,
            tableData:[
             
            ],
            parameter:{},
            allDate:[],
            pollingVisible:false,
            pollingDetail:{},
            date:'',
            auditor:""
        }
    },
    methods:{
        editData(data){
            this.pollingVisible =true
            this.pollingDetail = data
        },
        getData(){
                this.axios({
                url:"/api/admin/fire/control/statistics/unit/single/summary/date",
                method:"post",
                data:{
                    ...this.parameter,
                    pageSize:10,
                    pageNum:1,
                }
            }).then( res =>{
                if( res.data.code ==0 ){
                     this.allDate= res.data.data.dates
                     if( this.allDate[0]){
                         this.dateClick(this.allDate[0])
                     }
                }else{
                    this.$alert(res.data.msg)
                }
            })
        },
        dateClick(date){
             this.axios({
                url:"/api/admin/fire/control/statistics/unit/single/summary",
                method:"post",
                data:{
                    ...this.parameter,
                    pageSize:10,
                    pageNum:1,
                    date
                }
            }).then( res =>{
                if( res.data.code ==0 ){
                    this.tableData = res.data.data.data
                    this.auditor = res.data.data.auditor
                    this.tableData.map( item =>{
                        item.updatedTime =item.updatedTime && item.updatedTime.slice(11)
                        item.closedFireDoorStatusDesc = JSON.parse(item.closedFireDoorStatusDesc)
                        item.evacuationPassagewayDesc = JSON.parse(item.evacuationPassagewayDesc)
                        item.exportsFlowingDesc = JSON.parse(item.exportsFlowingDesc)
                        item.fireEquipmentDesc = JSON.parse(item.fireEquipmentDesc)
                        item.fireViolationDesc = JSON.parse(item.fireViolationDesc)
                        item.importantPersonJobDesc = JSON.parse(item.importantPersonJobDesc)
                        item.customPatrolTask = JSON.parse(item.customPatrolTask)
                    })
                    this.date = date
                }else{
                    this.$alert(res.data.msg)
                }
            })
        },
        goBack(){
            this.$router.push({path: '/unitmanagement/everydayRecord'});
            this.$store.commit('routeJump/delete_tabs', '/unitmanagement/PollingSummary');
        }
    },
    mounted(){
      if(this.$route.query.unitId){
          this.parameter = this.$route.query
          this.getData()
      }else{
        //    this.$router.push({path: '/unitmanagement/everydayRecord'});
        //    this.$store.commit('routeJump/delete_tabs', '/unitmanagement/PollingSummary');
        this.goBack()
      }
    },
   
}
</script>

<style lang="scss">
    #pollingSummary{
     .top{
         display: flex;
         align-items: center;
         border: none;
         .date{
             flex: 1;
            //  text-align: center;
            //  font-size: 29px;
         }
         
        .el-page-header__content{
            flex: 1;
             text-align: center;
             font-size: 29px;
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
     .bottom{
         display: flex;
         height: 15%;
         align-items: center;
         .date{
            flex: 1;
            overflow: auto;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
         }
         .tags{
             margin-right: 5px;
             margin-bottom: 5px;
         }
     }
     .name{
        text-decoration:underline;
        width: 40px;
     }
     .el-table thead.is-group th{
         background-color: #FFF;
     }
    }

</style>