<template>
    <!-- 合同管理 -->
    <div class="contract allcontent">
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
                    :data="treeData" 
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
                    标题:
                    <el-input v-model="title"></el-input>&nbsp;&nbsp;
                    <el-button type="primary" @click='searchsubmit'>查询</el-button>
                    <el-button @click='searchreset'>重置</el-button>
                    <template v-if="userType==2">
                        <el-button type="success" @click="opendialog">新增</el-button>
                    </template>
                    
                </div>
            </div>
            <!-- 内容 -->
            <div style='margin-top:10px;height: 88%;position: relative;'>
                <!-- 表格 -->
                <el-table					
                    :data="tableData"
                    border
                    style="width:150">
                    <el-table-column
                    prop="title"
                    label="合同名称"
                    width="200">
                    </el-table-column>
                    <template v-if="userType==3">
                        <el-table-column
                        prop="installerPhone"
                        label="维保企业"
                        width="200">
                        </el-table-column>
                    </template> 
                    <el-table-column
                    prop="unitName"
                    label="签订日期"
                    width="190">
                    </el-table-column>
                    <el-table-column
                    prop="debuggerName"
                    label="结束日期"
                    width="190">
                    </el-table-column>
                    <el-table-column
                    prop="debuggerPhone"
                    label="项目负责人"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="debuggerPhone"
                    label="状态"
                    width="200">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="editdatas(scope.row.id)">更新</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="editdatas(scope.row.id)">续签</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row.id)">终止</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div style="position:absolute;bottom:0;">
                    <pagination :total='total' ref="paginationChild"  @pageChange="pageChange"></pagination>
                </div>
            </div>

            <!-- 弹框 -->
            <el-dialog
                title="添加/修改合同"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closedialog">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
                        <el-form-item label="合同名称" prop="title">   
                            <el-input v-model="ruleForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="合同类型" prop="debuggerName">   
                            <el-select v-model="ruleForm.debuggerName" placeholder="请选择">
                                <el-option
                                v-for="item in smsPhoneTypeData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="委托单位" prop="debuggerName">   
                            <el-select v-model="ruleForm.debuggerName" placeholder="请选择">
                                <el-option
                                v-for="item in smsPhoneTypeData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="签订日期(保存后不能修改)" prop="installerPhone">   
                             <el-date-picker
                                v-model="ruleForm.installerName"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束日期(保存后不能修改)" prop="unitName">   
                            <el-date-picker
                                v-model="ruleForm.installerName"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同总价人名币(元)" prop="title">   
                            <el-input v-model="ruleForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="维保服务电话" prop="title">   
                            <el-input v-model="ruleForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="上传合同附件" prop="title">   
                            <el-upload
                                class="upload-demo"
                                action=""
                                :http-request="upload"
                                :on-change="handleChange"
                                >
                                <el-button size="small" type="primary">点击上传</el-button>
                                &nbsp;&nbsp;<span slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</span>
                            </el-upload>
                        </el-form-item>
                        <el-form-item class="formfooter">
                            <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                            <!-- <el-button @click="handleReset('ruleForm')">重置</el-button> -->
                            <el-button @click="closedialog">取 消</el-button>
                        </el-form-item>
                </el-form>
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
        return {
            module:'installationInformation',
            unitId:sessionStorage.getItem('unitId'),//单位id
            userType:sessionStorage.getItem('userTypes'),//用户权限
            title:'',//安装标题
            unitName:'',//安装公司
            treedefaultProps: {
                children: 'children',
                label: 'label'
            },
            currentPage:1,
            rows:10,
            total:1,
            ruleForm: {
                title:'',//安装标题
                installerName: '',//安装人姓名
                installerPhone:'',//安装人电话
                debuggerName:'',//调试人员
                debuggerPhone:'',//调试人员电话
                unitName:'',//安装公司
                unitId:'',//单位id
            },
            rules: {
                title: [
                    { required: true, message: '请输入安装标题', trigger: 'blur' },
                ],
                installerName: [
                    { required: true, message: '请输入安装人姓名', trigger: 'blur' },
                ],
                installerPhone: [
                    { required: true, message: '请输入安装人电话', trigger: 'blur' },
                ],
                debuggerName: [
                    { required: true, message: '请输入调试人员', trigger: 'blur' },
                ],
                debuggerPhone: [
                    { required: true, message: '请输入调试人员电话', trigger: 'blur' },
                ],
                unitName: [
                    { required: true, message: '请输入安装公司', trigger: 'blur' },
                ]
            },
            tableData:[],
            dialogVisible:false,
            treeData:[],//树数据
            filterText:'',
            smsPhoneTypeData:[
                {
                    name:'竣工检测',
                    id:1
                },
                {
                    name:'年度检测',
                    id:1
                },
                {
                    name:'专项检测',
                    id:1
                },
                {
                    name:'维护保养',
                    id:1
                },
                {
                    name:'安全评估',
                    id:1
                },
            ]
        }
    },
    methods:{
        searchsubmit(){  //模糊查询
            var _this=this;
            this.currentPage = 1;
            this.$refs.paginationChild.changePageNum(this.currentPage)
            this.axios({    
                url:'/api/admin/device/install.search',
                method: 'post',
                data:{
                    unitId:this.unitId,
                    pageSize:this.rows,
                    pageNum:this.currentPage,
                    title:this.title,
                    unitName:this.unitName
                }
            }).then(res=>{
                if(res.data.code==0){
                     _this.tableData = res.data.list;            
                    _this.total= res.data.total;
                    _this.currentPage= res.data.pageNum;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        searchreset(){   //模糊查询重置
            this.title="";
            this.unitName="";
        },
        editdatas(id){       //点击表格修改按钮
            var _this=this;
            this.axios({
                url:'/api/admin/device/install.search',
                method:'post',
                data:{
                    id:id,
                    pageNum:1,
                    pageSize:100
                }
            }).then(res=>{
                _this.ruleForm=res.data.list[0];
                _this.opendialog();
            })
        },
        handleNodeClick(data) { //点击树节点
            this.unitId=data.id;
            this.rows = 10
            this.currentPage = 1
            this.getData();
        },
        opendialog(){
            this.dialogVisible=true;
        },
        closedialog(){
            this.dialogVisible=false;
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
        pageChange (item) {//页数页码改变页面重新刷新
            this.currentPage = item.page_index;
            this.rows = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
        getData(){
            this.axios({
                url:"/api/admin/fire/inspection/config/single",
                method:"post",
                data:{
                    id:this.unitId
                }
            }).then ( res => {
                if( res.data.code==0 ){
                    this.tableData = res.data.data
                }
            })
        },
        Treeunit(){//单位树
            var _this=this;
            var url="/api/admin/unit/list.left";
            this.axios({
                url   :url,
                method: 'post',
                params  : {
                    pageNum:1,
                    pageSize:1000,
                }
            }).then(res=>{
                if(res.data.code==0){
                    if(res.data.data){
                        _this.treeData=res.data.data;
                        _this.data=res.data.data
                        for(var i=0;i<_this.treeData.length;i++){
                            _this.treeData[i].icon='el-icon-folder';
                        }
                    } 
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        filterNode(value, data) {//树节点筛选
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        handleSubmit (name) {//提交
           var _this = this
           this.$refs[name].validate((valid)=>{
               if(valid){
                  var url=''
                  if(_this.ruleForm.id){
                      url = "/api/admin/fire/inspection/config/update"
                  }else{
                       url = "/api/admin/fire/inspection/config/add"
                  }
                   _this.axios({
                        url,
                        method:"post",
                        data:{
                            ...this.ruleForm,
                        }
                    }).then ( res => {
                        if( res.data.code ==0 ){

                        }
                    })
               }else{
                   this.$message.error('请填写必填字段');
               }
           })
        },
        handleChange(file, fileList) {
            // 当多余一个的时候替换文件
            if (fileList.length > 1) {
                fileList.splice(0, 1);
            }
        },
        upload(){//上传文件附件
            console.log(111111)
        }
    },
    mounted(){
        
        if ( this.userType !=3 ) {
            this.Treeunit()
        }else{
            this.getData();
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
    .contract{
        .top{
            .el-input{
                width: 180px;
            }
        }
        /deep/ .el-upload-list{
            top: 30px;
            left: 0;
        }
        /deep/ .el-dialog{
            width: 700px;
            .el-input{
                width: 350px;
            }
            /deep/ .el-date-editor{
                width: 350px!important;
            }
        }
    }

</style>