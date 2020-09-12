<template>
<!-- 巡检任务 -->
    <div id='everyday_record' class='allcontent'>
        <el-row style='height:100%'>
            <el-col :span="4" class="tree_box" v-if="userType==1">
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
          <el-col :span="userType!=1&&24||20" style='height:100%'>
            <div class="top">
                <div>
                &nbsp;单位名称：<el-input v-model="username"></el-input>&nbsp;
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
                 &nbsp;日检达标 <el-select v-model="type" placeholder="请选择">
                    <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
                 &nbsp;消控值班达标 <el-select v-model="type1" placeholder="请选择">
                    <el-option
                    v-for="item in typeList1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
                 &nbsp;远程监控 <el-select v-model="type2" placeholder="请选择">
                    <el-option
                    v-for="item in typeList2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
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
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="unitName"
                label="单位名称"
                width="300">
                </el-table-column>
                <el-table-column
                prop="fireControlRoomWatchTotal"
                label="消控值班记录"
                width="120">
                <template slot-scope="scope">
                    <span >{{ scope.row.fireControlRoomWatchTotal }}</span>
                </template>
                </el-table-column>
                <el-table-column
                prop="unFireControlRoomWatchTotal"
                label="未提交天数"
                width="120">
                </el-table-column>
                <el-table-column
                prop="handoverTotal"
                label="交接班"
                width="120">
                </el-table-column>
                <el-table-column
                prop="realityFireInspectionTotal"
                label="巡检次数"
                width="120">
                </el-table-column>
                <el-table-column
                prop="planFireInspectionTotal"
                label="应巡检次数"
                width="120">
                </el-table-column>
                <el-table-column
                prop="unFireInspectionTotal"
                label="未达标（天）"
                width="120">
                </el-table-column>
                <el-table-column
                prop="lastLoginTime"
                label="最后一次在线"
                width="140">
                </el-table-column>
                <el-table-column label="未达标情况">
                    <template slot-scope='scope'>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="editData(scope.row.unitId,scope.row.unitName)">查看</el-button>
                        <el-button
                        size="mini"
                        type="primary"
                         @click="summary(scope.row)"
                        >汇总</el-button>
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
        title="详情"
        :visible.sync="dialogVisible"
        width="35%"
        :before-close="closeDialog"
       >
        <div>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="head">{{unitName}}每日工作</span>
                </div>
                <div>
                   
                        <el-tag v-for="(item, index) in noDetail" 
                        :key="item.date"
                        :type="item.type==2&&'warning'||item.type==3&&'danger'||''"
                        @click="dateClick(item)"
                        class="tags">
                        {{item.date}}
                        
                        </el-tag>
                    </el-tooltip>
                </div>
                <div>黄色为一项工作未完成、红色为两项工作未完成，蓝色为巡检，消控都完成</div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="head">消控值班</span>
                </div>
                <div>
                <div class="title">
                    {{taskDate}} 
                    <!-- <el-badge class="mark" type="primary" :value="fireControlRoomWatchList.length"/> -->
                </div>
                <el-tag v-for="(item, index) in fireControlRoomWatchList" @click="dutyClick(item)" :key="item.adminClockInId"  class="tags">
                    {{item.startTime}} - {{item.endTime}}
                </el-tag>
                </div>
            </el-card>
             <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="head">日常巡检</span>
                </div>
                <div class="content">
                    <div class="title">
                        {{taskDate}} 
                        <!-- <el-badge class="mark" type="primary" :value="fireInspectionList.length"/> -->
                    </div>
                    <div>
                        <el-tag v-for="(item, index) in fireInspectionList" 
                        @click="pollingClick(item)" 
                        :type="item.status==0&&'warning'||''"
                        :key="index" 
                        class="tags">
                        {{item.startTime}} - {{item.endTime}}
                        </el-tag>
                    </div>
                </div>
            </el-card>

        </div>
        <el-dialog
            width="475px"
            title="巡查任务详情"
            :visible.sync="pollingVisible"
            id="polling"
            append-to-body>
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
        <el-dialog
            width="475px"
            title="消控值班详情"
            :visible.sync="dutyVisible"
            id="duty"
            append-to-body>
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
            total:100,
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
                    name:"达标"
                },
                {
                    id:0,
                    name:'未达标'
                }
            ],
            type2:'',//远程监控
            typeList2:[
                {
                    id:1,
                    name:"安装"
                },
                {
                    id:0,
                    name:'未安装'
                }
            ],
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
     summary(data){//汇总
         var _this = this
         this.$router.push({path:'/unitmanagement/PollingSummary',query:{
            startTime:_this.startTime,
            endTime:_this.endTime,
            unitId:data.unitId,
         }})
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
     pollingClick(data){//巡检记录
         if( data.status==1 ){
            this.axios({
                url:"/api/admin/fire/control/statistics/unit/date/inspection/single",
                method:"post",
                data:{
                    "startTime": data._startTime,
                    "endTime": data._endTime,
                    "unitId": data.unitId,
                    pageSize:this.rows,
                    pageNum:this.currentPage,
                }
            }).then( res =>{
                if( res.data.code ==0 ){
                    this.pollingVisible = true
                    res.data.data.closedFireDoorStatusDesc = JSON.parse(res.data.data.closedFireDoorStatusDesc)
                    res.data.data.evacuationPassagewayDesc = JSON.parse(res.data.data.evacuationPassagewayDesc)
                    res.data.data.exportsFlowingDesc = JSON.parse(res.data.data.exportsFlowingDesc)
                    res.data.data.fireEquipmentDesc = JSON.parse(res.data.data.fireEquipmentDesc)
                    res.data.data.fireViolationDesc = JSON.parse(res.data.data.fireViolationDesc)
                    res.data.data.importantPersonJobDesc = JSON.parse(res.data.data.importantPersonJobDesc)
                    res.data.data.customPatrolTask = JSON.parse(res.data.data.customPatrolTask)
                    this.pollingDetail = res.data.data
                }else{
                    this.$alert(res.data.msg)
                }
            })
         }
     },
    dateClick(data){//每日工作
        this.axios({
            url:"/api/admin/fire/control/statistics/unit/date/single",
            method:"post",
            data:{
               id:data.id
            }
        }).then( res =>{
            if( res.data.code ==0 ){
                this.taskDate =data.date
                this.fireInspectionList = res.data.data.fireInspectionList
                this.fireControlRoomWatchList = res.data.data.fireControlRoomWatchList

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
        this.axios({
            url:"/api/admin/fire/control/statistics/list",
            method:"post",
            data:{
                unitName:this.username,
                startTime:this.startTime,
                endTime:this.endTime,
                unitId:this.unitId,
                pageSize:this.rows,
                pageNum:this.currentPage,
                fireInspectionStatus:this.type,
                fireControlRoomWatchStatus:this.type1,
                installStatus:this.type2,
            }
        }).then( res =>{
            if( res.data.code ==0 ){
                if( res.data.data){
                    this.tableData = res.data.data.list
                    this.tableData&&this.tableData.map( item =>{
                        item.lastLoginTime = item.lastLoginTime&&item.lastLoginTime.slice(0,10)
                    })
                    this.total = res.data.data.total
                }else{
                     this.tableData =[]
                }
            }else{
                this.$alert(res.data.msg)
            }
        })
    },
     getData(){

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
        this.type2 = ''
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
        if(  this.userType!=1 ){
            this.getDatas()
        }
    },
}
</script>

<style lang="scss">
        #polling,#duty{
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
    #everyday_record{
       
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