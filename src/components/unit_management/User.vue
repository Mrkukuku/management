<template>
<!-- 用户管理 -->
    <div id="usermanagement" class="allcontent">
        <!-- 导航树 -->
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
                >
                </el-tree>
            </div>
        </el-col>

        <el-col :span="20" style="height:100%;">
            <!-- 头部 -->
            <div class="top">
                <div>
                    姓名:
                    <el-input v-model="name"></el-input>&nbsp;&nbsp;
                    手机号:<el-input v-model="phone"></el-input>
                    用户类型: <el-select v-model="selectType" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.roleId"
                            :label="item.roleName"
                            :value="item.roleId">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click='searchsubmit'>查询</el-button>
                    <el-button @click='searchreset'>重置</el-button>
                    <el-button type="primary" @click="opendialog"><i class="el-icon-plus"></i> 新增</el-button>
                    <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :http-request="uploadsFile"
                    style="display:inline-block"
                    :show-file-list="false"
                    :limit="1"
                    ref="my-upload"
                    >
                    <el-button size="small" type="primary" :disabled="fileLoading">导入</el-button>
                    </el-upload>
                    <el-button type="primary" @click='downFile'>下载模板</el-button>
                </div>
            </div>
            <!-- 新增弹框 -->
            <el-dialog
                title="添加修改人员信息"
                :visible.sync="dialogVisible"
                width="30%"
                class='dialog'
                :close-on-click-modal="false"
                :before-close="closedialog">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :data="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="姓名" prop="username">   
                            <el-input v-model="ruleForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="账号" prop="account">
                            <el-input v-model="ruleForm.account" auto-complete="off"></el-input>
                        </el-form-item>
                        <template v-if="updateVisible">
                            <el-form-item label="密码" prop="password">
                                <el-input type="password" v-model="ruleForm.password" @input="change($event)"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="repassword">
                                <el-input type="password" v-model="ruleForm.repassword" @input="change($event)"></el-input>
                            </el-form-item>
                        </template>
                        <template v-if="(ruleForm.userType!=3 && ruleForm.userType!=2)">
                            <el-form-item label="用户类型" prop="userType">
                                <el-select v-model="ruleForm.userType" placeholder="请选择" @change="userChange">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.roleId"
                                        :label="item.roleName"
                                        :value="item.roleId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                        <!-- <template v-if="ruleForm.userType==6"> -->
                            <el-form-item label="是否持证" prop="certificated">
                                <el-radio v-model="ruleForm.certificated" label="0">否</el-radio>
                                <el-radio v-model="ruleForm.certificated" label="1">是</el-radio>
                            </el-form-item>
                        <!-- </template> -->
                        <template v-if="ruleForm.userType==6||ruleForm.userType==4||ruleForm.userType==5">
                            <el-form-item label="">
                               <el-checkbox-group v-model="ruleForm.fireControlPermissions" >
                                    <el-checkbox :label="1">巡检填表</el-checkbox>
                                    <el-checkbox :label="2">值班填表</el-checkbox>
                                    <el-checkbox :label="3">人员交接</el-checkbox>
                            </el-checkbox-group>
                            </el-form-item>
                        </template>
                        <!-- <template v-if="ruleForm.certificated==1"> -->
                            <el-form-item label="证书编号" :rules="[{ required: ruleForm.certificated==1,message: '请填写证书编号', trigger: 'blur' }]">
                                <el-input  v-model="ruleForm.certificateNumber"></el-input>
                            </el-form-item>
                            <el-form-item label="证书照片" :rules="[{ required: ruleForm.certificated==1,message: '请上传证书照片', trigger: 'blur'}]">
                            <el-upload
                                class="avatar-uploader"
                                action=""
                                ref="upload1"
                                accept=".jpg,.png,.JPG,.PNG"
                                :show-file-list="false"
                                :on-change="beforeUpload1"
                                :auto-upload="false">
                                <img v-if="posterURL1" :src="posterURL1" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <el-button @click="uploads(1)">上传</el-button>
                            <el-button @click="resetUploads1">取消</el-button>
                        </el-form-item>
                        <!-- </template> -->
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="ruleForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="ruleForm.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="上传头像" prop="avatar">
                            <el-upload
                                class="avatar-uploader"
                                action=""
                                accept=".jpg,.png,.JPG,.PNG"
                                :show-file-list="false"
                                :on-change="beforeUpload"
                                :auto-upload="false">
                                <img v-if="posterURL" :src="posterURL" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <el-button @click="uploads(2)">立即上传</el-button>
                            <el-button @click="resetUploads">取消</el-button>
                        </el-form-item>
                        <el-form-item label="账号描述" prop="description">
                            <el-input type="textarea" v-model="ruleForm.description"></el-input>
                        </el-form-item>
                        <el-form-item class="formfooter">
                            <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                            <!-- <el-button @click="handleReset('ruleForm')">重置</el-button> -->
                            <el-button @click="closedialog">取 消</el-button>
                        </el-form-item>
                    </el-form>
            </el-dialog>

            <!-- 冻结弹框 -->
            <el-dialog
                title="冻结账号"
                :visible.sync="FrozenVisible"
                width="30%"
                :close-on-click-modal="false"
                :before-close="closeFrozen">
                    <el-form :rules="rulesFrozen" :model="FrozenForm" :data="FrozenForm" status-icon  ref="FrozenForm" label-width="130px" class="demo-ruleForm FrozenForm">
                        <el-form-item label="冻结时间" prop="time">
                            <el-date-picker
                                v-model="FrozenForm.time"
                                type="datetimerange"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                :picker-options="expireTimeOption"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="封号原因" prop="frozenDesc">
                            <el-input type="textarea" v-model="FrozenForm.frozenDesc"></el-input>
                        </el-form-item>
                        <el-form-item class="formfooter">
                            <el-button type="primary" @click="FrozenSubmit('FrozenForm')">冻结</el-button>
                            <!-- <el-button @click="FrozenReset('FrozenForm')">重置</el-button> -->
                            <el-button @click="closeFrozen">取 消</el-button>
                        </el-form-item>
                    </el-form>
            </el-dialog>

            <el-dialog
                title="添加修改数据"
                :visible.sync="workVisibleList"
                class='workDialog'
                :close-on-click-modal="false"
                :before-close="closeWorkList">
                    <template v-if="workTypeFlag==true">
                        <!-- 人员模糊查询 -->
                        <div class="personTop">
                            <el-button type="primary" @click="addPersonWorkTime">新增</el-button>
                        </div>
                        <!-- 工作列表 -->
                        <el-table
                            :data="workTimeData"
                            border
                            style="width: 100%">
                            <el-table-column   									
                            prop="start"
                            label="开始时间"
                            width="250">
                            </el-table-column>
                            <template v-if="workType==1">
                                <el-table-column
                                prop="end"
                                label="结束时间"
                                width="250">
                                </el-table-column>
                            </template>
                            <el-table-column label="操作">
                                <template slot-scope='scope'>
                                    <el-button
                                    size="mini"
                                    type="danger"
                                    @click="deletePersonData(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                    <template v-else>
                        <el-radio v-model="workType" label="1">排班制</el-radio>
                        <el-radio v-model="workType" label="2">24小时制</el-radio>
                        <el-radio v-model="workType" label="3">无限制</el-radio>
                        <div style="margin-top:20px;text-align:center">
                            <el-button @click="submitWorkType">保存</el-button>
                            <el-button @click="closeWorkList"> 取消</el-button>
                        </div>
                        
                    </template>
                        <el-dialog
                            title="人员信息"
                            :visible.sync="personAddTimeDialog"
                            width="40%"
                            :close-on-click-modal="false"
                            class='dialog'
                            :append-to-body="true"
                            :before-close="personAddTimeDialogFun">
                            
                                <el-form :model="timeDayForm" :rules="timeDayRules" ref="timeDayForm" label-width="150px" class="demo-ruleForm">
                                    <el-form-item label="上班时间" prop="type1">
                                        <el-select v-model="timeDayForm.startWeek" placeholder="请选择">
                                            <el-option
                                                v-for="item in weekData"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                        <el-time-picker
                                            v-model="timeDayForm.startTime"
                                            format='HH:mm'     
                                            placeholder="任意时间点">
                                        </el-time-picker>
                                    </el-form-item>
                                    <template v-if="workType==1">
                                         <el-form-item label="下班时间" prop="type2">
                                            <el-select v-model="timeDayForm.endWeek" placeholder="请选择">
                                                <el-option
                                                    v-for="item in weekData"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                            <el-time-picker
                                                v-model="timeDayForm.endTime"
                                                format='HH:mm'     
                                                placeholder="任意时间点">
                                            </el-time-picker>
                                        </el-form-item>
                                    </template>
                                   
                                    <el-form-item style="margin-left:100px">
                                        <el-button type="primary" @click="personTimeSubmit('timeDayForm')" v-noMoreClick>保存</el-button>
                                        <el-button @click="personAddTimeDialogFun">取消</el-button>
                                    </el-form-item>
                                </el-form>


                        </el-dialog>
            </el-dialog>

            <!-- 内容 -->
            <div class="bottom" v-loading="fileLoading">
                <!-- 表格 -->
                    <el-table
                        :data="tableData"
                        border
                        @selection-change="SelectionChange"
                        style="width: 100%">
                        <el-table-column
                        prop="username"
                        label="姓名"
                        width="120">
                        </el-table-column>
                        <el-table-column
                        prop="account"
                        label="账号"
                        width="230">
                        </el-table-column>
                        <el-table-column
                        prop="userTypeDesc"
                        label="用户类型"
                        width="120">
                        </el-table-column>
                        <el-table-column
                        prop="email"
                        label="邮箱"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="phone"
                        label="手机号"
                        width="160">
                        </el-table-column>
                        <el-table-column label="操作"
                        >
                        <template slot-scope='scope'>
                            <el-button
                                size="mini"
                                type="success"
                                @click="handleWork(scope.row.id)">上班时间</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="editData(scope.row.id)">编辑</el-button>
                            <span v-if="scope.row.userType==3||scope.row.userType==2">
                                <el-button
                                    size="mini"
                                    type="danger"
                                    :disabled="true"
                                    @click="handleDelete(scope.row.id)">删除
                                </el-button>
                            </span>
                            <span v-else>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.row.id)">删除
                                </el-button>
                            </span>
                            <span v-if="Jurisdiction!=scope.row.id">
                                <el-button
                                size="mini"
                                type="success"
                                plain
                                class='el-icon-refresh'
                                @click="handleResetPassword(scope.row.id)">重置密码</el-button>
                            </span>
                            <span v-if="Jurisdiction!=scope.row.id">
                                <span v-if="scope.row.isFrozen==true">
                                    <el-button
                                    size="mini"
                                    type="success"
                                    class='Frozen'
                                    @click="handleFrozen(scope.row.id,scope.row.isFrozen)"
                                    >解冻</el-button>
                                </span>
                                <span v-else>
                                    <el-button
                                    size="mini"
                                    type="warning"
                                    class='Frozen'
                                    @click="handleFrozen(scope.row.id,scope.row.isFrozen)"
                                    >冻结</el-button>
                                </span>
                            </span>
                        </template>                            
                        </el-table-column>
                    </el-table>
                <!-- 分页 -->

                <div class='page_all'>
                    <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
                    <!-- <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="rows"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination> -->
                </div>
            </div>
        </el-col>
    </div>
</template>

<script>
import pagination from '../Children/Pagination'
import {Common} from './../../js/common'
import { mapMutations } from 'vuex';
export default {
    mixins:[Common],
    data(){
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再一次输入密码'));
            } else if (value !== this.ruleForm.password) {
            callback(new Error('两次密码不一致，请重新输入!'));
            } else {
            callback();
            }
        };

        var type1 = (rule, value, callback) => {
            if (this.timeDayForm.startWeek== ''|| this.timeDayForm.startTime=='') {
                callback(new Error('上班时间不能为空'))
            }else{
                callback();
            }
        };
        var type2 = (rule, value, callback) => {
            if (this.timeDayForm.endWeek== ''|| this.timeDayForm.endTime=='') {
                callback(new Error('下班时间不能为空'))
            }else{
                if(this.timeDayForm.endWeek<this.timeDayForm.startWeek){
                    callback(new Error('开始上班不能大于结束上班天'))
                }else if(this.timeDayForm.endWeek==this.timeDayForm.startWeek){
                    var date1=Date.parse(this.timeDayForm.startTime);
                    var date2=Date.parse(this.timeDayForm.endTime);
                    console.log(date1)
                    if(date1>date2){
                        callback(new Error('上班时间点不能大于下班时间点'))
                    }else{
                        callback();
                    }
                }else{
                    if(this.timeDayForm.endWeek-this.timeDayForm.startWeek>=2){
                        callback(new Error('上班时间下班时间不能隔两天'))
                    }else{
                        callback();
                    }
                }
            }
        };
        var phone=(rule, value, callback)=>{
            if(value){
                var phone = /^0\d{2,3}-\d{7,8}$/;
                var mobile=/^1[3|5|8|4|6|7|9]\d{9}$/;
                if(phone.test(value)||mobile.test(value)){
                    callback();
                }else{
                    callback(new Error('手机号格式出错'));
                }
            }else{
                callback(new Error('请输入联系方式'));
            }
            
        }
        return {
            module:'user',  //模块
            name:'',   //搜索框名字
            company:'',  //搜索框公司
            phone:'',    //搜索框电话
            Jurisdiction:sessionStorage.getItem('user_id'),//用户权限
            companyId:sessionStorage.getItem('unitId'),//单位id
            posterURL:'',//头像
            posterURL1:'',//头像
            upload:'',//头像
            upload1:'',//头像
            userType:sessionStorage.getItem('userTypes'),
            updateVisible:true,//是否显示密码框
            options: [],     //下拉框数据
            ruleForm: {     //表格字段
                companyId:'',
                id:null,
                account: '',   //账号
                password:'',   //密码
                repassword:'',   //确认密码
                username:'',    //姓名
                userTypeDesc:'',   //用户类型
                userType:'',    //用户类型
                email:'',       //邮箱
                phone:'',       //电话
                description:'', //账号描述
                avatar:'' ,      //头像
                certificateImage:'' ,      //头像
                certificated:'0',//是否持证
                certificateNumber:"",
                fireControlPermissions:[1]
            },
            rules: {    //表格字段验证
                account: [
                    { required: true, message: '请输入账户名', trigger: 'blur' },
                    /* {max:10,min:2, message: '用户名长度在2到10个字符之间', trigger: 'blur' } */
                ],
                username: [
                    { required: true,message: '请输入姓名', trigger: 'blur' },
                    {max:10,min:2, message: '姓名长度在2到10个字符之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {max:15,min:6, message: '密码长度在6到15个字符之间', trigger: 'blur' }
                ],
                repassword: [
                    {validator: validatePass2, required: true, trigger: 'blur' },
                ],
                email: [
                    { required: false, message: '请输入邮箱', trigger: 'blur' },
                    {type:'email', message: '邮箱格式不正确', trigger: 'blur' },
                ],
                phone: [
                    {validator: phone, required: true, trigger: 'blur' },
                ],
                description: [
                    { required: false, message: '请输入账号描述', trigger: 'blur' },
                    
                ],
                certificated: [
                    { required: false, message: '请选择是否持证', trigger: 'blur' },
                    
                ],
                userType: [
                    { required: true, message: '请选择账号类型', trigger: 'blur' },
                    
                ],
                avatar: [
                    { required: false,message: '请选择头像', trigger: 'blur' },                   
                ],
                certificateImage: [
                    { required: true,message: '请上传证书图片', trigger: 'blur' },                   
                ],
                certificateNumber: [
                    { required: true,message: '请填写证书编号', trigger: 'blur' },                   
                ],
            },
            FrozenForm:{    //冻结窗口
                time:'',    //冻结时间
                frozenDesc:'',//冻结原因
                unitId:null   //冻结id
            },
            rulesFrozen:{   //表格验证字段
                time: [
                    {required: true, message: '冻结时间', trigger: 'blur' }
                ],
                frozenDesc: [
                    {required: true, message: '冻结原因', trigger: 'blur' }
                ],

            },
            treedefaultProps: {
                children: 'children',
                label: 'label'
            },
            expireTimeOption: {//时间范围
                disabledDate(date) {
                        return date.getTime()+24*60*60*1000 < Date.now();
                }
            },
            workVisibleList:false,//工作时间弹框
            workTimeData:[],//工作时间表格数据
            personAddTimeDialog:false,//上班时间弹框
            workType:'1',//值班类型
            workTypeFlag:false,//值班类型显示
            weekData:[
                {
                    id:1,
                    name:'星期一'
                },
                {
                    id:2,
                    name:'星期二'
                },
                {
                    id:3,
                    name:'星期三'
                },
                {
                    id:4,
                    name:'星期四'
                },
                {
                    id:5,
                    name:'星期五'
                },
                {
                    id:6,
                    name:'星期六'
                },
                {
                    id:7,
                    name:'星期日'
                },
                {
                    id:8,
                    name:'下周一'
                }
            ],
            userId:'',//用户id
            timeDayForm:{
                startWeek:'',//开始天
                startTime:'',//开始时间
                endWeek:'',//开始天
                endTime:'',//开始时间
            },
            timeDayRules:{
                type1:[{validator: type1, required: true, trigger: ['blur','change'] }],
                type2:[{validator: type2, required: true, trigger: ['blur','change']}]
            },
            page_index: 1, // 页码
            total: 10, // 总页数
            page_size: 10,//页数
            fileLoading:false,
            uid:sessionStorage.getItem('user_id'),
           selectType:''
        }
    },
    components:{
        pagination:pagination
    },
    methods:{
        ...mapMutations('routeJump',['changeLogin']),
        beforeUpload(file) {       //上传前
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'jpg'
            const extension2 = testmsg === 'png'
            const isLt2M = file.size / 1024 / 1024 < 5
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是jpg,png格式!',
                    type: 'warning'
                });
                this.$refs.upload.clearFiles();
                this.ruleForm.avatar=null;
                return ;
            }
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 5MB!',
                    type: 'warning'
                });
                this.$refs.upload.clearFiles();
                this.files = null;
                return ;
            }
            this.posterURL = URL.createObjectURL(file.raw);
            this.upload= file.raw;
        },
        beforeUpload1(file) {       //上传前
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'jpg'
            const extension2 = testmsg === 'png'
            const isLt2M = file.size / 1024 / 1024 < 5
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是jpg,png格式!',
                    type: 'warning'
                });
                this.$refs.upload1.clearFiles();
                this.ruleForm.certificateImage=null;
                return ;
            }
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 5MB!',
                    type: 'warning'
                });
                this.$refs.upload.clearFiles();
                this.files = null;
                return ;
            }
            this.posterURL1 = URL.createObjectURL(file.raw);
            this.upload1= file.raw;
        },
        uploads(type){  //上传图片
            var _this=this;
            let formdata = new FormData();
            if( type==2){
                formdata.append('file', this.upload);
            }else{
                 formdata.append('file', this.upload1);
            }
            formdata.append('fileType',2);
            this.axios({
                url   : "/api/admin/file/upload",
                method: 'post',
                data  :formdata
                }).then(res=>{    
                    if(res.data.code==0){
                        if(type==2){

                            _this.ruleForm.avatar=res.data.data.fileUrl;
                        }else{
                            _this.ruleForm.certificateImage=res.data.data.fileUrl;
                        }
                        _this.$alert('上传成功', '提示', {
                            confirmButtonText: 'OK',
                        });
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }                                             
                })
        },
        resetUploads(){//重置图片
            this.ruleForm.avatar=null;
            this.posterURL ='';
        },
        resetUploads1(){//重置图片
            this.ruleForm.certificateImage=null;
            this.posterURL1 ='';
        },
        handleExceed(){  //上传图片个数限制
            this.$message.warning("图片只能上传一张,");
        },
        //树节点方法
        renderContent(h, { node, data}) { //树前小图标
            return (
              <span>
                <i class={data.icon}></i>
                &nbsp;<span>{node.label}</span>
              </span>
              );
        },
        handleNodeClick(data) { //点击树节点
            this.companyId=data.id;
            this.rows = 10
            this.currentPage = 1
            this.getData();
        },
        handleResetPassword(id){//重置密码
            var _this=this;
            this.axios({
                url   : "/api/admin/user/reset.password",
                method: 'post',
                data  :{
                    uid:id
                }
            }).then(res=>{    
                if(res.data.code==0){
                    _this.$alert('重置成功', '提示', {
                        confirmButtonText: 'OK',
                    });
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }                                             
            })
        },
        searchreset(){  //条件查询重置
            this.name='';
            this.phone='';
            this.selectType='';
            this.searchsubmit()
        },
        searchsubmit(){     //条件查询
            var _this=this;
            this.currentPage = 1;
            this.$refs.paginationChild.changePageNum(this.currentPage)
            this.axios({
                url   :'/api/admin/user/list',
                method: 'post',
                data  : {
                    pageNum: this.currentPage,
                    pageSize: this.rows,
                    username:this.name,
                    unitId:this.companyId,
                    phone:this.phone,
                    userType:this.selectType,
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.tableData=res.data.list;
                    _this.total= res.data.total;
                    _this.currentPage= res.data.pageNum;
                    // _this.searchreset();
                }
            })
        },
        change(e) {},
        handleWork(id){//上班时间列表弹框打开
            this.userId=id;
            this.personTimeList();
            this.workVisibleList=true;
        },
        closeWorkList(){//关闭上班时间列表弹框
            this.workTypeFlag=false;
            this.workVisibleList=false;
        },
        submitWorkType(){//上班时间类型
            if(this.workType==3){
                this.closeWorkList();
            }else{
                this.workTypeFlag=true;
            }
        },
        addPersonWorkTime(){//打开上班时间弹框
            this.personAddTimeDialog=true;
        },
        personTimeList(){//人员上班时间列表
            var _this=this;
            this.axios({
                url   :'/api/admin/user/rota/list',
                method: 'post',
                data  : {
                    id:this.userId
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.workTimeData=res.data.data;
                    for(var i in _this.workTimeData){
                        _this.workTimeData[i].start='周'+_this.workTimeData[i].startWeek+',时间:'+_this.workTimeData[i].startTime;
                        _this.workTimeData[i].end='周'+_this.workTimeData[i].endWeek+',时间:'+_this.workTimeData[i].endTime;
                    }
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        personAddTimeDialogFun(){//关闭上班时间弹框
            this.personAddTimeDialog=false;
            this.workTypeFlag=false;
            Object.assign(this.$data.timeDayForm,this.$options.data().timeDayForm);
        },
        personTimeSubmit(name){//人员上班时间提交
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.timeDayForm.uid=this.userId;
                    var _this=this;
                    this.axios({
                        url   :'/api/admin/user/rota/add',
                        method: 'post',
                        data  : this.timeDayForm
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('添加成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:() => {
                                    _this.personAddTimeDialogFun();
                                    _this.personTimeList();
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
        deletePersonData(id){//删除人员时间点
            var _this=this;
            this.$confirm('你确定要删除吗')
                .then(()=> {
                    this.axios({
                        url   :'/api/admin/user/rota/delete',
                        method: 'post',
                        data  : {
                            id:id
                        }
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('删除成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:() => {
                                _this.personTimeList(); 
                                }
                            });
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                    })
                })
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.currentPage = item.page_index;
            this.rows = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
        DropdownData(){ //下拉框类型
            var _this=this;
            this.axios({
                url   :'/api/admin/user/type.add',
                method: 'post',
            }).then(res=>{
                if(res.data.code==0){
                    _this.options=res.data.data;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                } 
            })
        },
        getuser(){
          var _this=this;
          this.axios({
            method: 'post',
            url: '/api/admin/user',
          }).then(res=>{
              sessionStorage.setItem('user_id',res.data.data.id);
              sessionStorage.setItem('unitId',res.data.data.unitId?res.data.data.unitId:-1);
              sessionStorage.setItem('userTypes',res.data.data.userType);
              _this.$router.replace('/unitmanagement');
              _this.$store.state.routeJump.openTab = [];
              _this.$store.state.routeJump.activeIndex = '/unitmanagement';
              _this.companyId=res.data.data.unitId;
          })
        },
        downFile() {//下载单位导入模板
            location.href="https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/人员导入模板.xls";
        },
        uploadsFile(file){//导入单位
            var _this=this;
            let formdata = new FormData(); 
            formdata.append('multis',file.file );
            formdata.append('unitId',_this.companyId);
            this.fileLoading = true
            this.axios({
                url:"api/admin/user/batch/import",
                method:"post",
                data:formdata,
                dataType:'json',
            }).then( res => {
                if( res && res.status==200  ) {
                    if( res.data.code==0 ) {
                     this.fileLoading = false
                     this.$alert("导入成功"+res.data.data.successCount+"条\n导入失败"+res.data.data.errorCount+'条')
                     this.getData()
                     this.$refs['my-upload'].clearFiles();
                     if( this.instance ) {
                         this.instance.close()
                     }
                     if( res.data.data.errorCount ) {
                         this.instance =  this.$notify.error({
                            title: '提示',
                            dangerouslyUseHTMLString: true,
                            message: '<p style="cursor: pointer;">点击下载导入错误原因</p>',
                            duration: 0,
                            // onClick:_this.downErrorFlie,
                            position: 'bottom-right',
                            offset: 100
                        })
                        this.instance.onClick =  () => {
                            _this.downErrorFlie(res.data.data.id);
                        }
                     }
                    }else{
                        this.$alert(res.data.msg);
                    }
                }else{
                    this.fileLoading = false;
                    this.$alert("导入失败");
                    this.$refs['my-upload'].clearFiles();
                }
            })
        },
        downErrorFlie(id) {//下载错误的信息
            this.instance.close();
            if( id ) {
              location.href = "https://admin.dingrennet.cn/api/admin/user/backup?id="+id+"&uid="+this.uid;
            }
        },
        userChange(data){
            if(data==6){
                this.ruleForm.fireControlPermissions=[2,3]
            }else if( data==4 ){
                this.ruleForm.fireControlPermissions=[1]
            }
        }
    },
    created(){
        if(this.$route.query.token){
            this.changeLogin({ Authorization: this.$route.query.token});
            sessionStorage.setItem('user_name',this.$route.query.name); 
            this.getuser();
        }else{
            this.companyId=sessionStorage.getItem('unitId');
        }
        this.DropdownData()
    }
}
</script>
<style lang="scss">
    #usermanagement{
        .top{
            .el-input{
                width:180px;
                input{
                    height:32px;
                }
            }
           
        }
        .el-date-range-picker__editor{
            width:140px;
        }
        // .dialog{
            
        // }
        .el-dialog__body ul{
            background-color:#ffffff!important;
        }
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            width: 278px;
            height: 118px;
            position: relative;
            overflow: hidden;
            text-align: center;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 118px;
            line-height: 118px;
            text-align: center;
        }
        .avatar{
            width:278px!important;
            height: 138px!important;
            display: block;
        }
        .workDialog{
            .el-dialog{
                width: 700px!important;
                min-height: 400px;
            }
        }
        .demo-ruleForm{
            .el-input{
                width: 278px;
            }
        }
    }
    /deep/ .el-dialog{
        width: 700px!important;
        .el-input,.el-input--suffix{
            width:200px;
        }
        .el-select{
            width:200px;
        }
        .el-date-editor{
            width: 220px!important;
        }
    }
</style>
