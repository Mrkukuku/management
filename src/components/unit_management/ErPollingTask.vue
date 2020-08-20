<template>
<!-- 巡检任务 -->
    <div id='er_polling_task' class='allcontent'>
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
            <div  v-if='addFalg || userType ==3'>
                <el-button type="primary"  @click="opendialog(1)"><i class="el-icon-plus"></i> 新增巡检任务</el-button>
                 <el-button
                type="primary"
                class='Frozen'
                @click="handleFrozens(0)"
                v-show="isClose==1"
                >开启</el-button>
                 <el-button
                type="warning"
                class='Frozen'
                 v-show="isClose==0"
                @click="handleFrozens(1)"
                >关闭</el-button>
            </div>
        </div>
        <!-- 内容 -->
        <div style='margin-top:10px;height: 88%;position: relative;'>
            <!-- 表格 -->
            <el-table					
                :data="tableData"
                border
                align="center"
                style="width: 150"
                header-align="center"
                >
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="name"
                label="任务名称"
                align="center"
                width="250">
                </el-table-column>
                <el-table-column
                prop="unames"
                label="巡检人员"
                align="center"
                width="300">
                </el-table-column>
                <el-table-column
                label="巡检周期"
                align="center"
                width="120">
                 <template slot-scope="scope">
                       {{ scope.row.cycle==1&&'年'||scope.row.cycle==2&&'月'||scope.row.cycle==3&&'周'|| '日'}} 
                    </template>
                </el-table-column>
                <el-table-column
                label="巡检时段"
                align="center"
                width="200">
                   <template slot-scope="scope">
                       {{ scope.row.startTime }} - {{scope.row.endTime}}
                    </template>
                </el-table-column>
                <el-table-column
                label="任务完成情况"
                align="center"
                width="120">
                     <template slot-scope="scope">
                       {{ scope.row.status==0&&'未完成'||'已完成' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope='scope'>
                        <el-button
                        size="mini"
                        type="primary"
                        class='el-icon-edit'
                        @click="editData(scope.row.id)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        class='el-icon-delete'
                        @click="handleDelete(scope.row.id)">删除</el-button>
                        <el-button
                        size="mini"
                        type="warning"
                        @click="freeze(scope.row)"> {{scope.row.isFrozen==0&&'冻结'||'解冻'}} </el-button>
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
            width="45%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog">
                <el-form :model="ruleForm"  ref="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="巡检任务名称" prop="name" >
                        <el-input v-model="ruleForm.name" placeholder="请输入巡检任务名称" ></el-input>
                    </el-form-item>

                    <el-form-item label="巡检类型" prop="type" >
                        <el-select v-model="ruleForm.type" placeholder="请选择" @change="getQlist">
                            <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="巡检周期" prop="cycle" >
                        <el-select v-model="ruleForm.cycle" placeholder="请选择">
                            <el-option
                            v-for="item in cycleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="巡检星期"  v-if="ruleForm.cycle==3" prop="week">
                       <el-select v-model="ruleForm.week" filterable  multiple >
                            <el-option
                            v-for="item in weekOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                   <el-form-item label="巡检开始时间" prop="startTime">
                         <el-time-picker
                            v-model="ruleForm.startTime"
                            value-format="HH:mm"
                            format="HH:mm"
                            placeholder="巡检开始时间">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="巡检结束时间" prop="endTime">
                         <el-time-picker
                            v-model="ruleForm.endTime"
                            value-format="HH:mm"
                            format="HH:mm"
                            placeholder="巡检结束时间">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="巡检人员" prop="uids">
                        <el-select v-model="ruleForm.uids" filterable  multiple>
                            <el-option
                            v-for="item in peopleOptions"
                            :key="item.id"
                            :label="item.username"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                   <el-form-item label="巡检路线" prop="qrList">
                       <el-transfer
                        style="text-align: left; display: inline-block"
                        class="transfer"
                        filterable
                        v-model="ruleForm.qrList"
                        :render-content="renderFunc"
                        :props="{
                            key: 'id',
                            label: 'name'
                        }"
                        :titles="['巡检二维码', '巡检路线']"
                        :format="{
                            noChecked: '${total}',
                            hasChecked: '${checked}/${total}'
                        }"
                        @left-check-change="leftChange"
                        :target-order="'push'"
                        :data="routeData">
                        </el-transfer>
                   </el-form-item>
                    <el-form-item class='formfooter'>
                        <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                        <!-- <el-button @click="handleReset('ruleForm')">重置</el-button> -->
                        <el-button @click="closedialog">取 消</el-button>
                    </el-form-item>

                </el-form>
        </el-dialog>
        <!-- 单位新增弹框 -->
        <!-- 设备任务详情弹框 -->
        <el-dialog
            title="查看巡检任务"
            :visible.sync="detailFlag"
            width="33%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog1">

        </el-dialog>
         <el-dialog
                title="冻结任务"
                :visible.sync="FrozenVisible"
                width="30%"
                :close-on-click-modal="false"
                :before-close="closeFrozen">
                    <el-form :rules="rulesFrozen" :model="FrozenForm" :data="FrozenForm" status-icon  ref="FrozenForm" label-width="130px" class="demo-ruleForm FrozenForm">
                        <el-form-item label="冻结时间" prop="time">
                           <el-date-picker
                            v-model="FrozenForm.time"
                            type="datetimerange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="expireTimeOption"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="冻结原因原因">
                            <el-input type="textarea" v-model="FrozenForm.frozenDesc"></el-input>
                        </el-form-item>
                        <el-form-item class="formfooter">
                            <el-button type="primary" @click="FrozenSubmit('FrozenForm')">冻结</el-button>
                            <el-button @click="closeFrozen">取 消</el-button>
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
            module:'PollingTask',//模块
            search:"",//搜素关键词
            FrozenVisible:false,//冻结页面开关
             expireTimeOption: {//时间范围
                disabledDate(date) {
                        return date.getTime()+24*60*60*1000 < Date.now();
                }
            },
            isClose:0,
            userType:"",//用户类型
            unitId:'',//单位id
            data:[],//树数据
            defaultProps: { //树
                children: 'children',
                label: 'label'
            },
            routeData:[],
            addFalg: false,//新增巡检和巡查开关
            dialogVisible:false,//新增弹框开关
            detailFlag:false,//详情弹框
            tableData:[],//巡检任务列表
            ruleForm: {//表单信息
               name:'',
               uids:[],
               cycle:'',
               week:[],
               qrList:[],
               type:'',
               unitId:"",
               issuer:'',
               startTime:'',
               endTime:'',
               unames:[]
            },
            FrozenForm:{
                time:[],
                frozenDesc:'',
                id:'',
                isFrozen:1
            },
            rules: {//验证规则
                name: [
                    { required: true,message: '请填写任务名称', trigger: 'blur' },
                ],
                startTime: [
                    { required: true,message: '请选择时间', trigger: 'blur' },
                ],
                endTime: [
                    { required: true,message: '请选择时间', trigger: 'blur' },
                ],
                uids: [
                    { required: true,message: '请选择人员', trigger: 'blur' },
                ],
                qrList: [
                    { required: true,message: '请选择路线', trigger: 'change' },
                ],
                cycle: [
                    { required: true, message: '请选择周期',trigger: 'blur', },
                ],
                week: [
                    { required: true, message: '请选择星期',trigger: 'blur', },
                ],
                type: [
                    { required: true, message: '请选择类型',trigger: 'blur', },
                ],
            },
            rulesFrozen: {//验证规则
                time: [
                    { required: true,message: '请选择时间', trigger: 'blur' },
                ],
            },
            peopleOptions:[],//人员选项
            cycleOptions:[
                {
                    value: 1,
                    label: '年'
                },
                {
                    value: 2,
                    label: '月'
                },
                {
                    value: 3,
                    label: '周'
                },
                {
                    value: 4,
                    label: '日'
                },
            ],
            typeOptions:[
                {
                    value: 1,
                    label: '巡检'
                },
                {
                    value: 2,
                    label: '巡更'
                },
            ],
            weekOptions:[
                {
                    value: 1,
                    label: '星期一'
                },
                {
                    value: 2,
                    label: '星期二'
                },
                {
                    value: 3,
                    label: '星期三'
                },
                {
                    value: 4,
                    label: '星期四'
                },
                {
                    value: 5,
                    label: '星期五'
                },
                {
                    value: 6,
                    label: '星期六'
                },
                {
                    value: 7,
                    label: '星期天'
                },
            ],
            renderFunc(h, option) {
                return <span>{ option.name }</span>;
            },
            currentPage:1,
            rows:10,
            total:1,
       }
   },
 methods:{
     closeFrozen(){
         this.FrozenVisible = false
          Object.assign(this.$data.FrozenForm,this.$options.data().FrozenForm);
     },
     freeze(data){
         if( data.isFrozen==0 ){
             this.FrozenVisible = true
             this.FrozenForm.id = data.id
         }else{
                var startTime = data.frozenStartTime && this.$moment(data.frozenStartTime).format("YYYY-MM-DD HH:mm");
                var endTime = data.frozenEndTime && this.$moment(data.frozenEndTime).format("YYYY-MM-DD HH:mm");
                const confirmText = ['冻结时间:\n\n\n'+startTime+'\n至\n'+endTime,'冻结原因:\n'+data.frozenDesc, '你确定要解冻吗?']
                const newDatas = []
                const h = this.$createElement
                for (const i in confirmText) {
                newDatas.push(h('p', null, confirmText[i]))
                }
                this.$confirm(
                    '提示',
                    {
                        title: '提示',
                        message: h('div', null,newDatas),
                        showCancelButton: true,
                        confirmButtonText: '解冻',
                        cancelButtonText: '取消',
                    }
                )
                .then(()=> {
                    this.axios({
                        url:"/api/admin/xlm/fire/inspection/update",
                        method:"post",
                        data:{
                            id:data.id,
                             isFrozen:0
                        }
                    }).then( res => {
                        if ( res.data.code == 0 ) {
                            this.getData()
                            this.$alert("成功", '提示', {
                                confirmButtonText: 'OK',
                            });
                        }else{
                            this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                    })
                })
         }
     },
     
     handleFrozens(type){
           this.$confirm('你确定要修改').then( () => {
            this.axios({
                    url:"/api/admin/xlm/fire/inspection/close",
                    method:"post",
                    data:{
                        id:this.unitId,
                        type
                    }
            }).then (  res => {
                if ( res.data.code == 0 ) {
                    this.getData()
                    this.$alert(res.data.msg, '提示', {
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
    leftChange(data){
        var list = this.ruleForm.qrList.concat(data)
        this.$set(this.ruleForm,'qrList',list)
    },
    getData () {
            if( this.unitId ){
                this.axios({
                    url:"/api/admin/xlm/fire/inspection/list",
                    method:"post",
                    data:{
                        unitId:this.unitId,
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                    }
                }).then( res => {
                     if( res.data.code == 0){
                         this.tableData = res.data.data.data.list
                         this.total = res.data.data.data.total
                         this.isClose =res.data.data.isClose
                    }
                })
            }
       },
    editData (id) {//查看巡检任务
        this.axios({
            url:"/api/admin/xlm/fire/inspection/single",
            method:"post",
            data:{
                id
            }
        }).then( res =>{
            if( res.data.code == 0){
                this.dialogVisible= true
                this.ruleForm = res.data.data
            }
        })
    },
    handleDelete (id) {//删除巡检任务
        this.$confirm('你确定要删除吗').then( () => {
                this.axios({
                url:"/api/admin/xlm/fire/inspection/delete",
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
    getOptions () {//获取设备和人员下拉框
         this.axios({
                url:"/api/admin/user/list",
                method:"post",
                data:{
                    pageNum: 1,
                    pageSize: 9999,
                    unitId: this.unitId,
                }
            }).then ( res => {
                this.peopleOptions = res.data.list
            })
        
    },
    getQlist(type){
        if( type==1 ){
            this.axios({
                url:"/api/admin/device/qr/list",
                method:"post",
                data:{
                    pageNum: 1,
                    pageSize: 9999,
                    unitId: this.unitId,
                }
            }).then ( res => {
                this.routeData = res.data.list
            })
        }else{
            
        }
    },
    handleSubmit (formName) {//提交
        this.$refs[formName].validate((valid) => {
            if (!valid) {
                this.$alert('添加数据失败,请填完必填字段!', '提示', {
                    confirmButtonText: 'OK',
                });
                return false
            } else {
                this.$confirm('你确定要提交吗')
                    .then(()=> {
                        let url=""
                        if( this.ruleForm.id ){
                            url="/api/admin/xlm/fire/inspection/update"
                        }else{
                            url="/api/admin/xlm/fire/inspection/add"
                        }
                        this.axios({
                            url,
                            method:"post",
                            data:{
                                ...this.ruleForm,
                            }
                        }).then( res => {
                            if ( res.data.code == 0 ) {
                                this.getData()
                                this.$alert("成功", '提示', {
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
       FrozenSubmit (formName) {//提交
        this.$refs[formName].validate((valid) => {
            if (!valid) {
                this.$alert('添加数据失败,请填完必填字段!', '提示', {
                    confirmButtonText: 'OK',
                });
                return false
            } else {
                this.$confirm('你确定要提交吗')
                    .then(()=> {
                        this.axios({
                            url:"/api/admin/xlm/fire/inspection/update",
                            method:"post",
                            data:{
                                ...this.FrozenForm,
                            }
                        }).then( res => {
                            if ( res.data.code == 0 ) {
                                this.getData()
                                this.$alert("成功", '提示', {
                                    confirmButtonText: 'OK',
                                });
                                this.closeFrozen()
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
    closedialog () {//关闭
          this.dialogVisible = false
          this.dialogVisible1 = false
          this.handleReset()
    },
    closedialog1 () {//关闭
          this.detailFlag = false
          this.detailFlag1 = false
    },
    handleReset () {//重置
          Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
          this.ruleForm.unitId = this.unitId
          this.ruleForm.issuer = sessionStorage.getItem('user_id')
          this.$set(this.ruleForm,'id','')
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
            this.addFalg = false
        }else{
            this.addFalg = true
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
        this.ruleForm.issuer = sessionStorage.getItem('user_id')
        this.ruleForm.unitId = Number(sessionStorage.getItem('unitId'))
        this.unitId =Number(sessionStorage.getItem('unitId'))
        if(this.userType==3){
            this.getOptions()
            this.getData()
        }
    },
}
</script>

<style lang="scss" >
    #er_polling_task{
        .el-table:before{
            width:0;
        }
        .el-select{
            height: auto;
        }
        .el-input{
            width:230px;
            display: inline-block;
            height: auto;
        }
        .el-date-editor{
            width: 230px!important;
        }
        .el-transfer-panel{
            width: 260px;
            .el-transfer-panel__item.el-checkbox .el-checkbox__label{
                width: auto;
                overflow:inherit;
            }
        }
        .el-transfer-panel__body{
            height:260px;
            .el-checkbox{
                display:block;
            }
        } 
        .el-transfer{
            text-align:center;
        }
        .el-transfer__button:nth-child(2){
            margin-left:8px;
        } 
        .transfer .el-button{
            margin-left: 0!important;
        }
        .el-select .el-input__icon{
            height: 100%;
        }
        .el-table th div{
            line-height: normal
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