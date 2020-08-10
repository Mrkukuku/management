<template>
    <div id="logManagement"  class='allcontent'>
        <el-col :span="4" class="tree_box" v-if="userTypes!=3">
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
                ></el-tree>
            </div>
        </el-col>
        <el-col :span="20" style="height:100%;">
            <!-- 查询 -->
            <div class="top">
                <div style="margin-left:10px">
                   {{platFromName}}:
                   <el-switch
                        v-model="platform"
                        active-color="#66b1ff"
                        inactive-color="#66b1ff"
                        @change="switchType"
                        >
                    </el-switch>
                    操作者:
                    <el-input v-model="username"></el-input>&nbsp;&nbsp;
                    日志类型:<el-select v-model="type" placeholder="Select">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                                </el-option>
                            </el-select>
                    时间日期：<el-date-picker
                        v-model="startTime"
                        type="date"
                        placeholder="选择开始日期时间"
                        value-format="yyyy-MM-dd"
                        class="picker">
                        </el-date-picker> -
                        <el-date-picker
                        v-model="endTime"
                        type="date"
                        :picker-options="expireTimeOptionEnd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束日期时间"
                        class="picker">
                        </el-date-picker>
                    <el-button type="primary" @click='searchsubmit'>查询</el-button>
                    <el-button @click='searchreset'>重置</el-button>
                </div>
            </div>

            <!-- 内容 -->
            <div class="bottom">
                <!-- 表格 -->
                    <el-table
                        :data="tableData"
                        border
                        @selection-change="SelectionChange"
                        style="width: 100%">
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        prop="username"
                        label="操作者"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="userIp"
                        label="操作IP"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="content"
                        label="操作内容"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="createdTime"
                        label="操作时间"
                        width="230">
                        </el-table-column>
                    </el-table>
                <!-- 分页 -->
                <div class='page_all'>
                    <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
                </div>
            </div>
        </el-col>
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
        return{
            module:'log',  //模块
            username:'',//操作者
            type:'',//日志类型
            startTime:'',//开始时间
            endTime:'',//结束时间
            userTypes:sessionStorage.getItem('userTypes'),
            treedefaultProps: {
                children: 'children',
                label: 'label'
            },
            options: [{
                value: '1',
                label: '用户操作'
                }, {
                value: '2',
                label: '单位操作',
                }, {
                value: '3',
                label: '建筑操作'
                }, {
                value: '4',
                label: '培训任务操作'
                }, {
                value: '5',
                label: '通讯录操作'
                }, {
                value: '6',
                label: '设备操作',
                }, {
                value: '7',
                label: '培训资料操作'
                }, 
                {
                    value: '8',
                    label: '设备资料操作'
                },
                
                ],
            options1:[
                {
                    value: '1',
                    label: '用户操作'
                },
                {
                    value: 9,
                    label: '设备离线日志'
                },
                {
                    value: 10,
                    label: '设备故障日志'
                },
                // {
                //     value: 11,
                //     label: '设备状态日志'
                // },
            ],
            options2: [{
                value: '1',
                label: '用户操作'
                }, {
                value: '2',
                label: '单位操作',
                }, {
                value: '3',
                label: '建筑操作'
                }, {
                value: '4',
                label: '培训任务操作'
                }, {
                value: '5',
                label: '通讯录操作'
                }, {
                value: '6',
                label: '设备操作',
                }, {
                value: '7',
                label: '培训资料操作'
                }, 
                {
                    value: '8',
                    label: '设备资料操作'
                },
                
                ],
            expireTimeOptionEnd: {
                disabledDate: time => {
                    let beginDateVal = this.startTime;
                    if (beginDateVal) {
                        return (
                            time.getTime() < new Date(beginDateVal).getTime()
                        );
                    }
                },
            },
            platform:true,
            platFromName:'后台',
            isBackSystem:0,//平台标识
            currentPage:1,
            rows:10,
            total:1,
        }
    },
    methods:{
        filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
        switchType () {//切换日志
            if ( this.platform ) {
                this.options = this.options2
                this.platFromName = "后台"
                this.isBackSystem = 0
            }else{
                 this.options = this.options1
                 this.platFromName = "监测平台"
                 this.isBackSystem = 1
            }
           this.searchreset()
        },
        searchsubmit(){//查询模糊搜索
            var _this=this;
            this.currentPage = 1;
            this.$refs.paginationChild.changePageNum(this.currentPage)
            this.axios({
                url   :'/api/admin/'+this.module+'/list',
                method: 'post',
                dataType:'json',
                data:{
                    unitId:this.companyId,
                    pageNum: this.currentPage,
                    pageSize: this.rows,
                    username:this.username,
                    type:this.type,
                    startTime:this.startTime,
                    endTime:this.endTime,
                    isBackSystem:this.isBackSystem
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.tableData = res.data.list;
                    _this.tableData.map( ( item ) => {
                        item.createdTime = item.createdTime && _this.$moment(item.createdTime).format("YYYY-MM-DD HH:mm:ss") || ''
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
        searchreset(){//查询重置
            this.username='';//操作者
            this.type='';//日志类型
            this.startTime='';//开始时间
            this.endTime='';//结束时间
            this.getData()
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
        handleNodeClick(data) { //点击树节点
            this.companyId=data.id;
            this.rows = 10
            this.currentPage = 1
            this.getData();
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.currentPage = item.page_index;
            this.rows = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
    },
    created(){
        this.companyId=sessionStorage.getItem('unitId');
    }
}
</script>

<style lang="scss" scoped>
    .top{
        .el-input, .el-date-editor{
            width: 180px!important;
        }
    } 
    /deep/ .el-table td, .el-table th{
        padding: 14px 0!important;
    }
     .el-tree--highlight-current /deep/ .el-tree-node.is-checked > .el-tree-node__content {
    background-color: rgb(255, 255, 255);
     color:rgb(64, 158, 255);
   }
 .el-tree--highlight-current /deep/ .el-tree-node.is-current > .el-tree-node__content {
    background-color: rgb(255, 255, 255);
   color:rgb(64, 158, 255);  }
</style>