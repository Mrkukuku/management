<template>
<!-- 培训任务管理 -->
    <div id='trainingtask' class='allcontent'>
         <!-- 头部 -->
        <div class="top">
            <div>
                 培训计划名称:
                <el-input v-model='taskName'></el-input>
                &nbsp;&nbsp;培训时间:
                <el-date-picker
                v-model="tacktime"
                type="date"
                placeholder="请输入培训时间">
                </el-date-picker>
                <el-button type="primary" @click="searchtraniningtask">查询</el-button>
                <el-button @click="resettraniningtask">重置</el-button>
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
                prop="taskName"
                label="培训计划名称"
                width="200">
                </el-table-column>
                <el-table-column
                prop="trainFileName"
                label="培训文件"
                width="250">
                </el-table-column>
                <el-table-column
                prop="username"
                label="发布人"
                width="200">
                </el-table-column>
                <el-table-column
                prop="depict"
                label="培训大纲"
                width="350">
                </el-table-column>
                <el-table-column
                prop="trainTime"
                label="培训时间"
                width="200">
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
                        <el-button
                        size="mini"
                        type="success"
                        class='el-icon-download'
                        @click="handledownload(scope.row.trainFileId)">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="position:absolute;bottom:0;">
                <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
            </div>
        </div>

        <!-- 弹框 -->
        <el-dialog
            title="添加修改培训任务"
            :visible.sync="dialogVisible"
            width="30%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="培训名称" prop="taskName">
                        <el-input v-model="ruleForm.taskName"></el-input>
                    </el-form-item>
                    <el-form-item label="培训文件" prop="trainFileId">
                        <el-select v-model="ruleForm.trainFileId" placeholder="--请选择--">
                            <el-option
                                v-for="item in FileList"
                                :key="item.id"
                                :label="item.fileName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="单位集合" prop="unitIds">
                        <el-cascader
                        v-model="unitIds_cascader"
                        :options="factoryList"
                        :props="props"
                        @change="cascadervalue"
                        collapse-tags
                        clearable></el-cascader>
                    </el-form-item>    
                    <el-form-item label="培训时间" prop="trainTime">
                        <el-date-picker
                        v-model="ruleForm.trainTime"
                        type="date"
                        :picker-options="expireTimeOption"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="培训描述" prop="depict">
                        <el-input type="textarea" v-model="ruleForm.depict"></el-input>
                    </el-form-item>
                    <el-form-item class='formfooter'>
                        <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                        <!-- <el-button @click="handleReset('ruleForm')">重置</el-button> -->
                        <el-button @click="closedialog">取 消</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>
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
            module:'train/task',
            taskName:'',//模糊查询字段
            tacktime:'',//模糊查询字段
            Jurisdiction:sessionStorage.getItem('unitId'),//用户权限
            FileList:[],//文件列表
            factoryList:[],//单位列表
            unitIds_cascader:[], //单位列表
            props: { multiple: true,checkStrictly: true },
            options: [],
            ruleForm: {
                id:null,
                taskName: '',//培训名称
                trainFileId:'',//培训文件
                trainTime:'',//培训时间
                unitIds:[],//单位id集合
                depict:'',//培训描述
            },
            rules: {
                taskName: [
                    { required: true, message: '请输入培训名称', trigger: 'blur' },
                ],
                trainFileId: [
                    { required: true, message: '请输入培训文件', trigger: 'blur' },
                ],
                trainTime: [
                    { required: true, message: '请输入培训时间', trigger: 'blur' },
                ],
                unitIds: [
                    { required: true, message: '请选择单位集合', trigger: 'blur' },
                ],
            },
            expireTimeOption: {//时间范围
                disabledDate(date) {
                    return date.getTime()+24*60*60*1000 < Date.now();
                }
            },
            currentPage:1,
            rows:10,
            total:1,
        }
    },
    methods:{
        filelist(){ //资料列表
            var _this=this;
            this.axios({    
                url:'/api/admin/train/file/list',
                method: 'post',
                data:{
                    unitId:sessionStorage.getItem('unitId'),
                    pageSize:999,
                    pageNum:1
                }
            }).then(res=>{
                if(res.data.code==0){
                    if(res.data.list){
                        _this.FileList=res.data.list;
                    }
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        factorylist(){//公司列表
            var _this=this;
            this.axios({    
                url:'/api/admin/unit/task/list',
                method: 'post',
            }).then(res=>{
                if(res.data.code==0){
                    if(res.data.data){
                        _this.factoryList=res.data.data;
                    }
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        searchtraniningtask(){  //模糊查询
            var _this=this;
            this.currentPage=1;
            this.$refs.paginationChild.changePageNum(this.currentPage)
            this.axios({    
                url:'/api/admin/train/task/list',
                method: 'post',
                data:{
                    unitId:sessionStorage.getItem('unitId'),
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
        resettraniningtask(){   //模糊查询重置
            this.taskName="";
            this.tacktime="";
            this.searchtraniningtask()
        },
        handledownload(id){//下载
            var _this=this;
            this.axios({    
                url:'/api/admin/train/file/search/single',
                method: 'post',
                data:{
                    id:id
                }
            }).then(res=>{
                if(res.data.code==0){
                    // let url =res.data.data.filePath;
                    // let filename =res.data.data.fileName;
                    // _this.getBlob(url,function(blob){
                    //     _this.saveAs(blob, filename);
                    // })
                    location.open(res.data.data.filePath)
                
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
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

        cascadervalue(value){
            var datavalue=[];
            console.log(value)
            for(var i=0;i<value.length;i++){
                for(var j=0;j<value[i].length;j++){
                    if(datavalue.indexOf(value[i][j])==-1){
                        datavalue.push(value[i][j])
                    }
                }
            }
           var aa=value.join('-');
            this.ruleForm.unitIds=datavalue;
            console.log(this.ruleForm.unitIds)
            this.ruleForm.note=aa;
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
    #trainingtask{
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