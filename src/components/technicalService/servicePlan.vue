<template>
    <!-- 服务项目计划管理 -->
    <div class="servicePlan allcontent">
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
                    <el-button type="success" @click='opendialog'>新增</el-button>
                    
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
                    label="项目名称"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="title"
                    label="所属合同"
                    width="150">
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
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="debuggerName"
                    label="结束日期"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="title"
                    label="建筑"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="title"
                    label="项目负责人"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="debuggerPhone"
                    label="已下发计划"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="debuggerPhone"
                    label="未下发计划"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="debuggerPhone"
                    label="未完成计划"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="status"
                    label="状态"
                    width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==1">合同终止</span>
                        <span v-if="scope.row.status==2">合同进行中</span>
                        <span v-if="scope.row.status==3">合同完成</span>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <template v-if="scope.row.status==2">
                                <el-button
                                size="mini"
                                type="primary"
                                @click="editBox(scope.row.id)">更新</el-button>
                                <el-button
                                size="mini"
                                type="danger"
                                @click="detail(scope.row.id)">终止</el-button>
                                <el-button
                                size="mini"
                                type="warning"
                                @click="detail(scope.row.id)">暂停</el-button>
                                <el-button
                                size="mini"
                                type="success"
                                @click="detail(scope.row)">服务计划</el-button>
                            </template>
                            <template v-if="scope.row.status==3">
                                <el-button
                                size="mini"
                                type="success"
                                @click="detail(scope.row)">服务计划</el-button>
                            </template>
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
                title="添加/修改项目"
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closedialog">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
                        <el-form-item label="合同选择" prop="debuggerName">   
                            <el-select v-model="ruleForm.debuggerName" placeholder="请选择">
                                <el-option
                                v-for="item in smsPhoneTypeData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目名称" prop="title">   
                            <el-input v-model="ruleForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="项目类型" prop="title">   
                            <el-input v-model="ruleForm.title" :disabled="true"></el-input>
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
                        <el-form-item label="项目负责人" prop="title">   
                            <el-input v-model="ruleForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="签订日期" prop="title">   
                            <el-input v-model="ruleForm.title" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="结束日期" prop="title">   
                            <el-input v-model="ruleForm.title" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="合同总价人民币(元)" prop="title">   
                            <el-input v-model="ruleForm.title" :disabled="true"></el-input>
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
                debuggerName:'2020-02-01',//调试人员
                debuggerPhone:'',//调试人员电话
                unitName:'',//安装公司
                unitId:'',//单位id
                status:'1'
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
            tableData:[{debuggerName:'2020-02-01',status:'1'},{debuggerName:'2020-02-01',status:'2'},{debuggerName:'2020-02-01',status:'3'}],
            treeData:[],//树数据
            filterText:'',
            smsPhoneTypeData:[],
            dialogVisible:false,
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
        handleNodeClick(data) { //点击树节点
            this.unitId=data.id;
            this.rows = 10
            this.currentPage = 1
            this.getData();
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
        detail(row){//跳转至维保计划
            console.log(row)
            this.$router.push({path:"/technicalService/maintenancePlan",query:{id:1,status:row.status}})
        },
        closedialog(){//关闭项目弹框
            this.dialogVisible=false;
        },
        opendialog(){//打开项目弹框
            this.dialogVisible=true;
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
        editBox(){//更新项目内容
            this.opendialog();
        },
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
    .servicePlan{
        .top{
            .el-input{
                width: 180px;
            }
        }
        /deep/ .el-dialog{
            width: 700px!important;
            .el-input{
                width: 250px;
            }
        }
    }

</style>