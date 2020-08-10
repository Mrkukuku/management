<template >
    <!-- 演练模块 -->
    <div id="drillTaskmanagement" class='allcontent'>
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
        <el-col :span="20" style="height:100%;padding-left:10px;">
            <!-- 头部 -->
            <div class="top">
                演练名称:<el-input v-model="name" placeholder="搜索名称"></el-input>&nbsp;&nbsp;
                <!-- 演练类型:<el-select v-model="type" placeholder="请选择">
                            <el-option
                            v-for="item in typeData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select> -->
                完成类型:<el-select v-model="status" placeholder="请选择">
                    <el-option
                    v-for="item in statusData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
                选择时间:<el-date-picker
                    v-model="startTime"
                    align="right"
                    type="date"
                    placeholder="开始日期">
                    </el-date-picker>
                    - <el-date-picker
                    v-model="endTime"
                    align="right"
                    type="date"
                    placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" @click='searchData'>查询</el-button>
                <el-button type="primary" @click='searchreset'>重置</el-button>

                <el-button type="primary" @click="openDialog" :disabled="addAreaFlag">新增演练任务</el-button>
            </div>
            <div class="bottom">
                <!-- 表格 -->
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="name"
                    label="演练任务名称"
                    width="130">
                    </el-table-column>
                    <el-table-column
                    prop="unitName"
                    label="演练单位"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="managerUnitName"
                    label="发布单位"
                    width="150">
                    </el-table-column>
                    
                    <el-table-column
                    prop="chargeName"
                    label="负责人"
                    width="90">
                    </el-table-column>
                    <el-table-column
                    prop="typeName"
                    label="演练类型"
                    width="85">
                    </el-table-column>
                    <el-table-column
                    prop="endTime"
                    label="演练时间"
                    width="95">
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="演练地点"
                    width="300">
                    </el-table-column>
                    <el-table-column
                    prop="statusCh"
                    label="完成状态"
                    width="80">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <span v-if="userType!=1">
                                <!-- 编辑 是否是自己发布的 ，状态是否完成 -->
                                <template v-if="scope.row.status==0">
                                    <template v-if="scope.row.managerUnitId!=unitId">
                                        <el-button
                                        size="mini"
                                        type="primary"
                                        :disabled="true"
                                        @click="SperRela(scope.row.id)">编辑</el-button>
                                    </template>
                                    <template v-else>
                                        <el-button
                                        size="mini"
                                        type="primary"
                                        @click="SperRela(scope.row.id)">编辑</el-button>
                                    </template>
                                </template>
                                <template v-else>
                                    <el-button
                                    size="mini"
                                    type="primary"
                                    :disabled="true"
                                    @click="SperRela(scope.row.id)">编辑</el-button>
                                </template>
                                <!-- 是不是自己发布的 -->
                                <template v-if="scope.row.managerUnitId!=unitId">
                                    <el-button
                                    size="mini"
                                    type="danger"
                                    :disabled="true"
                                    @click="deleteBox(scope.row.id)">删除</el-button>
                                </template>
                                <template v-else>
                                    <el-button
                                    size="mini"
                                    type="danger"
                                    @click="deleteBox(scope.row.id)">删除</el-button>
                                </template>

                                <!-- 完成 是否是联网单位，状态完成与否-->
                                <template v-if="userTypes==3">
                                    <template v-if="scope.row.status==0">
                                        <el-button
                                        size="mini"
                                        type="success"
                                        @click="openSubmitBox(scope.row.id)">完成</el-button>
                                    </template>
                                    <template v-else>
                                        <el-button
                                        size="mini"
                                        type="success"
                                        :disabled="true"
                                        @click="openSubmitBox(scope.row.id)">完成</el-button>
                                    </template>
                                </template>
                            </span>
                            <el-button
                                size="mini"
                                type="warning"
                                @click="searchBox(scope.row.id)">查看反馈</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="page_all">
                    <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
                </div>
                <!-- 新增弹框 -->
                <div class="dialog_transfer">
                    <el-dialog
                        title="演练信息"
                        :visible.sync="visibleDialog"
                        :close-on-click-modal="false"
                        :modal-append-to-body="false"
                        :before-close="Closetransfer">
                        <el-form :rules="rules" :model="ruleForm" :data="ruleForm" status-icon  ref="ruleForm" label-width="150px" class="demo-ruleForm" >
                            <el-form-item label="演练任务名称" prop="name">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                            <template v-if="userTypes!=3">
                                <el-form-item label="演练单位" prop="unitId" >
                                    <el-select v-model="ruleForm.unitId" filterable placeholder="请选择" @change="changeUnit">
                                        <el-option
                                        v-for="item in unitIdData"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                            <el-form-item label="演练负责人" prop="chargeId">
                                <el-select v-model="ruleForm.chargeId" filterable placeholder="请选择">
                                    <el-option
                                    v-for="item in userData"
                                    :key="item.id"
                                    :label="item.username"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="演练预计参加人数" prop="planPersonNum">
                                <el-input v-model="ruleForm.planPersonNum"></el-input>
                            </el-form-item>
                            <el-form-item label="演练类型" prop="type">
                                <!-- <el-radio v-model="ruleForm.type" label="1">单项演练</el-radio> -->
                                <el-radio v-model="ruleForm.type" label="2">综合演练</el-radio>
                            </el-form-item>
                            <el-form-item label="演练日期" prop="endTime">
                                <el-date-picker
                                    v-model="ruleForm.endTime"
                                    align="right"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="演练任务地点" prop="address">
                                <el-input v-model="ruleForm.address"></el-input>
                            </el-form-item>
                            <el-form-item label="演练任务描述" prop="content">
                                <el-input type="textarea" v-model="ruleForm.content"></el-input>
                            </el-form-item>
                            
                             <el-form-item class="formfooter">
                                <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                                <el-button @click="Closetransfer">关闭</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </div>
                <!-- 反馈提交 -->
                <el-dialog
                    title="演练反馈"
                    :visible.sync="visibleReply"
                    :close-on-click-modal="false"
                    :modal-append-to-body="false"
                    :before-close="CloseReply">
                        <el-form :rules="replyRules" :model="replyForm" :data="replyForm" status-icon  ref="replyForm" label-width="150px" class="demo-ruleForm" >
                            <el-form-item label="实际参加人数" prop="actualPersonNum">
                                <el-input v-model="replyForm.actualPersonNum"></el-input>
                            </el-form-item>
                            <el-form-item label="演练描述" prop="content">
                                <el-input type="textarea" v-model="replyForm.content"></el-input>
                            </el-form-item>
                            <el-form-item label="图片(最多三张)" class="replyPhoto">
                                <el-upload
                                    action=""
                                    list-type="picture-card"
                                    :on-preview="handlePictureCardPreview"
                                    :http-request="replyPhotoSubmit"
                                    :limit="3"
                                    :on-remove="handleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="replyPhotoVisible">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </el-form-item>
                             <el-form-item class="formfooter">
                                <el-button type="primary" @click="SubmitReply('replyForm')" v-noMoreClick>立即提交</el-button>
                                <el-button @click="CloseReply">关闭</el-button>
                            </el-form-item>
                        </el-form>

                </el-dialog>

                <!-- 反馈详情 -->
            <el-dialog
                title="反馈信息"
                :visible.sync="selectReplySingleDialog"
                class='Feedback dialog'
                :close-on-click-modal="false"
                :before-close="closeReplySingle">
                    <div class="divBox">
                        <div class="descript">实际参加人数:</div>
                        <div>{{ReplySingleData.actualPersonNum}}</div>
                    </div>
                    <div class="divBox">
                        <div class="descript">演练反馈提交人员:</div>
                        <div>{{ReplySingleData.feedbackName}}</div>
                    </div>
                    <div class="textarea">
                        <div class="descript">演练反馈描述:</div>
                        <div>
                            {{ReplySingleData.content}}
                        </div>
                    </div>
                    <div class="textarea">
                        <div class="descript">公告图片:</div>
                        <div class="img">
                            <span style="display:inline-block;margin-left:10px;" v-for="item in ReplySingleData.imgUrlData" :key="item.id">
                                <img :src="item" alt="">
                            </span>
                            
                        </div>
                    </div>
            </el-dialog>
            </div>
        </el-col>
    </div>
</template>
<script>
import pagination from '../Children/Pagination'
export default {
    data(){
        return {
            userType:'',//登录用户等级
            userTypes:'',//超级管理员点击单位的用户等级
            tableData:[],//表格数据
            pageNum:1,
            pageSize:10,
            total:200,
            name:'',//演练名称
            type:'',//演练类型
            status:'',//演练完成状态
            startTime:'',//开始时间
            endTime:'',//结束时间
            filterText:'',//过滤值
            Treedata:[],//树状图数据
            unitId:'',//单位id
            addAreaFlag:true,//是否可以新增区域
            visibleDialog:false,//新增弹框
            treedefaultProps: {
                children: 'children',
                label: 'label'
            },
            filterMethod(query, item) {
                return item.initial.indexOf(query) > -1;
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            ruleForm:{
                name:'',//区域名称
                unitId:'',//演练单位
                endTime:'',//结束时间
                chargeId:'',//负责人
                type:'2',//演练类型
                address:'',//演练地点
                content:'',//演练描述
                planPersonNum:'',//预计人数参加
            },
            rules:{
                 name: [
                    { required: true, message: '请输入演练任务名称', trigger: 'blur' },
                ],
                unitId:[
                    { required: true, message: '请选择演练单位', trigger: 'blur' },
                ],
                chargeId:[
                    { required: true, message: '请选择演练负责人', trigger: 'blur' },
                ],
                type:[
                    { required: true, message: '请选择演练类型', trigger: 'blur' },
                ],
                endTime: [
                    { required: true, message: '请选择演练时间', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入演练地点', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请输入演练描述', trigger: 'blur' },
                ],
                planPersonNum:[
                    { required: true, message: '请输入预计参加人数', trigger: 'blur' },
                    {pattern: /^\d{1,9}$/,message: '必须为数字', trigger: 'blur' }
                ],
            },
            unitIdData:[],//单位下拉框数据
            userData:[],//人员下拉框数据
            typeData:[//演练类型
                {
                    name:'单项演练',
                    id:'1',
                },
                {
                    name:'综合演练',
                    id:'2',
                },
            ],
            statusData:[//状态类型
                {
                    name:'未完成',
                    id:'0',
                },
                {
                    name:'已完成',
                    id:'1',
                },
            ],
            visibleReply:false,//反馈弹框
            replyForm:{
                actualPersonNum:'',//实际参加人数
                content:'',//演练反馈描述
            },
            replyRules:{//
                actualPersonNum: [
                    { required: true, message: '请输入演练任务实际参加人数', trigger: 'blur' },
                    {pattern: /^\d{1,9}$/,message: '必须为数字', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入演练任务描述', trigger: 'blur' },
                ],
            },
            replyPhotoVisible: false,//反馈图片
            dialogImageUrl: '',//图片集合
            replyPhotoList:[],//反馈图片集合
            selectReplySingleDialog:false,//反馈详情弹框
            ReplySingleData:[],//反馈数据
        }
    },
    components:{
        pagination:pagination
    },
    methods:{
        SperRela(id){   //打开穿梭框
            this.getSingle(id);
        },
        getSingle(id){//查看某个演练任务的详情
            var _this=this;
            this.axios({
                url:'api/admin/manoeuvre/single',
                method:'post',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.ruleForm=res.data.data;
                    _this.ruleForm.type=String(_this.ruleForm.type)
                    _this.openDialog();
                    _this.getUserData();
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        Closetransfer(){    //关闭弹框
            this.visibleDialog=false;
            delete this.ruleForm.id;
            Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
        },
        openDialog(){//新增打开弹框
            if(this.userType==2){
                this.getUnitIdData();
            }else if(this.userType==3){
                this.ruleForm.unitId=sessionStorage.getItem('unitId')
                this.getUserData();
            }
            if(this.userType==1){
                if(this.userTypes==2){
                    this.getUnitIdData();
                }else{
                    this.ruleForm.unitId=this.unitId;
                    this.getUserData();
                }
            }

            this.visibleDialog=true;
        },
        filterNode(value, data) {//树节点筛选
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
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
            this.unitId=data.id;
            this.userTypes=Number(data.type)+2;
            if(this.userTypes==2|| this.userTypes==3){
                this.addAreaFlag=false;
            }
            this.getData();
        },
        searchreset(){//模糊查询重置
            this.name='';//演练名称
            this.type='';//演练类型
            this.status='';//演练完成状态
            this.startTime='';//开始时间
            this.endTime='';//结束时间
            this.getData();
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.pageNum = item.page_index;
            this.pageSize = item.page_limit;
            this.getData(); //改变页码，重新渲染页面
        },
        searchData(){//模糊查询
            this.pageNum=1;
            this.$refs.paginationChild.changePageNum(this.pageNum)
            this.getData();
        },
        getTreeData(){//获取树状图数据
            var _this=this;
            this.axios({
                    url   :'/api/admin/unit/list.left',
                    method: 'post',
                    data:{
                        pageNum: 1000,
                        pageSize:1,
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.Treedata=res.data.data;
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
        },
        handleSubmit(name){//提交表单
            var _this=this; 
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.ruleForm.managerUnitId=this.unitId;
                    var url='/api/admin/manoeuvre/add';
                    if(this.ruleForm.id){
                        url='/api/admin/manoeuvre/update';
                    }
                    this.axios({
                        url:url,
                        method:'post',
                        data:this.ruleForm
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('保存成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.Closetransfer();
                                    _this.getData();
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
        getData(){//获取列表数据
            var start=new Date(this.startTime);
            var end=new Date(this.endTime)
            if((this.startTime=='' && this.endTime=='') || start.getTime()<=end.getTime()){
                var _this=this;
                this.axios({
                    url:'/api/admin/manoeuvre/list',
                    method:'post',
                    data:{
                        pageNum:this.pageNum,
                        pageSize:this.pageSize,
                        unitId:this.unitId,
                        name:this.name,
                        type:this.type,
                        status:this.status,
                        startTime:this.startTime,
                        endTime:this.endTime
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.tableData=res.data.list;
                        for(var i in _this.tableData){
                            if(_this.tableData[i].status==0){
                                _this.tableData[i].statusCh='未完成';
                            }else{
                                _this.tableData[i].statusCh='已完成';
                            }
                            if(_this.tableData[i].type==1){
                                _this.tableData[i].typeName='单项演练';
                            }else{
                                _this.tableData[i].typeName='综合演练';
                            }
                            _this.tableData[i].endTime=_this.$moment(_this.tableData[i].endTime).format("YYYY-MM-DD");
                        }
                        _this.total=res.data.total;
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
            }else{
                this.$message.error('开始时间不能小于结束时间')
            }
        },
        deleteBox(id){//删除某演练任务
            var _this=this;
            this.$confirm('你确定要删除吗')
                .then(()=> {
                    this.axios({
                        url:'/api/admin/manoeuvre/delete',
                        method:'post',
                        data:{
                            id:id
                        }
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('删除成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.getData();
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
        getUnitIdData(){//单位下拉框数据
            var _this=this;
            this.axios({
                url:'/api/admin/unit/list',
                method:'post',
                data:{
                    unitId:this.unitId,
                    pageNum:1,
                    pageSize:1000
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.unitIdData=res.data.list;
                    _this.unitIdData.splice(0,1);
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        changeUnit(){//改变单位
            this.ruleForm.chargeId='';
            this.getUserData();
        },
        getUserData(){//人员下拉框数据
            var _this=this;
            this.axios({
                url:'/api/admin/user/list',
                method:'post',
                data:{
                    unitId:this.ruleForm.unitId,
                    pageNum:1,
                    pageSize:1000
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.userData=res.data.list;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        searchBox(id){//查看反馈
            var _this=this;
            this.axios({
                url:'/api/admin/manoeuvre/patrol/search',
                method:'post',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                    if(res.data.data){
                        _this.selectReplySingleDialog=true;
                        _this.ReplySingleData=res.data.data;
                        _this.ReplySingleData.imgUrlData=_this.ReplySingleData.imgUrl&&_this.ReplySingleData.imgUrl.split(',')||[]
                    }else{
                        _this.$alert('该任务还没有完成，没有反馈数据', '提示', {
                        confirmButtonText: 'OK',
                    });
                    }
                    
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        CloseReply(){//关闭反馈提交弹框
            this.visibleReply=false;
            Object.assign(this.$data.replyForm,this.$options.data().replyForm);
            
            delete this.replyForm.manoeuvreId;
            this.replyPhotoList=[];
            var ul=document.querySelector('.replyPhoto ul');
            ul.innerHTML='';
            // console.log(this.replyForm)
        },
        openSubmitBox(id){//打开反馈提交弹框
            this.visibleReply=true;
            this.replyForm.manoeuvreId=id;
        },
        handlePictureCardPreview(file) {//图片上传
            this.dialogImageUrl = file.url;
            this.replyPhotoVisible = true;
        },
        replyPhotoSubmit(file){//图片提交
            var _this=this;
            let formdata = new FormData();
            formdata.append('file', file.file);
            formdata.append('fileType',8);
            this.axios({
                url   : "/api/admin/file/upload",
                method: 'post',
                data  :formdata
            }).then(res=>{    
                if(res.data.code==0){
                    _this.replyPhotoList.push({img:res.data.data.fileUrl,uid:file.file.uid});
                    this.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }                                             
            })
        },
        handleRemove(file, fileList) {//图片一移除
            for(var i in this.replyPhotoList){
                if(this.replyPhotoList[i].uid==file.uid){
                    this.replyPhotoList.splice(i,1);
                }
            }
        },
        SubmitReply(){//提交反馈
            var _this=this;
            this.replyForm.chargeId=sessionStorage.getItem('user_id');
            this.replyForm.unitId=sessionStorage.getItem('unitId');
            this.replyForm.list=[];
            for(var i in this.replyPhotoList){
                this.replyForm.list.push(this.replyPhotoList[i].img)
            }
            this.axios({
                url:"/api/admin/manoeuvre/submit",
                method:'post',
                data:this.replyForm
            }).then(res=>{
                if(res.data.code==0){
                    _this.$alert('保存成功', '提示', {
                        confirmButtonText: 'OK',
                        callback:()=>{
                            _this.CloseReply();
                            _this.getData();
                        }
                    });
                    
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
                
            })
        },
        closeReplySingle(){//关闭查看单位详情
            this.selectReplySingleDialog=false;
        }

       
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {
        this.userType=sessionStorage.getItem('userTypes');
        this.userTypes=sessionStorage.getItem('userTypes');
        if(this.userTypes==2|| this.userTypes==3){
            this.unitId=sessionStorage.getItem('unitId');
            this.addAreaFlag=false;
        }else{
            this.getTreeData();
        }
        if(this.userTypes!=1){
            this.getData();
        }
        
        
    },
    
}
</script>

<style lang="scss" scoped>
    #drillTaskmanagement{
        .top{
            .el-date-editor,.el-input{
                width: 160px!important;
            }
        }
        /deep/ .el-dialog{
            width: 688px;
            .el-date-editor,.el-input{
                width: 200px!important;
            }
            .el-textarea{
                width: 500px;
            }
            
        }

        .Feedback{
        .divBox{
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #eee;
            &>div{
                display: inline-block;
            }
            &>div:nth-of-type(1){
                width: 150px;
            }
            &>div:nth-of-type(2){
                width: 400px;
            }
            .descript{
                font-size: 15px;
                margin-right: 20px;
            }
        }
        .textarea{
            height: 100px;
            border-bottom: 1px solid #eee;
            display:flex;

            &>div{
                display: inline-block;
            }
            &>div:nth-of-type(1){
                width: 100px;
                line-height: 100px;
            }
            &>div:nth-of-type(2){
                width: 80%;
                height: 90px;
                padding: 5px;
                overflow-y: auto;
                &::-webkit-scrollbar{
                    width: 5px;
                }
                &::-webkit-scrollbar-thumb { 
                    border-radius: 10px;
                    box-shadow: inset 0 0 5px #232D36;
                    background-color: #eeeeee;
                    height: 30px;
                }
            }
        }
        .img{
            img{
                margin-top: 5px;
                width: 80px;
                height: 80px;
                display: inline-block;
            }
        }

        .feedDiv{
            height: 300px;
            border: 1px solid #96c4ec;
            margin-bottom: 10px;
            padding: 10px;
            .descript{
                font-size: 15px;
                margin-right: 20px;
            }
            &>div{
                border-bottom: 1px solid #eee;
            }
            .FeedBox{
                display: flex;
                height: 50px;
                line-height: 50px;
            }
            .textareaFeed{
                display: flex;
                height: 100px;
                &>div:nth-of-type(1){
                    line-height: 100px;
                }
                &>div:nth-of-type(2){
                width: 80%;
                height: 90px;
                padding: 5px;
                overflow-y: auto;
                &::-webkit-scrollbar{
                    width: 5px;
                }
                &::-webkit-scrollbar-thumb { 
                    border-radius: 10px;
                    box-shadow: inset 0 0 5px #232D36;
                    background-color: #eeeeee;
                    height: 30px;
                }
                img{
                    width: 80px;
                    height: 80px;
                    margin-top: 5px;
                }
            }
            }
        }
    }

    }
</style>