<template>
    <!-- 公告管理 -->
    <div id="noticeManagement" class='allcontent'>
        <el-col :span="3" class="tree_box" v-if="userType==1">
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
        <el-col :span="21" style="height:100%;">
         <!-- 头部 -->
            <div class="top">
                <div>
                    公告标题:
                    <el-input v-model='noticeName'></el-input>
                    <el-button type="primary" @click="searchData">查询</el-button>
                    <el-button @click="resetNotice">重置</el-button>
                    <template v-if="userTypes==2">
                        <el-button type="primary" @click="opendialog">新增</el-button>
                    </template>
                </div>
            </div>
            <!-- 内容 -->
            <div style='margin-top:10px;height: 88%;position: relative;'>
                <!-- 表格 -->
                <el-table					
                    :data="tableData"
                    border
                    style="width: 150">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    prop="title"
                    label="公告标题"
                    width="250">
                    </el-table-column>
                    <template v-if="userType==3">
                        <el-table-column
                            prop="completed"
                            label="完成状态"
                            width="100">
                        </el-table-column>
                    </template>
                    <el-table-column
                    prop="time"
                    label="完成时限"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="createdTime"
                    label="发布时间"
                    width="160">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <span v-if="userTypes==2">
                                <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.row.id)">删除</el-button>
                                <el-button
                                size="mini"
                                type="warning"
                                @click="noticePhoto(scope.row.id)">公告有关图片</el-button>
                                <el-button
                                size="mini"
                                type="success"
                                @click="selectFeedback(scope.row.id)">查看反馈</el-button>
                            </span>
                            <span v-if="userTypes==3">
                                <el-button
                                size="mini"
                                type="success"
                                @click="selectFeedback(scope.row.id,scope.row.completed)">完成</el-button>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div style="position:absolute;bottom:0;">
                    <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
                </div>
            </div>
            <!-- 新增修改弹框 -->
            <el-dialog
                title="公告信息"
                :visible.sync="dialogVisible"
                width="50%"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closedialog">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="134px" class="demo-ruleForm">
                        <el-form-item label="公告标题" prop="title">
                            <el-input v-model="ruleForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="单位集合" prop="unitIds">
                            <el-select
                                v-model="ruleForm.unitIds"
                                multiple
                                filterable
                                collapse-tags
                                @change="selectChange"
                                placeholder="请选择单位集合">
                                <el-option
                                v-for="item in unitoOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>    
                        <el-form-item label="完成时限" prop="time">
                            <el-date-picker
                                v-model="ruleForm.startTime"
                                type="date"
                                placeholder="请选择开始时间">
                            </el-date-picker> - 
                            <el-date-picker
                                v-model="ruleForm.endTime"
                                type="date"
                                placeholder="请选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="公告内容" prop="content">
                            <el-input type="textarea" v-model="ruleForm.content"></el-input>
                        </el-form-item>
                         <el-form-item label="文件（最多三个）" class="replyfile">
                                <el-upload
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :http-request="uploadsFile"
                                    :file-list="ruleForm.fileList"
                                    :on-remove="handleRemoveFile">                                    
                                    <el-button>选择文件</el-button>
                                </el-upload>
                        </el-form-item>
                        <!-- <el-form-item label="公告描述">
                            <el-input type="textarea" v-model="ruleForm.noticeUnit"></el-input>
                        </el-form-item> -->
                        <el-form-item class='formfooter'>
                            <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>保存</el-button>
                            <el-button @click="closedialog">取 消</el-button>
                        </el-form-item>
                    </el-form>
            </el-dialog>

            <!-- 公告图片 -->
            <el-dialog
                title="公告图片"
                :visible.sync="ArchitecturalVisible"
                class='dialog'
                :close-on-click-modal="false"
                :before-close="closeArchitectural">
                <fieldset>
                    <legend>各单位图片</legend>
                    <el-carousel :autoplay=false arrow ='always'  height="300px" :initial-index = 1 >
                        <el-carousel-item v-for="item in imgList" :key="item.name" class="elbg">
                            <span style="width:100%;text-align: center;display:inline-block;margin-bottom:5px;"> 第{{ item.num }}张 </span>
                            <img  style="width: 100%; height: 100%" :src="item.image"  alt="">
                        </el-carousel-item>
                    </el-carousel>
                </fieldset>                    
                <fieldset>
                    <legend>新增单位图片</legend>
                    <el-form  label-width="100px">
                        <el-form-item label="图片选项">
                            <el-select v-model="phoneName" placeholder="请选择" >
                                <el-option
                                    v-for="item in photoOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="单位图片" prop="phone" style="height:auto">
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
                                <el-button @click="unituploads" >立即上传</el-button>
                        </el-form-item>
                        <el-form-item solt-scope="scope">
                            <el-button size="small" type="primary" @click="photoSubmit" v-noMoreClick>提交</el-button>
                            <!-- slot.row.id -->
                            <el-button size="small" type="primary" @click="photoReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </fieldset>
            </el-dialog>

            <!-- 公告详情 -->
            <el-dialog
                title="公告信息"
                :visible.sync="selectFeedbackDialog"
                width="40%"
                class='Feedback dialog '
                :close-on-click-modal="false"
                :before-close="closeSelectFeedback">
                    <fieldset>
                        <legend>公告信息</legend>
                        <div class="divBox">
                            <div class="descript">公告标题:</div>
                            <div>{{ruleForm.title}}</div>
                        </div>
                        <div class="divBox">
                            <div class="descript">完成时限:</div>
                            <div>{{ruleForm.time}}</div>
                        </div>
                        <div class="textarea">
                            <div class="descript">公告内容:</div>
                            <div>
                                {{ruleForm.content}}
                            </div>
                        </div>
                        <div class="textarea">
                            <div class="descript">公告图片:</div>
                            <div class="img">
                                <span style="display:inline-block;margin-left:10px;" v-for="item in ruleForm.images" :key="item.id">
                                    <img :src="item.image" alt="">
                                </span>
                            </div>
                        </div>
                         <div class="textarea">
                            <div class="descript">文件:</div>
                            <div style="display:flex;align-items: center;">
                                <div  v-for="(item,index) in ruleForm.fileUrl" :key='index'>
                                    {{item.name}} <el-button @click="downFile(item)">下载</el-button>
                                </div>
                            </div>
                            
                        </div>
                        
                    </fieldset>

                    <div v-if="userTypes==2">
                        <el-button type="primary" @click="openUnitFeedback">查看各单位反馈详情</el-button>
                        <el-button @click="closeSelectFeedback">关闭</el-button>
                    </div>
                    <div v-else>
                        <el-button type="primary" @click="openReplyFeedback" :disabled="completed">完成</el-button>
                        <el-button @click="closeSelectFeedback">关闭</el-button>
                    </div>

                    <!-- //单位列表 -->
                    <el-dialog
                        title="公告信息"
                        :visible.sync="unitFeedbackDialog"
                        width="50%"
                        class='Feedback dialog'
                        :append-to-body="true"
                        :close-on-click-modal="false"
                        :before-close="closeUnitFeedback">
                        <div class="selcets">
                            &nbsp;查看情况：<el-select v-model="type" placeholder="请选择">
                                        <el-option
                                        v-for="item in typeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                            &nbsp;完成情况：<el-select v-model="type1" placeholder="请选择">
                                        <el-option
                                        v-for="item in typeOptions1"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                     <el-button type="primary" @click="openUnitFeedback"> 查询</el-button>
                                    <el-button type="primary" @click="handleReset">重置</el-button>
                        </div>
                        <el-table					
                        :data="unitTableData"
                        border
                        style="width: 150">
                        <el-table-column
                        prop="unitName"
                        label="单位名称"
                        width="250">
                        </el-table-column>
                        <el-table-column
                            label="完成状态"
                            width="100">
                             <template slot-scope="scope">{{ scope.row.completed==0?'未完成':'已完成' }}</template>
                        </el-table-column>
                        <el-table-column
                        label="查看状态"
                        width="200">
                        <template slot-scope="scope">{{ scope.row.status==0?'未查看':'已查看' }}</template>
                        </el-table-column>
                        <el-table-column
                        prop="finishTime"
                        label="完成时间"
                        width="160">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope='scope'>
                                    <el-button
                                    size="mini"
                                   type="primary"
                                    @click="editNotic(scope.row.id)">查看</el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                     <pagination :total='total1' ref="paginationChild1" @pageChange="pageChange1"></pagination>
                    </el-dialog>
                    <el-dialog
                        title="单位完成详情"
                        :visible.sync="unitFeedbackDialog1"
                        width="50%"
                        class='Feedback dialog'
                        :append-to-body="true"
                        :close-on-click-modal="false"
                        :before-close="closeUnitFeedback1">
                        <fieldset style="border:1px solid #eee;">
                            <legend>单位反馈情况</legend>
                            <div class="feedDiv">
                                <div class="FeedBox">
                                    <div class="descript">单位名称:{{unitListData.unitName}}</div>
                                     <el-tag class="tags" style="margin-top: 10px;">{{unitListData.status==1&&'已查看'||'未查看'}}</el-tag>
                                </div>
                                <div class="FeedBox">
                                    <div class="descript">完成状态:</div>

                                    <div v-if="unitListData.completed==0">未完成</div>
                                    <div v-else>已完成</div>
                                </div>
                                <div class="textareaFeed">
                                    <div class="descript">图片:</div>
                                    <div>
                                        <span style="height:100px;margin-left:10px;" v-for="i in unitListData.images" :key='i'>
                                            <img :src="i" alt="">
                                        </span>
                                    </div>
                                </div>
                                <div class="textareaFeed">
                                    <div class="descript">文件:</div>
                                    <div style="display:flex;align-items: center;">
                                        <div  v-for="(item,index) in unitListData.fileUrl" :key='index'>
                                            {{item.name}} <el-button @click="downFile(item)">下载</el-button>
                                        </div>
                                    </div>
                                </div>
                                <div class="textareaFeed">
                                    <div class="descript">完成描述:</div>
                                    <div>{{unitListData.completedNote?unitListData.completedNote:'无'}}</div>
                                </div>
                            </div>
                        </fieldset>
                        
                    </el-dialog>
                    
                    <el-dialog
                        title="公告完成情况"
                        :visible.sync="FeedbackReply"
                        width="50%"
                        class='Feedback dialog'
                        :append-to-body="true"
                        :close-on-click-modal="false"
                        :before-close="closeReplyFeedback">
                        <el-form :model="replyForm" :rules="replyRules" ref="replyForm" label-width="137px" class="demo-ruleForm">
                            <el-form-item label="描述" prop="completedNote">
                                <el-input type="textarea" v-model="replyForm.completedNote"></el-input>
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
                             <el-form-item label="文件（最多三个）" class="replyfile">
                                <el-upload
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :http-request="uploadsFile1"
                                    :file-list="replyForm.fileList"
                                    :on-remove="handleRemoveFile1">                                    
                                    <el-button>选择文件</el-button>
                                </el-upload>
                        </el-form-item>
                            <el-form-item class='formfooter'>
                                <el-button type="primary" @click="replySubmit('replyForm')">保存</el-button>
                                <el-button @click="closeReplyFeedback">取 消</el-button>
                            </el-form-item>
                        </el-form>

                    </el-dialog>
            </el-dialog>
        </el-col>
    </div>
</template>

<script>
import pagination from '../Children/Pagination'
export default {
    components:{
        pagination:pagination
    },
    data(){
        var timeValue=(rule, value, callback) => {
            if(this.ruleForm.startTime==''|| this.ruleForm.endTime==''){
                callback(new Error('请选择完成时限'));
            }else{
                var date1=new Date(this.ruleForm.startTime);
                var date2=new Date(this.ruleForm.endTime);
                if(date1.getTime()>date2.getTime()){
                    callback(new Error('开始时间必须小于结束时间'));
                }else{
                    callback();
                }
            }
        };
        return {
            noticeName:'',//模糊查询字段
            noticetime:'',//模糊查询字段
            filterText:'',//模糊查询树
            treedefaultProps: {
                children: 'children',
                label: 'label'
            },
            props: { multiple: true,checkStrictly: true },
            ruleForm: {
                startTime:'',//开始时间
                endTime:'',//结束时间
                unitIds:[],//单位集合
                title:'',//公告标题
                content:'',//公告内容
                fileList:[],
            },
            rules: {
                title: [
                    { required: true, message: '请输入公告标题', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请输入公告内容', trigger: 'blur' },
                ],
                unitIds: [
                    { required: true, message: '请选择单位集合', trigger: 'blur' },
                ],
                time:[
                    {validator: timeValue, required: true, trigger: 'blur' }
                ]
            },
            replyForm:{
                completed:'1',//完成状态
                completedNote:'',//描述
                fileList:[]
            },
            replyRules: {
                completed: [
                    { required: true, message: '请选择完成状态', trigger: 'blur' },
                ],
                completedNote: [
                    { required: true, message: '请输入描述', trigger: 'blur' },
                ],
            },
            pageNum:1,
            pageSize:10,
            pageNum1:1,
            pageSize1:10,
            total:10,
            total1:10,
            Treedata:[],//树状数据
            tableData:[{}],//表格数据
            unitId:'',//单位id
            userType:'',//登陆用户等级
            userTypes:'',//用户等级
            dialogVisible:false,//新增弹框
            ArchitecturalVisible:false,//图片框
            imgList:[],//图片列表
            photoOptions:[
                {
                    id:1,
                    name:'第一张'
                },
                {
                    id:2,
                    name:'第二张'
                },
                {
                    id:3,
                    name:'第三张'
                },
                {
                    id:4,
                    name:'第四张'
                },
                {
                    id:5,
                    name:'第五张'
                },
            ],
            unitoOptions:[],//单位集合
            oldChooseData:[],//之前选中
            posterURL:'',//图片
            phoneName:'',
            upload:'',
            selectFeedbackDialog:false,//反馈弹框
            unitFeedbackDialog:false,//反馈单位列表
            unitFeedbackDialog1:false,//反馈单位列表
            FeedbackReply:false,//完成公告
            feedBackId:'',//公告id
            unitListData:[],//子单位集合
            dialogImageUrl: '',//图片集合
            replyPhotoVisible: false,//反馈图片
            replyPhotoList:[],//图片集合
            completed:false,//完成状态
            type:'',
            type1:'',
            typeOptions:[
                {
                    label:'已查看',
                    value:'1'
                },
                {
                    label:'未查看',
                    value:'0'
                },
            ],
            typeOptions1:[
                {
                    label:'已完成',
                    value:'1'
                },
                {
                    label:'未完成',
                    value:'0'
                },
            ],
            unitTableData:[]
        }
    },
    methods:{
         uploadsFile(file){
            var _this=this;
            let formdata = new FormData();
            formdata.append('file',file.file );
            formdata.append('fileType',10);
            this.axios({
                url   : "/api/admin/file/upload",
                method: 'post',
                data  :formdata
                }).then(res=>{    
                    if(res.data.code==0){
                        _this.ruleForm.fileList.push({url:res.data.data.fileUrl,uid:file.file.uid,name:file.file.name});
                    }else{file.file
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }                                             
            })
        },
        handleRemoveFile(file){
            for(var i in this.ruleForm.fileList){
                if(this.ruleForm.fileList[i].uid==file.uid){
                    this.ruleForm.fileList.splice(i,1);
                }
            }
        },
         uploadsFile1(file){
            var _this=this;
            let formdata = new FormData();
            formdata.append('file',file.file );
            formdata.append('fileType',10);
            this.axios({
                url   : "/api/admin/file/upload",
                method: 'post',
                data  :formdata
                }).then(res=>{    
                    if(res.data.code==0){
                        _this.replyForm.fileList.push({url:res.data.data.fileUrl,uid:file.file.uid,name:file.file.name});
                    }else{file.file
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }                                             
            })
        },
        handleRemoveFile1(file){
            for(var i in this.replyForm.fileList){
                if(this.replyForm.fileList[i].uid==file.uid){
                    this.replyForm.fileList.splice(i,1);
                }
            }
        },
        downFile(data){
            if(data.url){
                this.download(data.url,data.name)
            }
        },
        getBlob(url,cb) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function() {
                    if (xhr.status === 200) {
                        cb(xhr.response);
                    }
            };
            xhr.send();
        },
        saveAs(blob, filename) {
            if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, filename);
            } else {
                    var link = document.createElement('a');
                    var body = document.querySelector('body');

                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;

                    // fix Firefox
                    link.style.display = 'none';
                    body.appendChild(link);
                    
                    link.click();
                    body.removeChild(link);

                    window.URL.revokeObjectURL(link.href);
            };
        },
        download(url, filename) {
            var _this =this
            this.getBlob(url, function(blob) {
                _this.saveAs(blob, filename);
            });
        },
        renderContent(h, { node, data}) {//树前小图标
            return (
              <span>
                <i class={data.icon}></i>
                &nbsp;<span>{node.label}</span>
              </span>
              );
        },
        selectChange(val){//下拉框改变
            this.$forceUpdate();
            const allValues = this.unitoOptions.map(item => {
                return item.id;
            });
            // 用来储存上一次选择的值，可进行对比
            const oldVal = this.oldChooseData.length > 0 ? this.oldChooseData : [];
        
            // 若选择全部
            if (val.includes('ALL_SELECT')) {
                this.ruleForm.unitIds = allValues;
            }
        
            // 取消全部选中， 上次有， 当前没有， 表示取消全选
            if (oldVal.includes('ALL_SELECT') && !val.includes('ALL_SELECT')) {
                this.ruleForm.unitIds = [];
            }
        
            // 点击非全部选中，需要排除全部选中 以及 当前点击的选项
            // 新老数据都有全部选中
            if (oldVal.includes('ALL_SELECT') && val.includes('ALL_SELECT')) {
                const index = val.indexOf('ALL_SELECT');
                val.splice(index, 1); // 排除全选选项
                this.ruleForm.unitIds = val;
            }
        
            // 全选未选，但是其他选项都全部选上了，则全选选上
            if (!oldVal.includes('ALL_SELECT') && !val.includes('ALL_SELECT')) {
                if (val.length === allValues.length - 1) {
                this.ruleForm.unitIds = ['ALL_SELECT'].concat(val);
                }
            }
        
            // 储存当前选择的最后结果 作为下次的老数据
            this.oldChooseData = this.ruleForm.unitIds;
        },
        handleNodeClick(data) { //点击树节点
            this.unitId=data.id;
            this.userTypes=data.type+2;
            this.pageSize = 10
            this.pageNum = 1
            this.getData();
        },
        filterNode(value, data) {//树节点筛选
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        getData(){  //模糊查询,表格列表
            var _this=this;
            this.axios({    
                url:'/api/admin/announcement/search/page',
                method: 'post',
                data:{
                    unitId:this.unitId,
                    pageSize:this.pageSize,
                    pageNum:this.pageNum,
                    title:this.noticeName,
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.tableData = res.data.list;            
                    _this.total= res.data.total;
                    if(_this.tableData.length>0){
                        for(var i in _this.tableData){
                            _this.tableData[i].time=_this.$moment(_this.tableData[i].startTime).format("YYYY-MM-DD")+'到'+_this.$moment(_this.tableData[i].endTime).format("YYYY-MM-DD");
                            _this.tableData[i].createdTime=_this.$moment(_this.tableData[i].createdTime).format("YYYY-MM-DD HH:mm");
                            if(_this.tableData[i].completed==0){
                                _this.tableData[i].completed='未完成'
                            }else{
                                _this.tableData[i].completed='已完成'
                            }
                        }
                    }
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        handleDelete(id){//删除公告
            this.$confirm('你确定要删除吗')
                .then(()=> {
                    var _this=this;
                    this.axios({    
                        url:'/api/admin/announcement/delete',
                        method: 'post',
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
        resetNotice(){   //模糊查询重置
            this.noticeName="";
            this.noticetime="";
            this.getData();
        },
        searchData(){//模糊查询
            this.pageNum=1;
            this.$refs.paginationChild.changePageNum(this.pageNum)
            this.getData();
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.pageNum = item.page_index;
            this.pageSize = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
        pageChange1 (item) {//页数页码改变页面重新刷新
            this.pageNum1 = item.page_index;
            this.pageSize1 = item.page_limit;
            this.openUnitFeedback()
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
        getUnitData(){//获取新增修改的单位下拉框数据
            var _this=this;
            this.axios({
                url   :'/api/admin/unit/list/announcement',
                method: 'post',
                data:{
                    id:this.unitId
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.unitoOptions=res.data.data;
                    _this.unitoOptions.unshift({id:'ALL_SELECT',name:"全部"})
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        opendialog(){//打开新增弹框
            this.getUnitData();
            delete this.ruleForm.id;
            this.dialogVisible=true;
        },
        closedialog(){//关闭新增弹框
            this.dialogVisible=false;
            delete this.ruleForm.id;
            Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
        },
        handleSubmit(name){//表单提交
            
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.ruleForm.unitId=this.unitId;
                    if(this.ruleForm.unitIds[0]=='ALL_SELECT'){
                        this.ruleForm.unitIds.splice(0,1)
                    }
                    var url="/api/admin/announcement/add";
                    var _this=this;
                    this.ruleForm.unitId=this.unitId;
                    this.axios({
                        url:url,
                        method:'post',
                        data:this.ruleForm
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('保存成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.getData()
                                    _this.closedialog()
                                }
                            });
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                    })
                }else{
                    this.$alert('请填表单必填字段')
                }
            })
        },
        replySubmit(name){//子单位提交反馈
            this.$refs[name].validate((valid)=>{
                if(valid){
                    var _this=this;
                    this.replyForm.unitId=this.unitId;
                    this.replyForm.announcementId=this.feedBackId;
                    this.replyForm.imgaes=[];
                    for(var i in this.replyPhotoList){
                        this.replyForm.imgaes.push(this.replyPhotoList[i].img)
                    }
                    this.axios({
                        url:'/api/admin/announcement/unit/update',
                        method:'post',
                        data:this.replyForm
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('保存成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    _this.getData();
                                    _this.closeReplyFeedback();
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
        closeArchitectural(){//关闭图片弹框
            this.ArchitecturalVisible=false;
        },
        noticePhoto(id){//打开图片弹框
            this.ArchitecturalVisible=true;
            this.feedBackId=id;
            this.photoList();
        },
        beforeUpload(file) {//上传前
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
                this.imgFile=null;
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
        unituploads(){//上传图片
            var _this=this;
            if( _this.phoneName ) {
                if( !_this.posterURL ) {
                    _this.$alert('请上传图片', '提示', {
                        confirmButtonText: 'OK',
                    });
               }
                    let formdata = new FormData();
                    formdata.append('file', this.upload);
                    formdata.append('fileType',7);
                    this.axios({
                    url   : "/api/admin/file/upload",
                    method: 'post',
                    data  :formdata
                    }).then(res=>{    
                        if(res.data.code==0){
                            _this.imgUrl = res.data.data.fileUrl;
                            _this.$alert('上传成功', '提示', {
                                confirmButtonText: 'OK',
                            });
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }                                             
                    })
            }else{
                _this.$alert('请选择图片选项', '提示', {
                        confirmButtonText: 'OK',
                });
            }
        },
        photoSubmit () {//图片个数上传
            var _this = this
            if(this.phoneName!=''&this.imgUrl!=''){
                this.axios({
                    url:"/api/admin/announcement/image/add",
                    method:"post",
                    data:{    
                        image:this.imgUrl,
                        announcementId:this.feedBackId,
                        num:this.phoneName
                    }
                }).then( res => {
                    if( res.data.code === 0) {
                        _this.$alert('添加成功', '提示', {
                            confirmButtonText: 'OK',
                            callback:()=>{
                                _this.photoReset();
                                _this.photoList();
                            }
                        });
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        }); 
                    }                    
                })
            }else{
                _this.$alert('请选择图片或图片选项', '提示', {
                    confirmButtonText: 'OK',
                }); 
            }
        },
        photoList(){//图片列表
            var _this = this
            this.axios({
                url:"/api/admin/announcement/image/list",
                method:"post",
                data:{    
                    id:this.feedBackId
                }
            }).then( res => {
                if( res.data.code === 0) {
                    _this.imgList=res.data.data;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    }); 
                }                    
            })
        },
        photoReset () {//重置图片
            this.posterURL = ''
            this.imgUrl = ''
            this.phoneName = ''
        },
        selectFeedback(id,type){//反馈弹框打开
            if(type=='已完成'){
                this.completed=true;
            }else{
                this.completed=false;
            }
            var _this=this;
            this.feedBackId=id;
            this.axios({    
                url:'/api/admin/announcement/search/single',
                method: 'post',
                data:{
                    id:id,
                    unitId:this.unitId
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.ruleForm=res.data.data;
                    _this.ruleForm.time=_this.$moment(_this.ruleForm.startTime).format("YYYY-MM-DD")+'至'+_this.$moment(_this.ruleForm.endTime).format("YYYY-MM-DD");
                    _this.selectFeedbackDialog=true;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        closeSelectFeedback(){//反馈弹框关闭
            this.selectFeedbackDialog=false;
            this.closedialog();
        },
        closeUnitFeedback(){//关闭单位列表反馈弹框
            this.unitFeedbackDialog=false;
        },
        closeUnitFeedback1(){//关闭单位列表反馈弹框
            this.unitFeedbackDialog1=false;
        },
        openUnitFeedback(){//打开单位列表反馈弹框
            var _this=this;
            this.axios({
                url   :'/api/admin/announcement/unit/list',
                method: 'post',
                data:{
                    id:this.feedBackId,
                    status:this.type,
                    completed:this.type1,
                    pageSize:this.pageSize1,
                    pageNum:this.pageNum1,
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.unitTableData=res.data.list;
                    _this.unitTableData.map( item =>{
                       item.finishTime = item.finishTime && _this.$moment(item.finishTime).format("YYYY-MM-DD HH:mm:ss")
                    })
                    _this.total1 = res.data.total
                    _this.unitFeedbackDialog=true;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        editNotic(id){
             var _this=this;
            this.axios({
                url   :'/api/admin/announcement/unit/single',
                method: 'post',
                data:{
                    id,
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.unitListData=res.data.data;
                    _this.unitFeedbackDialog1=true;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        handleReset(){
            this.type=''
            this.type1=''
            this.pageSize1=10
            this.pageNum1=1
            this.$refs.paginationChild.changePageNum(this.pageNum)
            this.openUnitFeedback()
        },
        closeReplyFeedback(){//关闭回复公告情况
        this.closeSelectFeedback()
            this.FeedbackReply=false;
            var ul = document.querySelector('.replyPhoto ul');
            ul.innerHTML='';
            Object.assign(this.$data.replyForm,this.$options.data().replyForm);
        },
        openReplyFeedback(){//打开回复公告情况
            this.FeedbackReply=true;
        },
        handleRemove(file, fileList) {//图片一移除
            for(var i in this.replyPhotoList){
                if(this.replyPhotoList[i].uid==file.uid){
                    this.replyPhotoList.splice(i,1);
                }
            }
        },
        handlePictureCardPreview(file) {//图片上传
            this.dialogImageUrl = file.url;
            this.replyPhotoVisible = true;
        },
        replyPhotoSubmit(file){//图片提交
            var _this=this;
            let formdata = new FormData();
            formdata.append('file', file.file);
            formdata.append('fileType',7);
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
        }
    },
    mounted(){
        this.userType=sessionStorage.getItem('userTypes');
        if(this.userType==2||this.userType==3){
            this.userTypes=this.userType;
            this.unitId=sessionStorage.getItem('unitId');
            this.getData();
        }else{
            this.getTreeData();
        }
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
          }
    }
}
</script>

<style lang="scss" scoped>
    #noticeManagement{
        .el-select,.el-input{
            width:220px!important;
        }
        textarea{
            width:500px;
        }
        .top .el-date-editor{
            width:180px!important;
        }
       
    }
        .selcets{
            height: 50px;
           /deep/ .el-input{
                width: 125px!important;
            }
            /deep/ .el-button{
                    padding: 8px 13px!important;
            }
        }
    /deep/ .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 177px;
        height: 95px;
        line-height: 95px;
        text-align: center;
    }
    .avatar {
        width: 177px;
        height: 95px;
        display: block;
    }
    // /deep/ .el-dialog{
    //     width: 688px!important;
    // }
    .Feedback{
        .divBox{
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #eee;
            &>div{
                display: inline-block;
            }
            &>div:nth-of-type(1){
                width: 100px;
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
            height: 410px;
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

</style>