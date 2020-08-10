<template>
<!-- 履责制度管理 -->
    <div class="accountabilitySystem allcontent">
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
                        highlight-current
                        ref="tree"
                    >
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="20" style='padding-left:10px;height:100%'>
                <!-- 头部 -->
                <div class="top">
                    标题: <el-input v-model="title"></el-input>
                    
                    类型:<el-select v-model="type" placeholder="请选择">
                            <el-option
                                v-for="item in typeOptionsData"
                                :key="item.type"
                                :label="item.desc"
                                :value="item.type">
                            </el-option>
                        </el-select>
                    <el-button @click="searchData" type="primary">查询</el-button>
                    <el-button @click="resetData">重置</el-button>
                    <template v-if="userType==3">
                        <el-button type="primary" @click="addBox" :style="{'margin':' 0 auto'}">新增</el-button>
                    </template>
                    <template v-else>
                        <el-button type="primary" @click="addBox" :style="{'margin':' 0 auto'}" :disabled='addFalg'>新增</el-button>
                    </template>
                </div>

                <!-- 内容 -->
                <div class="bottom">
                    <!-- 表格 -->
                    <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
                        <el-table-column
                        type="selection"
                        width="55"
                        >
                        </el-table-column>
                        <el-table-column   									
                        prop="title"
                        label="标题"
                        width="220">
                        </el-table-column>
                        <el-table-column
                        prop="typeName"
                        label="类型"
                        width="140">
                        </el-table-column>
                        <el-table-column
                        prop="tagName"
                        label="标签"
                        width="190">
                        </el-table-column>
                        <el-table-column label="操作">
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
                             </template>
                        </el-table-column>
                        
                    </el-table>
                    <!-- 分页 -->
                    <div class="page_all">
                        <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
                    </div>
                </div>

                <!-- 弹框 -->
                <el-dialog
                    title="添加修改建筑信息"
                    :visible.sync="dialogVisible"
                    :close-on-click-modal="false"
                    class='dialog '
                    :before-close="closedialog">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="ruleForm.title"></el-input>
                            </el-form-item>
                            <el-form-item label="类型" prop="type">
                                <el-radio v-model="ruleForm.type" @change="radioChange" label="2">职责制度</el-radio>
                                <el-radio v-model="ruleForm.type" @change="radioChange" label="1">组织架构</el-radio>
                                <el-radio v-model="ruleForm.type" @change="radioChange" label="3">工作计划</el-radio>
                                
                            </el-form-item>
                            <el-form-item label="标签" prop="tagId">
                                <el-select v-model="ruleForm.tagId" placeholder="请选择">
                                    <el-option
                                        v-for="item in typeOptions"
                                        :key="item.type"
                                        :label="item.desc"
                                        :value="item.type">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                             <el-form-item label="自定义标签">
                                <el-input v-model="ruleForm.customTag"></el-input>
                            </el-form-item>          
                             <el-form-item label="内容" prop="content">
                                <el-input type="textarea" v-model="ruleForm.content"></el-input>
                            </el-form-item>
                            <el-form-item label="图片（最多五张）" class="replyPhoto">
                                <el-upload
                                    class="avatar-uploader"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    list-type="picture-card"
                                    :http-request="uploads"
                                    :on-remove="handleRemove"
                                    :file-list="photoList"
                                    :before-upload="beforeUpload">                                    
                                    <i class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="文件（最多三个）" class="replyfile">
                                <el-upload
                                    class="avatar-uploader"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :http-request="uploadsFile"
                                    :file-list="fileUrlList"
                                    :on-remove="handleRemoveFile">                                    
                                    <el-button>选择文件</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item class='submitagency'>
                                <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                                <el-button @click="closedialog">取 消</el-button>
                            </el-form-item>

                        </el-form>
                         
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import pagination from '../Children/Pagination'
export default {
    components:{
        pagination:pagination
    },
    data(){
        return {
            userType:sessionStorage.getItem('userTypes'),//用户等级
            unitId:'',//单位id
            Treedata:[],//树状图数据
            typeOptions:[],//标签数据
            tableData:[],//表格数据
            typeOptionsData:[
                {
                    type:'',
                    desc:'全部'
                },
                {
                    type:'1',
                    desc:'组织架构'
                },
                {
                    type:'2',
                    desc:'职责制度'
                },
                {
                    type:'3',
                    desc:'工作计划'
                }
                
            ],
            currentPage:1,
            rows:10,
            total:0,
            filterText:'',
            ruleForm: {
                unitId:'',//城市Id
                title:'',//标题
                type:'1',//类型
                tagId:'',//标签
                content:'',//内容
                list:[],
                fileUrl:[],
                customTag:""
            },
            rules: {
                   title:[
                        { required: true, message: '请输入标题', trigger: 'blur' },
                   ],
                   type:[
                        { required: true, message: '请选择类型', trigger: 'blur' },
                   ],
                   tagId:[
                       { required: true, message: '请选择标签', trigger: 'blur' },
                   ],
                   content:[
                       { required: true, message: '请输入内容', trigger: 'blur' },
                   ],
            },
            defaultProps: { //树
                children: 'children',
                label: 'label'
            },
            addFalg: true,//新增开关
            dialogVisible:false,//新增弹框
            imgFile:'',
            photoList:[],
            fileUrlList:[],
            title:'',//标题
            type:''
        }
    },
    methods:{
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
            // console.log(file)
            this.imgFile= file;
        
        },
        uploads(){  //上传图片
             var _this=this;
            let formdata = new FormData();
            formdata.append('file', this.imgFile );
            formdata.append('fileType',10);
            this.axios({
                url   : "/api/admin/file/upload",
                method: 'post',
                data  :formdata
                }).then(res=>{    
                    if(res.data.code==0){
                        _this.photoList.push({url:res.data.data.fileUrl,uid:this.imgFile.uid});
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }                                             
                })
        },
        handleRemove(file){//移除图片
            for(var i in this.photoList){
                if(this.photoList[i].uid==file.uid){
                    this.photoList.splice(i,1);
                }
            }
        },
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
                        _this.fileUrlList.push({url:res.data.data.fileUrl,uid:file.file.uid,name:file.file.name});
                    }else{file.file
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }                                             
            })
        },
        handleRemoveFile(file){
            for(var i in this.fileUrlList){
                if(this.fileUrlList[i].uid==file.uid){
                    this.fileUrlList.splice(i,1);
                }
            }
        },
        handleNodeClick(data) { //点击树节点
           this.unitId = data.id;
           this.rows = 10
           this.currentPage = 1
           if( data.type == 0 ) {
               this.addFalg = true
           }else{
                this.addFalg = false
           }
           this.getData()
          
        },
        getData(){//获取表格数据
            var _this=this;
            this.axios({
                url   :"/api/admin/duty/list",
                method: 'post',
                data  : {
                    unitId:this.unitId,
                    pageNum:this.currentPage,
                    pageSize:this.rows,
                    title:this.title,
                    type:this.type
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.tableData=res.data.list;
                    for(var i in _this.tableData){
                        if(_this.tableData[i].type==1){
                            _this.tableData[i].typeName="组织架构"
                        }else if(_this.tableData[i].type==2){
                            _this.tableData[i].typeName="职责制度"
                        }else{
                             _this.tableData[i].typeName="工作计划"
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
        searchData(){//模糊查询
            this.currentPage=1;
            this.$refs.paginationChild.changePageNum(this.currentPage)
            this.getData();
        },
        resetData(){//重置模糊查询
            this.title='';
            this.type="";
            this.getData();
        },
        getTree(){//获取树数据
            var _this=this;
            this.axios({
                url   :"api/admin/unit/list.left",
                method: 'post',
                params  : {
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
        addBox(){//新增弹框打开
            this.dialogVisible=true;
            this.getTag();
        },
        closedialog(){//新增弹框关闭
            this.dialogVisible=false;
            Object.assign(this.$data.ruleForm,this.$options.data().ruleForm);
            delete this.ruleForm.id;
            this.photoList=[];
            this.fileUrlList=[];
            var ul=document.querySelector('.replyPhoto ul');
            ul.innerHTML='';
        },
        handleSubmit(name){//新增提交
            var that = this
            this.ruleForm.list=[];
            this.ruleForm.fileUrl=[];
            this.$refs[name].validate((valid)=>{
                if(valid){
                    for(var i in this.photoList){
                        this.ruleForm.list.push(this.photoList[i].url)
                    }
                    for(var i in this.fileUrlList){
                        this.ruleForm.fileUrl.push(
                            {
                                url:this.fileUrlList[i].url,
                                name:this.fileUrlList[i].name,
                            }
                            )
                    }
                    this.ruleForm.unitId=this.unitId;
                    var url="/api/admin/duty/add";
                    if(this.ruleForm.id){
                        url="/api/admin/duty/update";
                    }
                    this.axios({
                        url   :url,
                        method: 'post',
                        data  : this.ruleForm
                    }).then(res=>{
                        if(res.data.code==0){
                            this.$alert('保存成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    this.closedialog();
                                    this.getData();
                                }
                            });
                        }else{
                            this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                    })
                }
            })
        },
        editData(id){//编辑打开框
            
            var _this=this;
            _this.photoList=[]
            this.axios({
                url   :"/api/admin/duty/single",
                method: 'post',
                data  : {
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.ruleForm=res.data.data;
                    _this.ruleForm.type=String(_this.ruleForm.type)
                    _this.getTag();
                    for(var i in _this.ruleForm.imgUrl){
                        _this.photoList.push({url:_this.ruleForm.imgUrl[i]})
                    }
                    for(var i in _this.ruleForm.fileUrl){
                        _this.fileUrlList.push({name:_this.ruleForm.fileUrl[i].name,url:_this.ruleForm.fileUrl[i].url})
                    }
                    _this.dialogVisible=true;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        handleDelete(id){//删除指定规则
            var _this=this;
            this.$confirm('你确定要删除吗')
                .then(()=> {
                    this.axios({
                        url   :"/api/admin/duty/delete",
                        method: 'post',
                        data  : {
                            id:id
                        }
                    }).then(res=>{
                        if(res.data.code==0){
                            _this.$alert('删除成功', '提示', {
                                confirmButtonText: 'OK',
                                callback:()=>{
                                    this.getData();
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
        getTag(){//获取标签数据
            var _this=this;
            this.axios({
                url   :"/api/admin/duty/type",
                method: 'post',
                data  : {
                    type:this.ruleForm.type
                }
            }).then(res=>{
                if(res.data.code==0){
                    this.typeOptions=res.data.data; 
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        radioChange(){//单选框改变
            console.log(this.ruleForm.type);
            this.getTag();
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.currentPage = item.page_index;
            this.rows = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
    },
    mounted(){
        this.unitId=sessionStorage.getItem('unitId');
        if(sessionStorage.getItem('userTypes')==3){
            this.getData();
        }else{
            this.getTree();
        }
        
        
        
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    }
}
</script>

<style lang="scss">
    .accountabilitySystem{
         background: #fff;
        /deep/ .el-dialog{
            width: 760px!important;
            .el-select,.el-input{
                width:200px;
            }
        }
        .el-carousel__item h3 {
            color: #475669;
            font-size: 18px;
            opacity: 0.75;
            line-height: 300px;
            margin: 0;
        }
        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }
        
        .el-carousel__item:nth-child(2n+1) {
            background-color: #d3dce6;
        }
        fieldset{
            padding:30px;
            margin-bottom:20px;
            border: 1px solid;
            border-color: #e8e5e5;
        }
        .el-upload--picture-card,.el-upload-list--picture-card .el-upload-list__item{
            width: 100px;
            height: 100px;
            line-height: 100px;
        }
        .top{
            .el-input{
                width: 180px;
            }
        }
        .replyfile{
            .el-upload-list{
                position: relative;

            }
        }
    }
    .elbg{
        background: #FFF!important;
    }
    
 
 
    
</style>