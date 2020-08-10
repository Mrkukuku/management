<template>
<!-- 巡检任务 -->
    <div id='polling_task' class='allcontent'>
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
            <div>
                <el-button type="success"  v-if='addFalg && userType !=3' @click="opendialog(1)"><i class="el-icon-plus"></i> 新增巡查任务</el-button>
                <el-button type="primary" @click="opendialog(0)" v-else ><i class="el-icon-plus"></i> 新增巡检任务</el-button>
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
                prop="name"
                label="任务名称"
                width="250">
                </el-table-column>
                <el-table-column
                prop="uname"
                label="任务人员"
                width="200">
                </el-table-column>
                <el-table-column
                prop="time"
                label="任务起始时间"
                width="300">
                </el-table-column>
                <el-table-column
                prop="status"
                label="任务完成情况"
                width="150">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope='scope'>
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
                    </template>
                </el-table-column>
               
            </el-table>
            <!-- 分页 -->
            <div style="position:absolute;bottom:0;" class="page">
                <pagination :total='total' @pageChange="pageChange"></pagination>
            </div>
        </div>

        <!-- 设备新增弹框 -->
        <el-dialog
            title="添加修改巡检任务"
            :visible.sync="dialogVisible"
            width="32%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog">
                <el-form :model="ruleForm"  ref="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="巡检任务名称" prop="name" >
                        <el-input v-model="ruleForm.name" placeholder="请输入巡检任务名称" ></el-input>
                    </el-form-item>

                    <el-form-item label="巡检人员" prop="uid" placeholder="请选择巡检人员">
                        <el-select v-model="ruleForm.uid" filterable  >
                            <el-option
                            v-for="item in peopleOptions"
                            :key="item.id"
                            :label="item.username"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="起始时间" prop="time">
                        <el-date-picker
                            v-model="ruleForm.time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions1"
                            class="picker_time"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <template  v-for="(item, index) in ruleForm.devices">
                        <el-form-item label="设备及次数" prop="devices">
                            <el-select v-model="item.deviceId" filterable placeholder="请选择设备"  v-if="item.type == 1"  @change="getDevicePosition(item.deviceId,index,1)">
                                <el-option
                                v-for="item in deviceOptions"
                                :key="item.deviceId"
                                :label="item.deviceAlias"
                                :value="item.deviceId"
                                >
                                </el-option>
                            </el-select>
                            <el-input v-model="item.deviceName" class="custom" v-if="item.type == 2" placeholder="请输入自定义设备"></el-input>
                            <el-input v-model="item.planNum" class="number" type="number" min=1 placeholder="次数"></el-input>
                            <el-input v-model="item.position" placeholder="设备位置描述" :disabled='item.type == 1' class="position"></el-input>
                            
                            <i class="el-icon-error plus" @click="deleteDevice(index)"></i>
                            <i class="el-icon-circle-plus plus" @click="addDevice" v-if="index == ruleForm.devices.length- 1" ></i>
                            <i class="el-icon-edit plus" @click="addCustomeDevice" v-if="index == ruleForm.devices.length- 1" ></i>
                            <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入设备描述"
                                v-model="item.deviceContent"
                                class="textarea1"
                            >
                            </el-input>
                        </el-form-item>
                    </template>

                    <el-form-item label="巡检描述">
                         <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入巡检描述"
                            v-model="ruleForm.content"
                            class="textarea"
                            >
                            </el-input>
                    </el-form-item>

                    <el-form-item class='formfooter'>
                        <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                        <!-- <el-button @click="handleReset('ruleForm')">重置</el-button> -->
                        <el-button @click="closedialog">取 消</el-button>
                    </el-form-item>

                </el-form>
        </el-dialog>
        <!-- 单位新增弹框 -->
        <el-dialog
            title="添加修改数据"
            :visible.sync="dialogVisible1"
            width="32%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog">
                <el-form :model="ruleForm"  ref="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="巡查任务名称" prop="name" >
                        <el-input v-model="ruleForm.name" placeholder="请输入巡查任务名称" ></el-input>
                    </el-form-item>

                    <el-form-item label="巡检人员" prop="uid" placeholder="请选择巡检人员">
                        <el-select v-model="ruleForm.uid" filterable  >
                            <el-option
                            v-for="item in peopleOptions"
                            :key="item.id"
                            :label="item.username"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="起始时间" prop="time">
                        <el-date-picker
                            v-model="ruleForm.time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions1"
                            class="picker_time"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <template  v-for="(item, index) in ruleForm.devices">
                        <el-form-item label="单位及次数" prop="devices">
                            <el-select v-model="item.deviceId" filterable placeholder="请选择单位"  @change="getDevicePosition(item.deviceId,index,0)">
                                <el-option
                                v-for="item in unitOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-input v-model="item.planNum" class="number" type="number" min=1 placeholder="次数"></el-input>
                            <el-input v-model="item.position" placeholder="单位位置描述" :disabled='item.type == 0' class="position"></el-input>
                            <i class="el-icon-error plus" @click="deleteDevice(index)"></i>
                            <i class="el-icon-circle-plus plus" @click="addDevice" v-if="index == ruleForm.devices.length- 1" ></i>
                            <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入描述"
                                v-model="item.deviceContent"
                                class="textarea1"
                            >
                            </el-input>
                        </el-form-item>
                    </template>
                    <el-form-item label="巡查描述">
                         <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入巡查描述"
                            v-model="ruleForm.content"
                            class="textarea"
                            >
                            </el-input>
                    </el-form-item>

                    <el-form-item class='formfooter'>
                        <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                        <!-- <el-button @click="handleReset('ruleForm')">重置</el-button> -->
                        <el-button @click="closedialog">取 消</el-button>
                    </el-form-item>

                </el-form>
        </el-dialog>
        <!-- 设备任务详情弹框 -->
        <el-dialog
            title="查看巡检任务"
            :visible.sync="detailFlag"
            width="33%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog1">
            <el-dialog
                width="23%"
                title="设备巡检详情"
                :visible.sync="innerVisible"
                modal-append-to-body
                :modal = false
                top="27vh"
                >
               <el-form label-width="100px" class="device_detail">
                   <template v-for="item in deviceTaskDetail">
                        <el-form-item label="巡检时间" class="detail-ruleForm">
                            {{item.createdTime}}
                        </el-form-item>
                        <el-form-item label="巡检地址" class="detail-ruleForm">
                            {{item.site}}
                        </el-form-item>
                        <el-form-item label="设备状态" class="detail-ruleForm">
                            {{ item.status && "故障" || "正常"}}
                        </el-form-item>
                        <el-form-item label="巡检内容" class="detail-ruleForm">
                           {{item.content}}
                        </el-form-item>
                        <el-form-item label="巡检图片" class="detail-ruleForm">
                            <el-image
                                style="width: 100px; height: 100px" 
                                :src="item.imgUrl && item.imgUrl[0] || noneIng" 
                                :preview-src-list="item.imgUrl && item.imgUrl || []">
                            </el-image>
                        </el-form-item>
                        <div class="line"></div>
                   </template>
               </el-form>
            </el-dialog>
                <el-form   label-width="120px" class="detail-ruleForm">
                    <el-form-item label="巡检任务名称"  >
                        <el-input  :disabled='true' v-model="detailTaskList.name"></el-input>
                    </el-form-item>

                    <el-form-item label="任务发布人员">
                        <el-input  :disabled='true' v-model="detailTaskList.issuer"></el-input>
                    </el-form-item>

                    <el-form-item label="巡检人员">
                        <el-input  :disabled='true' v-model="detailTaskList.uname"></el-input>
                    </el-form-item>
                     <el-form-item label="起始时间" >
                          <el-input  :disabled='true' v-model="detailTaskList.time"></el-input>
                    </el-form-item>
                     <el-form-item label="任务完成情况" >
                        <el-input  :disabled='true' v-model="detailTaskList.status"></el-input>
                    </el-form-item>
                    <template v-for="item in detailTaskList.dtos" >
                        <el-form-item :label="item.type == 1 && typeName || unTypeName">
                             <el-input  class="more"  v-model="item.deviceName"></el-input>  
                            <span style="margin-left:10px;"> 总次数:{{item.planNum}}&nbsp;完成数:{{item.actualNum}} </span>
                             <el-input class="more"  v-model="item.position" ></el-input> 
                             <el-button type="primary" @click="printImg(item.id)">打印二维码</el-button>
                             <el-button type="primary" @click="showTaskDetail(item.id)" >查看详情</el-button>
                              <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="设备描述"
                                v-model="item.deviceContent"
                                class="textarea1"
                                :disabled='true'
                                >
                            </el-input>
                        </el-form-item>
                    </template>
                   
                    <el-form-item label="巡检描述">
                         <el-input
                            type="textarea"
                            :rows="2"
                            v-model="detailTaskList.content"
                            class="textarea"
                            :disabled='true'
                            >
                        </el-input>
                    </el-form-item> 

                </el-form>
                <div id="erwei">
                    <img :src="erWeiImg" alt="">
                </div>
                
        </el-dialog>
        <!-- 单位任务详情弹框 -->
        <el-dialog
            title="查看巡查任务"
            :visible.sync="detailFlag1"
            width="33%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog1">
            <el-dialog
                width="23%"
                title="设备巡查详情"
                :visible.sync="innerVisible"
                modal-append-to-body
                :modal = false
                top="27vh"
                >
               <el-form label-width="100px" class="device_detail">
                   <template v-for="item in deviceTaskDetail">
                        <el-form-item label="巡查时间" class="detail-ruleForm">
                            {{item.createdTime}}
                        </el-form-item>
                        <el-form-item label="巡查地址" class="detail-ruleForm">
                            {{item.site}}
                        </el-form-item>
                        <el-form-item label="单位状态" class="detail-ruleForm">
                            {{ item.status && "未通过" || "通过"}}
                        </el-form-item>
                        <el-form-item label="巡查内容" class="detail-ruleForm">
                           {{item.content}}
                        </el-form-item>
                        <el-form-item label="巡查图片" class="detail-ruleForm">
                            <el-image
                                style="width: 100px; height: 100px" 
                                :src="item.imgUrl && item.imgUrl[0] || noneIng" 
                                :preview-src-list="item.imgUrl && item.imgUrl || []">
                            </el-image>
                        </el-form-item>
                        <div class="line"></div>
                   </template>
               </el-form>
            </el-dialog>
                <el-form  label-width="120px" class="detail-ruleForm">
                    <el-form-item label="巡查任务名称"  >
                        <el-input  :disabled='true' v-model="detailTaskList.name"></el-input>
                    </el-form-item>

                    <el-form-item label="任务发布人员">
                        <el-input  :disabled='true' v-model="detailTaskList.issuer"></el-input>
                    </el-form-item>

                    <el-form-item label="巡查人员">
                        <el-input  :disabled='true' v-model="detailTaskList.uname"></el-input>
                    </el-form-item>
                     <el-form-item label="起始时间" >
                          <el-input  :disabled='true' v-model="detailTaskList.time"></el-input>
                    </el-form-item>
                     <el-form-item label="任务完成情况" >
                        <el-input  :disabled='true' v-model="detailTaskList.status"></el-input>
                    </el-form-item>
                    <template v-for="item in detailTaskList.dtos" >
                        <el-form-item label="单位及次数">
                             <el-input  class="more"  v-model="item.deviceName"></el-input>  
                            <span style="margin-left:10px;"> 总次数:{{item.planNum}}&nbsp;完成数:{{item.actualNum}} </span>
                             <el-input class="more"  v-model="item.position" ></el-input> 
                             <el-button type="primary" @click="showTaskDetail(item.id)" style="margin-left:10px;padding: 7px 29px;">查看详情</el-button>
                              <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="描述"
                                v-model="item.deviceContent"
                                class="textarea1"
                                :disabled='true'
                                >
                            </el-input>
                        </el-form-item>
                    </template>
                   
                    <el-form-item label="巡查描述">
                         <el-input
                            type="textarea"
                            :rows="2"
                            v-model="detailTaskList.content"
                            class="textarea"
                            :disabled='true'
                            >
                        </el-input>
                    </el-form-item> 

                </el-form>
                
        </el-dialog>
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
         let check_device = (rule, value, callback) => { //验证设备
            var flag = ""
            value.map( item => {
                if( !item.deviceName || !item.planNum || (!item.position)) {
                    flag = true 
                }
            })
            if ( flag ) {
                if ( this.addFalg && this.userType !=3) {
                    callback( new Error("请填写单位、次数") )
                }else{
                    callback( new Error("请填写设备、次数、位置") )
                }
            }else{
                callback()
            }
        }
       return {
            module:'PollingTask',//模块
            search:"",//搜素关键词
            userType:"",//用户类型
            unitId:'',//单位id
            data:[],//树数据
            defaultProps: { //树
                children: 'children',
                label: 'label'
            },
            addFalg: true,//新增巡检和巡查开关
            dialogVisible:false,//新增弹框开关
            dialogVisible1:false,//
            detailFlag:false,//详情弹框
            detailFlag1:false,
            innerVisible:false,//设备任务详情
            tableData:[],//巡检任务列表
            detailTaskList:'',//巡检任务详情
            deviceTaskDetail:"",//巡检设备详情
            erWeiImg:'',//二维码图片
            typeName:"联网设备",
            unTypeName:"未联网设备",
            noneIng:"https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/common/no_pic.gif",//暂无图片
            ruleForm: {//表单信息
                name: '',//巡检任务名称
                time:'',//起始时间
                uid:'',//巡检人员
                devices:[//巡检设备列表
                    {
                        deviceId:'',//设备id
                        deviceName:"",//设备名称
                        planNum:"",//巡查次数
                        deviceContent:"",//巡查描述
                        type:1,//设备类型
                        position:""//设备位置
                    },
                ],
                content:"",//任务描述
                unitId:"",//介绍任务的id
                suer:sessionStorage.getItem('user_id'),//派发任务的id
                type:1
            },
            rules: {//验证规则
                name: [
                    { required: true,message: '请填写任务名称', trigger: 'blur' },
                ],
                time: [
                    { required: true,message: '请选择起始时间', trigger: 'blur' },
                ],
                uid: [
                    { required: true,message: '请选择人员', trigger: 'blur' },
                ],
                devices: [
                    { 
                     validator:check_device,required: true, trigger: 'blur',
                    },
                ],
            },
            peopleOptions:"",//人员选项
            deviceOptions:"",//设备选项
            unitOptions:"",//单位选项
            pickerOptions1: {//限制日期
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            },
            currentPage:1,
            rows:10,
            total:1,

       }
   },
 methods:{
    opendialog (flag) {
        if( flag ) {
             this.dialogVisible1 = true
            this.ruleForm.devices[0].type = 0
        }else{
            this.dialogVisible = true
            this.ruleForm.devices[0].type = 1
        }
    },
    print(content, w = null, h = null) {
            const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

            const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
            w = +w === 0 ? width : w;
            h = +h === 0 ? height : h;
            const left = ((width / 2) - (w / 2)) + dualScreenLeft;
            const top = ((height / 2) - (h / 2)) + dualScreenTop;
            var myWindow = window.open("", "打印", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
            var style = "<style type='text/css'>table.gridtable {font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;}table.gridtable th {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}table.gridtable td {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff;}</style>";
            myWindow.document.write(content + style);
            myWindow.focus();
            myWindow.document.close();     //关闭document的输出流, 显示选定的数据
            myWindow.print();   //打印当前窗口
            return myWindow;
        },
    printImg (id) {//打印二维码
            var that = this
            this.axios({
                    url:"/api/admin/inspection/qr/save",
                    method:"post",
                    data:{
                       id
                    }
                }).then( res => {
                    this.erWeiImg = res.data.data.crCode
                    this.$nextTick( ()=> {
                        setTimeout( () => {
                            var windows = that.print(document.getElementById('erwei').innerHTML,1000,600);
                            // windows.close();
                        },500)
                    })
                })
        },
    getData () {
            var type =""
            if ( this.addFalg && this.userType !=3 ) { //获取巡检任务列表
                    type=2
            }else{//获取巡查任务列表
                    type = 1
            }
            if (this.unitId ) {

             this.axios({
                    url:"/api/admin/inspection/list",
                    method:"post",
                    data:{
                        unitId:this.unitId,
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                        type
                    }
                }).then( res => {
                    this.tableData = res.data.list
                    this.tableData.map( item => {
                        item.startTime = item.startTime && this.$moment( item.startTime).format("YYYY-MM-DD HH:mm") || ''
                        item.endTime = item.endTime && this.$moment( item.endTime).format("YYYY-MM-DD HH:mm") || ''
                        item.time = item.startTime + " - "+item.endTime
                        if ( item.status == 1 ) {
                            item.status = "已完成"
                        }else if ( item.status ==0 ) {
                            item.status = "未完成"
                        }
                    })
                    this.total = res.data.total
            })
         }

       },
    editData (id) {//查看巡检任务
    
        this.axios({
            url:"/api/admin/inspection/single",
            method:"post",
            data:{
                id
            }
        }).then ( res => {
            if ( res.data.code == 0 ) {
                 if ( this.addFalg && this.userType !=3 ) {
                        this.detailFlag1 =true
                    }else{
                        this.detailFlag = true
                    }
                this.detailTaskList = res.data.data
                this.detailTaskList.startTime =  this.detailTaskList.startTime && this.$moment( this.detailTaskList.startTime).format("YYYY-MM-DD HH:mm") || ''
                this.detailTaskList.endTime = this.detailTaskList.endTime && this.$moment( this.detailTaskList.endTime).format("YYYY-MM-DD HH:mm") || ''
                this.detailTaskList.time = this.detailTaskList.startTime + " - "+this.detailTaskList.endTime
                if ( this.detailTaskList.status == 1 ) {
                    this.detailTaskList.status = "已完成"
                }else if ( this.detailTaskList.status ==0 ) {
                    this.detailTaskList.status = "未完成"
                }
    
            }else{
                    this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                });
            }
        })
    },
    showTaskDetail (id) {//查看设备巡检详情

        this.axios({
            url:"/api/admin/inspection/patrol/search",
            method:"post",
            data:{
                id
            }
        }).then (  res => {
            if ( res.data.code ==0 ) {
                this.deviceTaskDetail = res.data.data
                if( this.deviceTaskDetail.length ) {
                     this.deviceTaskDetail.map( item => {
                    item.imgUrl = item.imgUrl && item.imgUrl.split(",")
                    item.createdTime = item.createdTime && this.$moment( item.createdTime).format("YYYY-MM-DD HH:mm") || ''
                    })
                    this.innerVisible = true
                }else{
                    this.$alert("没有记录", '提示', {
                        confirmButtonText: 'OK',
                    });
                }
               
            }else{
                this.$alert(res.data.msg, '提示', {
                    confirmButtonText: 'OK',
                });
            }
        })
        
    },
    handleDelete (id) {//删除巡检任务
        this.$confirm('你确定要删除吗').then( () => {
                    this.axios({
                    url:"/api/admin/inspection/delete",
                    method:"post",
                    data:{
                        id
                    }
                }).then (  res => {
                    if ( res.data.code == 0 ) {
                        this.getData()
                        this.$alert("删除成功", '提示', {
                            confirmButtonText: 'OK',
                        });
                    }else{
                        this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
        })
           
    },
    getDevicePosition (id,index,type) {//获取联网设备位置
        if ( type ) {
                this.axios({
                url:"/api/admin/device/task/single",
                method:"post",
                data:{
                    id
                }
            }).then( res => {
                this.ruleForm.devices[index].deviceName = res.data.data.deviceName
                this.ruleForm.devices[index].position = res.data.data.addr
            })
        }else{
            this.axios({
                url:"/api/admin/unit/single",
                method:"post",
                data:{
                    id
                }

            }).then ( res => {
                this.ruleForm.devices[index].deviceName = res.data.data.name
                this.ruleForm.devices[index].position = res.data.data.address
            })
        }
    },
    getOptions () {//获取设备和人员下拉框
        if( this.addFalg && this.userType !=3 ) { 
            this.axios({
                url:"/api/admin/unit/list",
                method:"post",
                data:{
                    pageNum: 1,
                    pageSize: 99999,
                    unitId: this.unitId,
                }
            }).then ( res => {
                this.unitOptions = res.data.list
                var indexs = ""
                this.unitOptions.map( (item,index) => {
                    if ( item.id == sessionStorage.getItem('unitId') ) {
                        indexs = index
                    }
                })
                this.unitOptions.splice(indexs,1)
            })
        }else{

            this.axios({
                url:"/api/admin/device/list",
                method:"post",
                data:{
                    pageNum: 1,
                    pageSize: 99999,
                    unitId: this.unitId,
                }
            }).then ( res => {
                this.deviceOptions = res.data.list
            })
         }
        this.axios({
                url:"/api/admin/user/list",
                method:"post",
                data:{
                    pageNum: 1,
                    pageSize: 99999,
                    unitId: this.unitId,
                }
            }).then ( res => {
                this.peopleOptions = res.data.list
            })
         
    },
    handleSubmit (formName) {//提交

        this.$refs[formName].validate((valid) => {
            if (!valid) {
                this.$alert('添加数据失败,请填完必填字段!', '提示', {
                    confirmButtonText: 'OK',
                });
                return false
            } else {
                this.$confirm('你确定要添加任务吗')
                    .then(()=> {
                        
                        if ( this.addFalg && this.userType !=3 ) {
                           this.ruleForm.type = 2
                        }else{
                            this.ruleForm.type = 1
                        }
                        this.axios({
                            url:"/api/admin/inspection/add",
                            method:"post",
                            data:{
                                ...this.ruleForm
                            }
                        }).then( res => {
                            if ( res.data.code == 0 ) {
                                this.getData()
                                this.$alert("添加成功", '提示', {
                                    confirmButtonText: 'OK',
                                });
                                this.closedialog()
                            }else{
                                this.$alert(res.data.msg, '提示', {
                                    confirmButtonText: 'OK',
                                });
                            }
                        })
                    })
                }
        })
           
    }, 
    deleteDevice (index) {//删除设备
          if ( index ||  this.ruleForm.devices.length > 1) {
              this.ruleForm.devices.splice(index,1)
          }
    },
    addDevice () {//添加设备
        if( this.addFalg && this.userType !=3 ) {
            this.ruleForm.devices.push({
                deviceName:"",
                deviceId:'',
                planNum:"",
                deviceContent:"",
                type:0,
                position:""
            })
        }else{
            this.ruleForm.devices.push({
                deviceName:"",
                deviceId:'',
                planNum:"",
                deviceContent:"",
                type:1,
                position:""
            })
        }
        
    },
    addCustomeDevice () {//添加自定义设备
        this.ruleForm.devices.push({
            deviceName:"",
            planNum:"",
            deviceContent:"",
            type:2,
            position:""
        })
    },  
    closedialog () {//关闭
          this.dialogVisible = false
          this.dialogVisible1 = false
          this.handleReset()
    },
    closedialog1 () {//关闭
          this.detailFlag = false
          this.detailFlag1 = false
          this.erWeiImg = ""
    },
    handleReset () {//重置
          Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
          this.ruleForm.unitId = this.unitId
    },
    renderContent(h, { node, data}) { //树前小图标
        return (
        <span>
            <i class={data.icon}></i>
            &nbsp;<span>{node.label}</span>
        </span>
        );
    },
    handleNodeClick(data) { //点击树节点
        this.unitId = data.id
        this.ruleForm.unitId = data.id
        this.rows = 10
        this.currentPage = 1
        if( data.type == 0 ) {
            this.addFalg = true
        }else{
            this.addFalg = false
        }
        this.getOptions()
        this.getData()
    },
    pageChange (item) {//页数页码改变页面重新刷新
        this.currentPage = item.page_index;
        this.rows = item.page_limit;
        this.getData() //改变页码，重新渲染页面
    },
},
    mounted() {
        this.userType = sessionStorage.getItem('userTypes')
        this.ruleForm.unitId = Number(sessionStorage.getItem('unitId'))
        this.unitId =Number(sessionStorage.getItem('unitId'))
        this.getOptions()
        this.getData()
    },
}
</script>

<style lang="scss" >
    #polling_task{
        .el-table:before{
            width:0;
        }
        .el-input{
            width:230px;
        }
        .el-table th div{
            line-height: normal
        }
         .el-table--border{
            border: none;
        }
       
        .top .el-date-editor{
            width:180px;
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
         #erwei{
                position: absolute;
                top: 196px;
                height: 200px;
                width: 200px;
                left: 68%;
                img{
                    height: 100%;
                    width: 100%;
                }
            }
        
        
    }
</style>