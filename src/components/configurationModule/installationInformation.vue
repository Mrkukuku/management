<template>
<!-- 安装信息管理 -->
    <div id='installationInformation' class='allcontent'>
        <!-- 导航树 -->
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

        <el-col :span="20" style="height:100%;">
            <!-- 头部 -->
            <div class="top">
                <div>
                    标题:
                    <el-input v-model="title"></el-input>&nbsp;&nbsp;
                    安装公司:
                    <el-input v-model="unitName"></el-input>&nbsp;&nbsp;
                    <el-button type="primary" @click='searchsubmit'>查询</el-button>
                    <el-button @click='searchreset'>重置</el-button>
                    <el-button type="primary" @click="opendialog"><i class="el-icon-plus"></i> 新增</el-button>
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
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    prop="title"
                    label="安装标题"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="installerName"
                    label="安装人姓名"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="installerPhone"
                    label="安装人电话"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="unitName"
                    label="安装公司"
                    width="250">
                    </el-table-column>
                    <el-table-column
                    prop="debuggerName"
                    label="调试人员姓名"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="debuggerPhone"
                    label="调试人员电话"
                    width="200">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <el-button
                            size="mini"
                            type="primary"
                            class='el-icon-edit'
                            @click="editdatas(scope.row.id)">编辑</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            class='el-icon-delete'
                            @click="handleDelete(scope.row.id)">删除</el-button>
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
                title="添加/修改安装信息"
                :visible.sync="dialogVisible"
                width="30%"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closedialog">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                        <el-form-item label="安装标题" prop="title">   
                            <el-input v-model="ruleForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="安装人姓名" prop="installerName">   
                            <el-input v-model="ruleForm.installerName"></el-input>
                        </el-form-item>
                        <el-form-item label="安装人电话" prop="installerPhone">   
                            <el-input v-model="ruleForm.installerPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="安装公司" prop="unitName">   
                            <el-input v-model="ruleForm.unitName"></el-input>
                        </el-form-item>
                        <el-form-item label="调试人员" prop="debuggerName">   
                            <el-input v-model="ruleForm.debuggerName"></el-input>
                        </el-form-item>
                        <el-form-item label="调试人员电话" prop="debuggerPhone">   
                            <el-input v-model="ruleForm.debuggerPhone"></el-input>
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
import {Common} from './../../js/common'
import download from './../../js/download'
import pagination from '../Children/Pagination'
export default {
    mixins:[Common],
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
    }
}
</script>

<style lang="scss" scoped>
    #installationInformation{
        .top{
            .el-input{
                width: 180px;
            }
        }
    }

</style>