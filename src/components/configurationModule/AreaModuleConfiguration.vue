<template>
<!-- 区域管理 -->
    <div id='AreaModuleConfiguration' class='allcontent'>
         <!-- 头部 -->
        <div class="top">
            <div>
                <el-button type="primary" @click="opendialog"><i class="el-icon-plus"></i> 新增</el-button>
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
                prop="areaName"
                label="区域名称"
                width="200">
                </el-table-column>
                <el-table-column
                prop="unitNameList"
                label="单位集合"
                width="1000">
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
            <div style="position:absolute;bottom:0;">
                <pagination :total='total' @pageChange="pageChange"></pagination>
            </div>
        </div>

        <!-- 弹框 -->
        <el-dialog
            title="添加修改区域"
            :visible.sync="dialogVisible"
            width="30%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="区域名称" prop="areaName">
                        <el-input v-model="ruleForm.areaName"></el-input>
                    </el-form-item>
                    <el-form-item label="单位集合" prop="unitNameList">
                        <el-cascader
                            :options="options"
                            :props="props"
                            v-model="ruleForm.unitNameList"
                            collapse-tags
                            clearable>
                        </el-cascader>
                    </el-form-item>
                    <el-form-item class='formfooter'>
                        <el-button type="primary" @click="handleSubmit('ruleForm')" :disabled="nameFlag">立即提交</el-button>
                        <el-button @click="handleReset('ruleForm')">重置</el-button>
                        <el-button @click="closedialog">取 消</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>
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
    data(){
        let check_name = (rule, value, callback) => { 
            if ( !value ) {
                callback( new Error("请输入区域名称") )
            }else if ( this.checkName(value) ) {
                setInterval( () => {
                    if ( this.nameFlag ) {
                        callback( new Error("名称已存在") )
                    }else{
                        callback()
                    }
                },500)
               
            }else{
                callback()
            }
        }
        return {
            dialogVisible:false,
            module:'AreaModuleConfiguration',
            tableData:[],//区域列表
            ruleForm: {
                areaName: '',//区域名称
                unitNameList:[],//单位集合
                id:''
            },
            props: { multiple: true },
            options: [],//单位选项
            rules: {
                areaName: [
                    { validator:check_name, required: true, trigger: 'blur' },
                ],
                unitNameList: [
                    { required: true,message: '请选择区域', trigger: 'blur' },
                ]
            },
            nameFlag:false,
            currentPage:1,
            rows:10,
            total:1,
        }
    },
    methods:{
       checkName () {//验证区域名称
            this.axios({
                url:"/api/admin/area/name/isexist",
                method:"post",
                data:{
                    areaName:this.ruleForm.areaName,
                    pageNum:1,
                    pageSize:10,
                    areaId:this.ruleForm.id
                }
            }).then ( res => {
                  this.nameFlag = res.data.data
               })
            return true
       },
        getUnitList(){//单位列表
            var _this=this;
            this.axios({    
                url:'/api/admin/unit/all',
                method: 'post',
                data:{
                               
                }
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
        handleSubmit (data) {//新增和修改
        
            if ( this.ruleForm.id ) {
                this.axios({
                    url:"/api/admin/area/update",
                    method:"post",
                    data:{
                        id:this.ruleForm.id,
                        areaName:this.ruleForm.areaName,
                        unitIds:this.ruleForm.unitNameList
                    }
                }).then ( res => {
                    if ( res.data.code == 0) {
                        this.$alert("修改成功", '提示', {
                            confirmButtonText: 'OK',
                        });
                        this.handleReset()
                        this.dialogVisible = false
                        this.getData()
                    }else{
                        this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
            }else {

                this.axios({
                    url:"/api/admin/area/register",
                    method:"post",
                    data:{
                        areaName:this.ruleForm.areaName,
                       unitIds:this.ruleForm.unitNameList
                    }
                }).then( res => {
                    if ( res.data.code == 0) {
                        this.$alert("添加成功", '提示', {
                            confirmButtonText: 'OK',
                        });
                        this.handleReset()
                        this.getData()
                        this.dialogVisible = false
                    }else{
                        this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
            }
            
        },
        editData (id) {//编辑
            this.ruleForm.id = id
            this.axios({
                url:"/api/admin/area/detail",
                method:"post",
                data:{
                    id
                }
            }).then ( res => {
                this.dialogVisible = true
                this.ruleForm.areaName = res.data.data.areaName
                this.ruleForm.unitNameList = res.data.data.unitIds
            })
        },
        handleDelete (id) {
             this.$confirm('你确定要删除吗')
                .then(()=> {
                   this.axios({
                        url:"/api/admin/area/delete",
                        method:"post",
                        data:{
                            id:[id]
                        }
                    }).then ( res => {
                        if ( res.data.code == 0) {
                                this.$alert("删除成功", '提示', {
                                    confirmButtonText: 'OK',
                                });
                                this.getData()
                            }else{
                                this.$alert(res.data.msg, '提示', {
                                    confirmButtonText: 'OK',
                                });
                            }
                    })
                })
            
        },
        handleReset () {
            this.ruleForm.areaName = ""
            this.ruleForm.unitNameList = ""
            this.ruleForm.id = ""
        },
        closedialog () {
            this.dialogVisible = false;
            this.handleReset()
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.currentPage = item.page_index;
            this.rows = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
    },
    mounted() {
        this.getUnitList()
    },
}
</script>

<style lang="scss" scoped>
    #AreaModuleConfiguration{
         .el-table::before{
            width:0;
        }
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
</style>