<template>
    <div class="maintenanceItems allcontent">
        <!-- 头部 -->
        <div class="top">
            <div>
                标题:
                <el-input v-model="title"></el-input>&nbsp;&nbsp;
                <el-button type="primary" @click='searchsubmit'>查询</el-button>
                <el-button @click='searchreset'>重置</el-button>
                <el-button type="success" @click="opendialog">导入维保项</el-button>
            </div>
        </div>
        <!-- 内容 -->
        <div style='margin-top:10px;height: 88%;position: relative;'>
            <el-table					
                :data="tableData"
                border
                 @selection-change="handleSelectionChange"
                style="width:150">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                prop="debuggerPhone"
                label="测试日期"
                width="150">
                </el-table-column>
                <el-table-column
                prop="debuggerPhone"
                label="系统名称"
                width="190">
                </el-table-column>
                <el-table-column
                prop="debuggerPhone"
                label="维保项目"
                width="190">
                </el-table-column>
                <el-table-column
                prop="debuggerPhone"
                label="维保内容"
                width="200">
                </el-table-column>
                <el-table-column
                prop="debuggerPhone"
                label="位置"
                width="200">
                </el-table-column>
                <el-table-column
                prop="debuggerPhone"
                label="计划下发状态"
                width="110">
                </el-table-column>
                <el-table-column
                prop="debuggerPhone"
                label="工程师"
                width="80">
                </el-table-column>
                <el-table-column
                prop="debuggerPhone"
                label="计划完成状态"
                width="110">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope='scope'>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="setLocation(scope.row.id)"
                        >设置时间位置</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align:center">
                <el-button type="primary" plain>下发计划</el-button>
                <el-button plain>取消</el-button>
            </div>
            <!-- 弹框 -->
            <el-dialog
                title="导入维保项目"
                :visible.sync="dialogVisible"
                width="30%"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closedialog">
                选择维保项目:
                    <el-cascader
                        :options="options"
                        :props="props"
                        collapse-tags
                        filterable
                        v-model="cascaderValue"
                        @change="cascaderChange"
                        clearable></el-cascader>
                <el-button type="primary">导入</el-button>
            </el-dialog>

            <!-- 弹框 -->
            <el-dialog
                title="设置时间位置"
                :visible.sync="dialogVisibleTime"
                :close-on-click-modal="false"
                class='dialog'
                :before-close="closeTimeDialog">
                <div class="timeBox">
                    <div class="cssRowBox">
                        <div>
                            时间 : &nbsp;
                        </div>
                        <div>
                            <el-date-picker
                                v-model="datePicker"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="cssRowBox">
                        <div>
                            位置 : &nbsp;
                        </div>
                        <div>
                            <el-input v-model="address" type="textarea"></el-input>
                        </div>
                    </div>
                    <div class="cssRowBox" style="justify-content:center">
                        <el-button type="primary">确定</el-button>
                        <el-button @click="closeTimeDialog">取消</el-button>
                    </div>
                </div>
                
                    
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
            tableData:[
                {
                    id:'1'
                },
                {
                    id:'2'
                },
                {
                    id:'3'
                },
                {
                    id:'4'
                },
                {
                    id:'5'
                },
                {
                    id:'6'
                },
                {
                    id:'7'
                },
                {
                    id:'8'
                },
                {
                    id:'9'
                },
                {
                    id:'10'
                },
                {
                    id:'11'
                },
                {
                    id:'12'
                }
            ],
            dialogVisible:false,
            filterText:'',
            planId:'',//计划id
            selectionValue:[],//选中的值
            options: [{
                value: 1,
                label: '东南',
                children: [{
                    value: 2,
                    label: '上海',
                    children: [
                    { value: 3, label: '普陀' },
                    { value: 4, label: '黄埔' },
                    { value: 5, label: '徐汇' }
                    ]
                }, {
                    value: 7,
                    label: '江苏',
                    children: [
                    { value: 8, label: '南京' },
                    { value: 9, label: '苏州' },
                    { value: 10, label: '无锡' }
                    ]
                }, {
                    value: 12,
                    label: '浙江',
                    children: [
                    { value: 13, label: '杭州' },
                    { value: 14, label: '宁波' },
                    { value: 15, label: '嘉兴' }
                    ]
                }]
                },
                {
                    value: 17,
                    label: '西北',
                    children: [{
                    value: 18,
                    label: '陕西',
                    children: [
                    { value: 19, label: '西安' },
                    { value: 20, label: '延安' }
                    ]
                }, {
                    value: 21,
                    label: '新疆维吾尔族自治区',
                    children: [
                    { value: 22, label: '乌鲁木齐' },
                    { value: 23, label: '克拉玛依' }
                    ]
                }]
            }],
            props:{ multiple: true },
            cascaderValue:[],
            dialogVisibleTime:false,
            address:'',
            datePicker:[],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
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
        filterNode(value, data) {//树节点筛选
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        handleSelectionChange(val){//列表选中
            this.selectionValue=[];
            for(var i in val){
                this.selectionValue.push(val[i].id)
            }
        },
        cascaderChange(val){//选择维保项目选中
            console.log(val)
        },
        setLocation(){//打开设置时间
            this.dialogVisibleTime=true;
        },
        closeTimeDialog(){//关闭设置时间
            this.dialogVisibleTime=false;
        }
    },
    mounted(){
        this.planId=this.$route.query.id;
        // this.getData();
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
          }
      }
}
</script>

<style lang="scss" scoped>
    .maintenanceItems{
        .top{
            .el-input{
                width: 180px;
            }
        }
        /deep/ .el-dialog{
            width: 700px!important;
        }
        .timeBox{
            .cssRowBox{
                display: flex;
                margin-top: 20px;
                align-items: center;
                font-size: 16px;
                /deep/ .el-date-editor{
                    width: 400px!important;
                }
                .el-textarea{
                    width: 500px!important;
                }
            }
        }
    }

</style>