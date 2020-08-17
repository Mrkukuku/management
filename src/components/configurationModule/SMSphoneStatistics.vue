<template>
    <!-- 短信电话统计模块 -->
    <div class="SMSphoneStatistics allcontent">
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
                :props="treedefaultProps" 
                @node-click="handleNodeClick" 
                :render-content="renderContent"
                highlight-current
                :filter-node-method="filterNode"
                ref="tree"
                ></el-tree>
            </div>
        </el-col>
        <el-col :span="userType==3&&24||20" style="height:100%;">
            <div class="top">
                开始结束时间:
                <el-date-picker
                    v-model="startEndTime"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                </el-date-picker>
                &nbsp;
                类型: <el-select v-model="type" placeholder="请选择">
                    <el-option
                    v-for="item in smsPhoneTypeData"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
                <template v-if="unitType==0||unitType==1">
                    <el-button type="success" @click="openSmsPhone">短信电话发送设置</el-button>
                </template>
            </div>
            <div class="bottom">
                <!-- 表格 -->
                    <el-table
                        :data="tableData"
                        border
                        height="600"
                        style="width: 100%">
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        prop="createdTime"
                        label="时间"
                        width="150">
                        </el-table-column>
                        <el-table-column
                        prop="typeName"
                        label="类型"
                        width="100">
                        </el-table-column>
                        <el-table-column
                        prop="caller"
                        label="主叫号码"
                        width="120">
                        </el-table-column>
                     
                        <el-table-column
                        prop="callee"
                        label="被叫号码"
                        width="120">
                        </el-table-column>

                            <el-table-column
                            prop="duration"
                            label="通话时间"
                            width="80">
                            <template slot-scope="scope"> 
                                {{ scope.row.duration&&scope.row.duration||0 }} s
                            </template>
                            </el-table-column>
                            <el-table-column
                            prop="ringTime"
                            label="响铃时间"
                            width="160">
                            </el-table-column>
                            <el-table-column
                            prop="originateTime"
                            label="呼叫发起时间"
                            width="160"
                            >
                            </el-table-column>
                            <el-table-column
                            prop="startTime"
                            label="接通开始时间"
                            width="160"
                            >
                            </el-table-column>
                            <el-table-column
                            prop="endTime"
                            label="通话结束时间"
                            width="160"
                            >
                            </el-table-column>
                        </el-table-column>
                         <el-table-column
                        prop="duration"
                        label="是否接通"
                        width="80">
                         <template slot-scope="scope"> 
                            {{ scope.row.duration&&'接通'||'未接通' }}
                        </template>
                         </el-table-column>
                        <el-table-column
                        prop="content"
                        label="内容"
                         width="450"
                        >
                        </el-table-column>
                    </el-table>
                <!-- 分页 -->
                <div class='page_all'>
                    <pagination :total='total' ref="paginationChild"  @pageChange="pageChange"></pagination>
                </div>
            </div>
            <el-dialog 
              title="设置" 
              :visible.sync="smsPhoneVisible"
              :before-close="closeSmsPhone"
              >
                <el-form :model="ruleForm" ref="ruleForm" :rules="rule" label-width="152px" class="demo-ruleForm">
                    <el-form-item label="短信">   
                        <el-radio v-model="ruleForm.smsOpen" label="1">开启</el-radio>
                        <el-radio v-model="ruleForm.smsOpen" label="0">关闭</el-radio>
                    </el-form-item>
                    <el-form-item label="电话">   
                        <el-radio v-model="ruleForm.vmsOpen" label="1">开启</el-radio>
                        <el-radio v-model="ruleForm.vmsOpen" label="0">关闭</el-radio>
                    </el-form-item>
                    <el-form-item label="月最大短信发送量">   
                        <el-input v-model="ruleForm.maxSmsCount" placeholder="默认无限量"></el-input>
                    </el-form-item>
                    <el-form-item label="月最大电话拨打量">   
                        <el-input v-model="ruleForm.maxVmsCount" placeholder="默认无限量"></el-input>
                    </el-form-item>
                     <el-form-item label="接收报警单位" prop="receiveAlarmUnitIds">   
                        <el-select v-model="ruleForm.receiveAlarmUnitIds" filterable multiple placeholder="请选择单位" >
                                <el-option
                                v-for="item in unitOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                >
                                </el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="通知人员" prop="notificationUids">   
                        <el-select v-model="ruleForm.notificationUids" filterable  multiple @change="peopleChange">
                            <el-option
                            v-for="item in peopleOptions"
                            :key="item.id"
                            :label="item.username"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    
                   
                     <el-form-item 
                     :label="item.notificationUname"
                     v-for="(item, index) in ruleForm.notificationUserList" 
                     prop="notificationUserList" 
                     :key="item.notificationUid"
                      v-if="item.notificationUid">   
                          <el-input v-model="item.notificationPhone" ></el-input> 
                    </el-form-item>
                   
                     <el-form-item label="报警延迟时间" prop="delayTime">   
                          <el-input v-model="ruleForm.delayTime" ></el-input> 分
                    </el-form-item>
                    
                     <el-form-item label="多报警信息通知时间" >   
                        <el-input v-model="ruleForm.alarmMoreMinute" ></el-input> 分
                    </el-form-item>
                     <el-form-item label="多报警信息通知条数">   
                       <el-input v-model="ruleForm.alarmMoreCount" ></el-input> 条
                    </el-form-item>
                     <el-form-item label="同一点位报警间隔时间">   
                        <el-input v-model="ruleForm.alarmIntervalTime" ></el-input> 分
                    </el-form-item>
                     <el-form-item label="复位后通知时间">   
                        <el-input v-model="ruleForm.resetLateDefaultTime" ></el-input> 分
                    </el-form-item>
                    
                     <el-form-item label="允许短信发送时间" prop="smsTime">   
                        <el-time-picker
                            v-model="ruleForm.smsStartTime"
                            format="HH:mm"
                            placeholder="默认全天">
                        </el-time-picker> - 
                        <el-time-picker
                            v-model="ruleForm.smsEndTime"
                            format="HH:mm"
                            placeholder="默认全天">
                        </el-time-picker>
                    </el-form-item>
                     <el-form-item label="允许电话拨打时间" prop="vmsTime">   
                        <el-time-picker
                            v-model="ruleForm.vmsStartTime"
                            format="HH:mm"
                            placeholder="默认全天">
                        </el-time-picker> -
                        <el-time-picker
                            v-model="ruleForm.vmsEndTime"
                            format="HH:mm"
                            placeholder="默认全天">
                        </el-time-picker>
                    </el-form-item>
                     <!-- <el-form-item label="测试起始时间">   
                       <el-time-picker
                            v-model="ruleForm.testStartTime"
                            format="HH:mm"
                           >
                        </el-time-picker> - 
                        <el-time-picker
                            v-model="ruleForm.testEndTime"
                            format="HH:mm"
                            >
                        </el-time-picker>
                    </el-form-item> -->
                    

                    <el-form-item class="formfooter">
                            <el-button type="primary" @click="handleSubmit('ruleForm')">立即提交</el-button>
                            <el-button @click="closeSmsPhone">取 消</el-button>
                        </el-form-item>
                </el-form>
            </el-dialog>
        </el-col>
    </div>
</template>
<script>
import pagination from '../Children/Pagination'
export default {
    data(){
        var sms=(rule, value, callback) => {
            if(this.ruleForm.smsStartTime || this.ruleForm.smsEndTime){
                if(this.ruleForm.smsEndTime&&this.ruleForm.smsStartTime){
                    var date1=new Date(this.ruleForm.smsStartTime)
                    var date2=new Date(this.ruleForm.smsEndTime)
                    if(date1.getTime()< date2.getTime()){
                        callback();
                    }else{
                        callback(new Error('开始时间不能大于结束时间'))
                    }
                }else{
                    callback();
                }
            }else{
                callback();
            }
        }
        var vmsTime=(rule, value, callback) => {
            if(this.ruleForm.vmsStartTime || this.ruleForm.vmsEndTime){
                if(this.ruleForm.vmsEndTime&&this.ruleForm.vmsStartTime){
                    var date1=new Date(this.ruleForm.vmsStartTime)
                    var date2=new Date(this.ruleForm.vmsEndTime)
                    if(date1.getTime()< date2.getTime()){
                        callback();
                    }else{
                        callback(new Error('开始时间不能大于结束时间'))
                    }
                }else{
                    callback();
                }
            }else{
                callback();
            }
        }
         var phone=(rule, value, callback)=>{
            if(value){
                var phone = /^0\d{2,3}-\d{7,8}$/;
                var mobile=/^1[3|5|8|4|6|7|9]\d{9}$/;
                let flag = false
                value.map( item =>{
                    if(!(phone.test(item.notificationPhone)||mobile.test(item.notificationPhone))){
                      flag = true
                    }
                })
                if(flag){
                     callback(new Error('请确认手机格式'));
                }else{
                    callback()
                }
            }else{
                callback(new Error('请输入联系方式'));
            }
            
        }
        return{
            peopleOptions:[],//人员列表
            unitOptions:[],//单位列表
            userType:'',//用户类型
            Treedata:[],//单位集合数据,
            tableData:[],//列表数据
            total:0,//总数
            pageSize:10,
            pageNum:1,
            unitType:-1,
            unitId:'',//选中单位
            filterText:'',//过滤的值
            treedefaultProps: { //树
                children: 'children',
                label: 'label'
            },
            smsPhoneTypeData:[
                {
                    name:"全部",
                    value:''
                },
                {
                    name:"短信",
                    value:'1'
                },
                {
                    name:"电话",
                    value:'2'
                }
            ],
            type:'',//选择类型
            smsPhoneTotal:'',//电话短信总数
            startEndTime:'',//开始结束时间
            smsPhoneVisible:false,//短信电话设置弹框
            ruleForm:{
                smsOpen:'0',//短信是否开启
                vmsOpen:'0',//电话是否开启
                maxSmsCount:'',//月最大发送量
                maxVmsCount:'',//电话最大拨打量
                smsStartTime:'',//允许发送短信时间
                smsEndTime:'',
                vmsStartTime:'',//允许电话拨打时间
                vmsEndTime:'',
                alarmMoreMinute:2,
                alarmMoreCount:5,
                alarmIntervalTime:15,
                testStartTime:"",
                testEndTime:"",
                resetLateDefaultTime:1,
                receiveAlarmUnitIds:[],
                delayTime:1,
                notificationVo:[],
                notificationUserList:[],
                unitId:'',
                notificationUids:[]
            },
            rule:{
                smsTime:[{ validator:sms, trigger: 'blur' }],
                vmsTime:[{validator:vmsTime, trigger: 'blur' }],
                notificationUids:[{required: true, message: '请选择人员', trigger: 'blur' },],
                receiveAlarmUnitIds:[{required: true, message: '请选择单位', trigger: 'blur' },],
                notificationUserList: [
                    {validator: phone, required: true, trigger: 'blur' },
                ],
            },
            pickerOptions: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
                }
            }],
            },
          timer:''
        }
    },
    components:{
        pagination:pagination
    },
    methods:{
        peopleChange(uids){
            var _this=this;
            clearTimeout(this.timer)
            if( uids.length){
                this.timer = setTimeout( ()=>{
                    _this.axios({
                        url:'/api/admin/user/select/list',
                        method:'post',
                        data:{
                            uids
                        }
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.ruleForm.notificationUserList = res.data.data.notificationUserList
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                    })
                },1500)
            }else{
                this.ruleForm.notificationUserList = []
            }

        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.pageNum = item.page_index;
            this.pageSize = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
        getData(){//获取列表数据
            var _this=this;
            var startTime='';
            var endTime='';
            if(this.startEndTime!=''){
                startTime=this.startEndTime[0];
                endTime=this.startEndTime[1];
            }
            this.axios({
                url:'/api/admin/sms/send/record/list',
                method:'post',
                data:{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    unitId:this.unitId,
                    type:this.type,
                    startTime:startTime,
                    endTime:endTime
                }
            }).then(res=>{
                if(res.data.code==0){
                        _this.tableData=res.data.list;
                        for(var i in _this.tableData){
                            _this.tableData[i].createdTime=this.$moment(_this.tableData[i].createdTime).format("YYYY-MM-DD HH:mm"); 
                            if(_this.tableData[i].type==1){
                                _this.tableData[i].typeName="短信"
                            }else{
                                _this.tableData[i].typeName="电话"
                            }
                        }
                        _this.total=res.data.total;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        handleNodeClick(data) { //点击树节点
            this.unitId=data.id;
            this.unitType=data.type;
            this.pageSize = 10
            this.pageNum = 1
            this.getData();
        },
        filterNode(value, data) {//树节点筛选
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //树节点方法
        renderContent(h, { node, data}) {//树前小图标
            return (
              <span>
                <i class={data.icon}></i>
                &nbsp;<span>{node.label}</span>
              </span>
              );
        },
        getTree(){//获取树数据
            var _this=this;
            this.axios({
                url   :"/api/admin/unit/list.left",
                method: 'post',
                data  : {
                    pageNum:1,
                    pageSize:1000,
                }
            }).then(res=>{
                if(res.data.code==0){
                    if(res.data.data){
                        _this.Treedata=res.data.data;
                    } 
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        openSmsPhone(){//打开短信电话设置
            var _this=this;
            this.axios({
                url:'/api/admin/sms/config/single',
                method:'post',
                data:{
                    id:this.unitId,
                }
            }).then(res=>{
                if(res.data.code==0){
                    if(res.data.data!=null){
                        _this.ruleForm=res.data.data;
                        _this.ruleForm.smsOpen=String(_this.ruleForm.smsOpen)
                        _this.ruleForm.vmsOpen=String(_this.ruleForm.vmsOpen)
                    }
                    this.getOptions()
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
            this.smsPhoneVisible=true;
        },
         getOptions () {//获取设备和人员下拉框
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
                // this.unitOptions.map( (item,index) => {
                //     if ( item.id == sessionStorage.getItem('unitId') ) {
                //         indexs = index
                //     }
                // })
                // this.unitOptions.splice(indexs,1)
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
        closeSmsPhone(){//关闭短信电话设置
            this.smsPhoneVisible=false;
            Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
        },
        handleSubmit(name){//电话短信发送设置
            var _this=this; 
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.ruleForm.unitId=this.unitId
                    this.axios({
                        url   :"/api/admin/sms/config",
                        method: 'post',
                        data  : this.ruleForm
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('设置成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.closeSmsPhone();
                                }
                            });
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                    })
                }
            })
        },
        search(){//模糊查询信息列表
            this.pageNum=1;
            this.$refs.paginationChild.changePageNum(this.pageNum);
            this.getData();
        },
        resetSearch(){//重置模糊查询字段
            this.startEndTime='';
            this.type='';
            this.getData();
        }
    },
    mounted(){
        this.getTree();
        this.userType = sessionStorage.getItem('userTypes');
        if( this.userType == 3 ){
            this.unitType = 1;
        }
        this.unitId = Number(sessionStorage.getItem('unitId'));
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    }
}
</script>
<style lang="scss" scoped>
    .SMSphoneStatistics{
        /deep/ .el-dialog{
            width: 650px !important;
            .el-date-editor ,.el-input{
                width: 200px!important;
            }
        }
        .top{
            .el-date-editor{
                width: 313px!important;
            }
        }
        .page_all{
            position: absolute;
            bottom: -3px;
        }
         /deep/ .el-select{
            height: auto;
            width: auto;
        }
         /deep/ .el-input{
            height: auto;
        }
        /deep/ .el-select .el-input__icon{
            height: 100%;
            line-height: 28px!important;
        }
    }
     
</style>