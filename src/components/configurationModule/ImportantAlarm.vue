<template>
<!-- 重要报警类型 -->
    <div id="ImportantAlarm"  class='allcontent'>
        <el-col :span="4" class="tree_box" v-if="userType!=3">
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
            <el-tabs v-model="activeName" v-if="activeName" @tab-click="handleClick">
                <el-tab-pane label="远程监控系统" name="1" :key="1">
                    <child1 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='list'></child1>
                </el-tab-pane>
                <el-tab-pane label="智慧用水系统" name="2" :key="2">
                    <child1 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='list'></child1>
                </el-tab-pane>
                <el-tab-pane label="智慧用电系统" name="3" :key="3">
                    <child1 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='list'></child1>
                </el-tab-pane>
                <el-tab-pane label="智能预警系统" name="4" :key="4">
                    <child1 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='list'></child1>
                </el-tab-pane>
                <el-tab-pane label="燃气监测系统" name="5" :key="5">
                    <child1 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='list'></child1>
                </el-tab-pane>
                <el-tab-pane label="智能电桩系统" name="6" :key="6">
                    <child1 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='list'></child1>
                </el-tab-pane>
                <el-tab-pane label="智能疏散系统" name="7" :key="7">
                    <child1 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='list'></child1>
                </el-tab-pane>
                <el-tab-pane label="视频监控系统" name="8" :key="8">
                    <child1 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='list'></child1>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </div>
</template>
<script>
import tab_Alarm_child1 from './../Children/tab_Alarm_child1'
import {Common} from './../../js/common'
export default {
    mixins:[Common],
    name: 'tabZujian',
    components:{
        child1:tab_Alarm_child1,
    },
    data() {
        return {
            //默认第一个选项卡
            module:'ImportantAlarm',
            activeName:'1',//选中系统类型
            typeData:[],//报警列表
            userType:sessionStorage.getItem('userTypes'),
            checkedAlarm:[],//选中报警列表
            ids:{       //单位id，系统id
                companyId:'',
                systemId:1,
                unit_show:false
            },
            treedefaultProps: {
                children: 'children',
                label: 'label'
            },
        }
    },
    methods:{
        handleClick(tab,event){ //点击八大系统有不同的报警类型
            this.ids.systemId=this.activeName;
            var _this=this;
            this.axios({
                url   :'/api/admin/alarm/alarmType',
                method: 'post',
                data  : {
                    pageNum:1,
                    pageSize: 1000,
                    systemId:this.activeName
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.typeData=res.data.list;
                }
            })
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
            // if(data.type==1){
                this.ids.unit_show=true;
                this.ids.companyId=data.id;
                this.rows = 10
                this.currentPage = 1
                this.list();
            // }else{
            //     this.ids.unit_show=false;
            // }
        },
        list(){//列表查询选中的报警类型
            var _this=this;
            this.axios({
                url   :'/api/admin/alarm/alarmList/query',
                method: 'post',
                data  : {
                    unitId: this.ids.companyId,
                    systemId:this.activeName
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.checkedAlarm=res.data.data.list?res.data.data.list:[];
                }
            })
        }
    },
    mounted(){
        this.handleClick();
    },
    created(){
        this.ids.companyId=sessionStorage.getItem('unitId');
    }
}
</script>
<style lang="scss">
    #ImportantAlarm .el-tabs__content{
        display: block;
        background-color: #ffffff;
    }
</style>