<template>
<!-- 维修任务 -->
    <div id='maintenance_plan' class='allcontent'>
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
                  <div v-show="!(addFalg && userType!=3)">
                        <span >任务名称:</span> 
                            <el-input v-model="taskName" placeholder="请输入任务名称"  ></el-input>
                        <span >任务状态:</span> 
                        <el-select v-model="taskStatus" placeholder="请选择" >
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <span >设备状态:</span>
                        <el-select v-model="deviceStatus" placeholder="请选择" >
                            <el-option
                            v-for="item in options1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select> 
                        <el-button type="primary"  @click="searchGetData"> 查询</el-button>
                        <el-button  type="primary"  @click="reset"> 重置</el-button>
                        <el-button  type="primary"> 导出 </el-button>
                  </div>
                  <div> <el-button type="primary" @click="opendialog" :disabled="addFalg && userType!=3"><i class="el-icon-plus"></i> 新增维修计划 </el-button> </div> 
        </div>
        <!-- 内容 -->
        <div style='margin-top:10px;height: 88%;position: relative;'>
            <!-- 表格 -->
            <el-table					
                :data="tableData"
                border
                style="width: 150"
                v-show="!(addFalg && userType!=3)"
                >
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="name"
                label="任务名称"
                width="200">
                </el-table-column>
                <el-table-column
                prop="uname"
                label="任务人员"
                width="150">
                </el-table-column>
                <el-table-column
                prop="deviceName"
                label="故障设备"
                width="230">
                </el-table-column>
                <el-table-column
                prop="endTime"
                label="任务结束时间"
                width="200">
                </el-table-column>
                <el-table-column
                prop="status"
                label="任务完成情况"
                width="110">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope='scope'>
                        <el-button
                        size="mini"
                        type="primary"
                        class='el-icon-edit'
                        @click="handleEdit(scope.row.id)" v-if="scope.row.status !='已完成'"> 编辑</el-button>
                       
                        <el-button
                        size="mini"
                        type="success"
                        class='el-icon-circle-check'
                        @click="handle(scope.row.id)" v-if="scope.row.status =='待分配' || scope.row.status =='待审核'"> 完成</el-button>
                         <el-button
                        size="mini"
                        type="primary"
                        class='el-icon-warning-outline'
                        @click="editData(scope.row.id)"> 查看</el-button>
                         <el-button
                        size="mini"
                        type="danger"
                        class='el-icon-delete'
                        @click="handeDelete(scope.row.id)"  v-if="scope.row.status =='已完成'">删除</el-button>
                    </template>
                </el-table-column>
               
            </el-table>
            <!-- 分页 -->
            <div style="position:absolute;bottom:0;" class="page">
                <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
            </div>
        </div>
            <!-- 设备新增弹框 -->
            <el-dialog
                title="添加修改维修计划"
                :visible.sync="dialogVisible"
                width="32%"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closedialog">
                    <el-form :model="ruleForm"  ref="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">

                        <el-form-item label="维修任务名称" prop="name" >
                            <el-input v-model="ruleForm.name" placeholder="请输入维修任务名称"></el-input>
                        </el-form-item>
                         <el-form-item label="维修人员" prop="uid" placeholder="请选择维修人员">
                        <el-select v-model="ruleForm.uid" filterable  >
                            <el-option
                            v-for="item in peopleOptions"
                            :key="item.id"
                            :label="item.username"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        <el-date-picker
                            v-model="ruleForm.endTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            :picker-options="pickerOptions1"
                            class="picker_time"
                            >
                        </el-date-picker>
                    </el-form-item>
                        <el-form-item label="联网设备名称" prop="deviceId"  v-if="ruleForm.type == 1" >
                            <el-select v-model="ruleForm.deviceId" filterable placeholder="请选择设备" @change="getDevicePosition(ruleForm.deviceId)">
                                <el-option
                                v-for="item in deviceOptions"
                                :key="item.deviceId"
                                :label="item.deviceAlias"
                                :value="item.deviceId"
                                >
                                </el-option>
                            </el-select>
                          <el-button type="primary" @click="addDevice" v-if="ruleForm.type == 2">联网设备</el-button>
                            <el-button type="primary" @click="addCustomeDevice" v-if="ruleForm.type == 1">未联网设备</el-button>
                        </el-form-item>

                        <el-form-item label="未联网设备名称" prop="deviceName" v-if="ruleForm.type == 2" >
                          <el-input v-model="ruleForm.deviceName" class="custom" placeholder="请输入自定义设备"></el-input>
                           <el-button type="primary" @click="addDevice" v-if="ruleForm.type == 2">联网设备</el-button>
                            <el-button type="primary" @click="addCustomeDevice" v-if="ruleForm.type == 1">未联网设备</el-button>
                        </el-form-item>


                    <el-form-item label="设备位置" prop="position">
                            <el-input v-model="ruleForm.position" placeholder="设备位置描述" :disabled='ruleForm.type == 1' class="position"></el-input>
                    </el-form-item>
                    <el-form-item label="维修类型" prop="deviceStatus">
                            <el-radio-group v-model="ruleForm.deviceStatus">
                                <el-radio :label="1">故障</el-radio>
                                <el-radio :label="2">损坏</el-radio>
                                <el-radio :label="3">已过期</el-radio>
                            </el-radio-group>
                    </el-form-item>
                    <el-form-item label="维修描述">
                         <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入维修计划描述"
                            v-model="ruleForm.content"
                            class="textarea"
                            >
                            </el-input>
                    </el-form-item>

                        <el-form-item  style=" text-align: left;">
                            <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                            <!-- <el-button @click="handleReset('ruleForm')">重置</el-button> -->
                            <el-button @click="closedialog">取 消</el-button>
                        </el-form-item>

                    </el-form>
            </el-dialog>
    
        <el-dialog
            title="查看维修任务"
            :visible.sync="detailFlag"
            width="33%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog">
                <el-form label-width="120px" class="detail-ruleForm">
                    <el-form-item label="维修任务名称"  >
                        <el-input  :disabled='true' v-model="detailTaskList && detailTaskList.name"></el-input>
                    </el-form-item>

                    <el-form-item label="任务发布人员">
                        <el-input  :disabled='true' v-model="detailTaskList && detailTaskList.issuer"></el-input>
                    </el-form-item>

                    <el-form-item label="维修人员">
                        <el-input  :disabled='true' v-model="detailTaskList && detailTaskList.uname"></el-input>
                    </el-form-item>
                     <el-form-item label="创建时间" >
                          <el-input  :disabled='true' v-model="detailTaskList && detailTaskList.createdTime"></el-input>
                    </el-form-item>
                     <el-form-item label="结束时间" >
                          <el-input  :disabled='true' v-model="detailTaskList && detailTaskList.endTime"></el-input>
                    </el-form-item>
                    <el-form-item label="任务完成情况">
                        <el-input  :disabled='true' v-model="detailTaskList && detailTaskList.status"></el-input>
                    </el-form-item>
                    
                    <el-form-item :label="detailTaskList && detailTaskList.type == 1 && typeName || unTypeName">
                             <el-input  class="more"  v-model="detailTaskList && detailTaskList.deviceName"></el-input>  
                             <el-input class="more"  v-model="detailTaskList && detailTaskList.position" ></el-input> 
                    </el-form-item>
                       <div class="line"></div>

                    <template v-for="(item, index) in (detailTaskList && detailTaskList.details)">
                       <el-form-item label="维修人员" >
                          <el-input  :disabled='true' v-model="item.uname"></el-input>
                       </el-form-item>
                       <el-form-item label="维修状态" >
                          <el-input  :disabled='true' v-model="item.status"></el-input>
                       </el-form-item>
                       <el-form-item label="处理时间" >
                          <el-input  :disabled='true' v-model="item.createdTime"></el-input>
                       </el-form-item>
                       <el-form-item label="维修描述" >
                          <el-input
                            type="textarea"
                            :rows="2"
                            class="textarea"
                            :disabled='true'
                            v-model="item.content"
                            >
                        </el-input>
                       </el-form-item>
                       <div class="line"></div>
                    </template>
                   
                    <el-form-item label="维修计划描述">
                         <el-input
                            type="textarea"
                            :rows="2"
                            v-model="detailTaskList && detailTaskList.content"
                            class="textarea"
                            :disabled='true'
                            >
                        </el-input>
                    </el-form-item> 

                </el-form>
                
        </el-dialog>

        <el-dialog
            title="添加指定人员"
            :visible.sync="detailFlag1"
            width="33%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog">
                <el-form  label-width="120px" class="detail-ruleForm">
                    <el-form-item label="维修任务名称"  >
                       
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
       return {
            module:'MaintenancePlan',//模块
            tableData:[],//任务列表
            userType:"",//用户类型
            unitId:'',//单位id
            addFalg: true,//新增开关
            detailFlag:false,//详情开关
            detailFlag1:false,//指定开关
            detailTaskList:"",//任务详情列表
            typeName:"联网设备",
            unTypeName:"未联网设备",
            data:[],//树数据
            defaultProps: { //树
                children: 'children',
                label: 'label'
            },
            currentPage:1,
            rows:10,
            total:1,
            ruleForm: {//表单信息
                name: '',//巡检任务名称
                endTime:'',//起始时间
                uid:'',//巡检人员
                content:"",//任务描述
                unitId:"",//介绍任务的id
                suer:sessionStorage.getItem('user_id'),//派发任务的id
                deviceId:'',
                deviceName:"",
                position:"",
                type:1,
                id:"",
                status:"",
                deviceStatus:"1"
            },
            rules: {//验证规则
                name: [
                    { required: true,message: '请填写任务名称', trigger: 'blur' },
                ],
                endTime: [
                    { required: true,message: '请选择结束时间', trigger: 'blur' },
                ],
                uid: [
                    { required: true,message: '请选择人员', trigger: 'blur' },
                ],
                position: [
                    { required: true,message: '请填写设备地址', trigger: 'blur' },
                ],
                deviceName: [
                    { required: true,message: '请填写设备名称', trigger: 'blur' },
                ],
                deviceId: [
                    { required: true,message: '请填写设备名称', trigger: 'blur' },
                ],
                deviceStatus: [
                    { required: true,message: '请选择维修类型', trigger: 'blur' },
                ],
            },
            peopleOptions:"",//人员选项
            deviceOptions:"",//设备选项
            pickerOptions1: {//限制日期
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            },
            options: [
                {
                    value: 0,
                    label: '待分配'
                }, 
                {
                    value: 1,
                    label: '已分配'
                }, 
                {
                    value: 2,
                    label: '待审核'
                }, 
                {
                    value: 3,
                    label: '已完成'
                }, 
            ],
            options1: [
                {
                    value: 1,
                    label: '故障'
                }, 
                {
                    value: 2,
                    label: '损坏'
                }, 
                {
                    value: 3,
                    label: '已过期'
                }, 
            ],

        taskName:"",//任务名称
        taskStatus:"",//任务状态
        deviceStatus:"",//设备状态
       }
   },
 methods:{
        getData () {//获取任务列表
            this.axios({
                url:"/api/admin/maintenance/page",
                method:"post",
                data:{
                    unitId:this.unitId,
                    status:this.taskStatus,
                    name:this.taskName,
                    pageNum: this.currentPage,
                    pageSize: this.rows,
                }
            }).then ( res => {
                 this.tableData = res.data.list
                this.tableData.map( item => {
                    item.endTime = item.endTime && this.$moment( item.endTime).format("YYYY-MM-DD HH:mm") || ''
                    if ( item.status == 1 ) {
                        item.status = "已分配"
                    }else if ( item.status ==0 ) {
                        item.status = "待分配"
                    }else if ( item.status == 2 ) {
                        item.status = "待审核"
                    }else if ( item.status == 3 ) {
                        item.status = "已完成"
                    }
                })
                this.total = res.data.total
            })
        },
        searchGetData(){//模糊查询列表
            this.currentPage=1;
            this.$refs.paginationChild.changePageNum(this.currentPage)
            this.getData();
        },
        handleSubmit (formName) {//提交

            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    this.$alert('添加数据失败,请填完必填字段!', '提示', {
                        confirmButtonText: 'OK',
                    });
                    return false
                } else {
                    if ( this.ruleForm.id ) {
                            this.$confirm('你确定要修改任务吗')
                        .then(()=> {
                            this.ruleForm.status = 1
                            this.ruleForm.suer = sessionStorage.getItem('user_id')
                             this.axios({
                                url:"/api/admin/maintenance/update",
                                method:"post",
                                data:{
                                    ...this.ruleForm
                                }
                            }).then ( res => {
                                if ( res.data.code == 0 ) {
                                    this.getData()
                                    this.$alert("修改成功", '提示', {
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
                    
                    }else{

                    this.$confirm('你确定要添加任务吗')
                        .then(()=> {
                            
                            this.axios({
                                url:"/api/admin/maintenance/add",
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

                }
            })
           
        },
        editData (id) {//查看
         this.axios({
                url:"/api/admin/maintenance/single",
                method:"post",
                data:{
                    id
                }
            }).then( res => {
                if ( res.data.code == 0 ) {
                    this.detailFlag = true
                    this.detailTaskList = res.data.data
                    this.detailTaskList.endTime = this.detailTaskList.endTime && this.$moment( this.detailTaskList.endTime).format("YYYY-MM-DD HH:mm") || ''
                    this.detailTaskList.createdTime = this.detailTaskList.createdTime && this.$moment( this.detailTaskList.createdTime).format("YYYY-MM-DD HH:mm") || ''
                    if ( this.detailTaskList.status == 1 ) {
                        this.detailTaskList.status = "已分配"
                    }else if ( this.detailTaskList.status ==0 ) {
                        this.detailTaskList.status = "待分配"

                    }else if ( this.detailTaskList.status == 2 ) {
                        this.detailTaskList.status = "待审核"
                    }else if ( this.detailTaskList.status == 3 ) {
                        this.detailTaskList.status = "已完成"
                    }
                    this.detailTaskList.details.length && this.detailTaskList.details.map( item => {
                        item.createdTime = item.createdTime && this.$moment( item.createdTime).format("YYYY-MM-DD HH:mm") || ''
                       if ( item.status ) {
                           item.status = "已处理"
                       }else{
                           item.status = "无法处理"
                       }
                    })
                }else{
                    this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        handleEdit (id) {//编辑
             this.axios({
                    url:"/api/admin/maintenance/single",
                    method:"post",
                    data:{
                        id
                    }
                }).then( res => {
                    if ( res.data.code == 0 ) {
                        this.dialogVisible = true
                        this.ruleForm = res.data.data
                    }else{
                        this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
            })
        },
        handeDelete (id) {
             this.$confirm('你确定要删除任务吗')
                .then(()=> {
                    this.axios({
                    url:"/api/admin/maintenance/delete",
                    method:"post",
                    data:{
                        id,
                    }
                }).then( res => {
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
        allocation () {//分配
            this.detailFlag1 = true
        },
        handle (id) {//处理
         this.$confirm('你确定要处理任务吗')
                .then(()=> {

                    this.axios({
                    url:"/api/admin/maintenance/update",
                    method:"post",
                    data:{
                        id,
                        status:3
                    }
                }).then( res => {
                    if ( res.data.code == 0 ) {
                        this.getData()
                        this.$alert("处理成功", '提示', {
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

        },
        getOptions () {//获取设备和人员下拉框
            this.axios({
                    url:"/api/admin/device/list",
                    method:"post",
                    data:{
                        pageNum: 1,
                        pageSize: 9999,
                        unitId: this.unitId,
                    }
                }).then ( res => {
                        this.deviceOptions = res.data.list
            })
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
        getDevicePosition (id) {//获取联网设备位置
            this.axios({
                url:"/api/admin/device/task/single",
                method:"post",
                data:{
                    id
                }
            }).then( res => {
                this.ruleForm.deviceName = res.data.data.deviceName
                this.ruleForm.position = res.data.data.addr
            })
        },
        addDevice () {//添加设备
            if ( !this.ruleForm.id ) {
                this.ruleForm.deviceName=""
                this.ruleForm.position=""
                this.ruleForm.deviceId=""
            }
                this.ruleForm.type = 1
        },
        addCustomeDevice () {//添加自定义设备
            if ( !this.ruleForm.id ) {
                this.ruleForm.deviceName=""
                this.ruleForm.position=""
                this.ruleForm.deviceId=""
            }
            this.ruleForm.type = 2
        },
        deleteDevice (index) {//删除设备
            if ( index ||  this.ruleForm.devices.length > 1) {
                this.ruleForm.devices.splice(index,1)
            }
        },
        closedialog () {//关闭
          this.dialogVisible = false
          this.detailFlag = false
          this.detailFlag1 = false
          this.handleReset()
        },  
        handleReset () {//重置表单
            Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
            this.ruleForm.unitId = this.unitId
        },
        reset () {
            this.taskName =""
            this.taskStatus = ""
            this.deviceStatus = ""
            this.getData()
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
            if( data.type == 0 ) {
                this.addFalg = true
            }else{
                this.addFalg = false
                this.rows = 10
                this.currentPage = 1
                this.getData()
                this.getOptions()
            }
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
        if ( this.userType == 3 ) {
            this.getOptions()
            this.getData()
        }
    },
}
</script>

<style lang="scss" >
    #maintenance_plan{
        .el-table::before{
            width:0;
        }
        .el-input{
            width:230px;
        }
        .top{
            border-bottom: 1px solid #eee;
            display: flex;
            .el-input{
                width:160px;
            }
        }
        .top .el-date-editor{
            width:180px;
        }
        .el-table--border{
            border: none;
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
           .line{
               height: 0;
               width: 100%;
               border-bottom: 1px solid #eee;
               margin-bottom: 2px;
           }
        }
        .device_detail{
            .el-form-item__content,.el-form-item__label{
                line-height: normal
            }
           
        }
       
    }
</style>