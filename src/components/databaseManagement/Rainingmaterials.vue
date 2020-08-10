<template>
    <!-- 培训资料 -->
    <div id='database' class='allcontent'>
         <!-- 头部 -->
        <div class="top">
            <div>
                 文件名:
                <el-input v-model='key'></el-input>
                <el-button type="primary" @click="searchdata">查询</el-button>
                <el-button @click="searchReset">重置</el-button>
                <el-button type="primary" @click="opendialog"><i class="el-icon-plus"></i> 新增</el-button>
            </div>
        </div>
        <!-- 内容 -->
        <div style='margin-top:10px;height: 88%;position: relative;'>
            <!-- 表格 -->
            <el-table					
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="fileName"
                label="文件名称"
                width="230">
                </el-table-column>
                <el-table-column
                prop="userName"
                label="上传者"
                width="200">
                </el-table-column>
                <el-table-column
                prop="createdTime"
                label="上传时间"
                width="220">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope='scope'>
                        <el-button
                        size="mini"
                        type="danger"
                        class='el-icon-delete'
                        @click="handleDelete(scope.row.id)">删除</el-button>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleDown(scope.row.filePath)">下载</el-button>
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
            title="添加修改数据"
            :visible.sync="dialogVisible"
            width="30%"
            :close-on-click-modal="false"
            class='dialog'
            :before-close="closedialog">
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action=""
                    :on-change="beforeUpload"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">请选择文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-noMoreClick>上传文件</el-button>
                    <div class="el-upload__tip" slot="tip">files with a size less than 500kb</div>
                </el-upload>

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
        return {
            module:'train/file',  //模块
            key:'',
            upload:'',
            currentPage:1,
            rows:10,
            total:1,
        }
    },
    methods: {
        handleDown(path){
            if( path ){
                location.href= path
            }
        },
        beforeUpload(file) {       //上传前
            this.upload= file.raw;
        },
        submitUpload() { //文件上传
            // this.$refs.upload.submit();
            var _this=this;
            let formdata = new FormData();
            formdata.append('file', this.upload);
            this.axios({
                    url:'/api/admin/train/file/add',
                    method: 'post',
                    data:formdata
            }).then(res=>{
                if(res.data.code==0){
                    _this.$alert('添加成功', '提示', {
                        confirmButtonText: 'OK',
                        callback:() => {
                            _this.upload="";
                            document.getElementsByClassName('el-upload-list')[0].innerHTML='';
                            _this.dialogVisible=false;
                        }
                    });
                    _this.getData();
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        searchdata(){//模糊查询
            var _this=this;
            this.currentPage = 1;
            this.$refs.paginationChild.changePageNum(this.currentPage)
            this.axios({
                    url:'/api/admin/train/file/list',
                    method: 'post',
                    data:{
                        key:this.key,
                        unitId:sessionStorage.getItem('unitId'),
                        pageNum: this.currentPage,
                        pageSize: this.rows,
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.tableData = res.data.list;
                        _this.tableData.map( (item) =>{
                            item.createdTime = item.createdTime && this.$moment( item.createdTime).format("YYYY-MM-DD HH:mm") || ''
                        })
                        _this.total= res.data.total;
                        _this.currentPage= res.data.pageNum;
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
        },
        searchReset(){    //模糊查询
            this.key='';
            this.searchdata()
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
    #database{
        .el-select,.el-input{
            width:180px;
        }
        textarea{
            width:500px;
        }
        .upload-demo{
            width:100%;
            height:180px;
            position:relative;
        }
        .el-upload{
            margin-left:15%;
        }
        .el-upload__tip{
            margin-left:3%;
        }
    }
    

</style>