<template>
    <!-- 服务计划 -->
    <div class="maintenancePlan allcontent">
        <!-- 头部 -->
        <div class="top">
            <div>
                标题:
                <el-input v-model="title"></el-input>&nbsp;&nbsp;
                <el-button type="primary" @click='searchsubmit'>查询</el-button>
                <el-button @click='searchreset'>重置</el-button>
                <template v-if="status==2">
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
                label="计划名称"
                width="200">
                </el-table-column>
                <el-table-column
                prop="unitName"
                label="执行人"
                width="190">
                </el-table-column>
                <el-table-column
                prop="debuggerName"
                label="下发状态"
                width="190">
                </el-table-column>
                <el-table-column
                prop="debuggerPhone"
                label="已完成"
                width="200">
                </el-table-column>
                <el-table-column
                prop="debuggerPhone"
                label="未完成"
                width="200">
                </el-table-column>
                <el-table-column
                prop="debuggerPhone"
                label="创建时间"
                width="200">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope='scope'>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="releasePlan(scope.row.id)"
                        >下发计划</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="position:absolute;bottom:0;">
                <pagination :total='total' ref="paginationChild"  @pageChange="pageChange"></pagination>
            </div>

            <!-- 弹框 -->
            <el-dialog
                title="添加/修改计划"
                :visible.sync="dialogVisible"
                width="30%"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closedialog">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                        <el-form-item label="项目名称" prop="title">   
                            <el-input v-model="ruleForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="执行人" prop="debuggerName">   
                            <el-select v-model="ruleForm.debuggerName" placeholder="请选择">
                                <el-option
                                v-for="item in smsPhoneTypeData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="计划性质" prop="debuggerName">   
                            <el-select v-model="ruleForm.debuggerName" placeholder="请选择">
                                <el-option
                                v-for="item in smsPhoneTypeData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="计划对应日期" prop="debuggerPhone">   
                            <el-select v-model="ruleForm.debuggerName" placeholder="请选择">
                                <el-option
                                v-for="item in smsPhoneTypeData"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="formfooter">
                            <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                            <!-- <el-button @click="handleReset('ruleForm')">重置</el-button> -->
                            <el-button @click="closedialog">取 消</el-button>
                        </el-form-item>
                </el-form>
            </el-dialog>
        </div>
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
            tableData:[{}],
            dialogVisible:false,
            filterText:'',
            smsPhoneTypeData:[],
            planId:'',//计划id
            status:'1'
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
                    //  _this.tableData = res.data.list;            
                    // _this.total= res.data.total;
                    // _this.currentPage= res.data.pageNum;
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
                    // this.tableData = res.data.data;
                }
            })
        },
        filterNode(value, data) {//树节点筛选
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        releasePlan(id){
            this.$router.push({path:"/technicalService/maintenanceItems",query:{id:1}})
        }
    },
    mounted(){
        this.planId=this.$route.query.id;
        this.status=this.$route.query.status;
        this.getData();
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
          }
      }
}
</script>

<style lang="scss" scoped>
    .maintenancePlan{
        .top{
            .el-input{
                width: 180px;
            }
        }
    }

</style>