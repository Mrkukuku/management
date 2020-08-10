<template>
    <!-- 企业评分模板 -->
    <div id='unitscore' class='allcontent'>
        <el-col :span="3" class="tree_box">
            <el-tree :data="treedata"  :render-content="renderContent" @node-click="handleNodeClick"></el-tree>
            <!-- :props="defaultProps" -->
        </el-col>
         <el-col :span="21">
                <!-- 头部 -->
                <!-- <div class="top">
                    <div>
                        员工姓名:
                        <el-input v-model='staffName'></el-input>
                        <el-button type="primary" @click="searchmaillist">查询</el-button>
                        <el-button @click="resetmaillist">重置</el-button>
                        <el-button type="primary" @click="opendialog"><i class="el-icon-plus"></i> 新增</el-button>
                    </div>
                </div> -->
            <!-- 内容 -->
            <div style='margin-top:10px;height: 88%;'>
                <!-- 表格 -->
                <el-table					
                    :data="tableData"
                    border
                    style="width: 150">
                    <!-- <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column> -->
                    <el-table-column
                    prop="comment"
                    label="评分模板"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="lowNum"
                    label="最低次数"
                    width="250">
                    </el-table-column>
                    <el-table-column
                    prop="highNum"
                    label="最高次数"
                    width="270">
                    </el-table-column>
                    <el-table-column label="操作" v-if="Jurisdiction==-1">
                        <template slot-scope='scope'>
                            <el-button
                            size="mini"
                            type="primary"
                            class='el-icon-edit'
                            @click="editData(scope.row.id)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                  <!-- 分页 -->
            </div>
        </el-col>

        <!-- 弹框 -->
        <el-dialog
            title="添加修改数据"
            :visible.sync="dialogVisible"
            width="25%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="评分模板" prop="comment">
                        <el-input v-model="ruleForm.comment"></el-input>
                    </el-form-item> 
                    <el-form-item label="最低次数" prop="lowNum">
                        <el-input v-model="ruleForm.lowNum"></el-input>
                    </el-form-item> 
                    <el-form-item label="最高次数" prop="highNum">
                       <el-input v-model="ruleForm.highNum"></el-input>
                    </el-form-item>
                   
                    <el-form-item class='submitagency formfooter'>
                        <el-button type="primary" @click="handleSubmit('ruleForm')">立即提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                        <el-button @click="closedialog">取 消</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {Common} from './../../js/common'
export default {
    mixins:[Common],
    data(){
        return {
            module:'mark',
            staffName:'',//模糊查询字段
            Jurisdiction:sessionStorage.getItem('unitId'),//用户权限
            options:[{
                type:'',
                desc:'',
            }],
            treedata: [{
                label: '物联',
                id:1,
                icon:"el-icon-document",
            },{
                label: '隐患',
                id:2,
                icon:"el-icon-document",
            },{
                label: '履职',
                id:3,
                icon:"el-icon-document",
            }],
            ruleForm: {
                id:null,//企业Id
                lowNum: '',//最低次数
                highNum:'',//最高次数
                comment:''//评分模板
               
            },
            rules: {
                staffName: [
                    { required: true, message: '请输入员工姓名', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                ],
                startTime: [
                    { required: true, message: '请输入开始时间', trigger: 'blur' },
                ],
                endTime: [
                    { required: true, message: '请选择结束时间', trigger: 'blur' },
                ],
            }
        }
    },
    methods:{
        searchmaillist(){  //模糊查询
            var _this=this;
            this.axios({    
                url:'/api/admin/train/task/list',
                method: 'post',
                data:{
                    unitId:44,
                    pageSize:this.rows,
                    pageNum:this.currentPage,
                    taskName:this.taskName,
                    trainTime:this.tacktime
                }
            }).then(res=>{
                if(res.data.code==0){
                     _this.tableData = res.data.list;            
                    _this.total= res.data.total;
                    _this.currentPage= res.data.pageNum;
                    if(_this.tableData){
                        for(var i=0;i<_this.tableData.length;i++){
                            _this.tableData[i].trainTime=_this.$moment(_this.tableData[i].trainTime).format("YYYY-MM-DD");
                        }
                    }
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        resetmaillist(){   //模糊查询重置
            this.taskName="";
        },
        handleNodeClick(data) { //树节点点击
        this.axios( {
            url:'/api/admin/mark/list',
            method: 'post',
            data:{
                scoreType:data.id
            }
        }).then( res => {
           
            this.tableData = res.data.data
           
        })
        

        },
        //树节点方法
        renderContent(h, { node, data}) { //树前小图标
            // console.log(node)
            return (
              <span>
                <i class={data.icon}></i>
                &nbsp;<span>{node.label}</span>
              </span>
              );
        },
        resetForm () {

            this.ruleForm.comment = ''
            this.ruleForm.lowNum = ''
            this.ruleForm.highNum = ''
        }
       
    }
}
</script>

<style lang="scss" scoped>
    #unitscore{
        position: relative;
        .el-select,.el-input{
            width:180px;
        }
        textarea{
            width:500px;
        }
        .top .el-date-editor{
            width:180px!important;
        }

    }

</style>