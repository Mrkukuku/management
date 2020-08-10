<template>
<!-- 短信电话配置-->
    <div id="SMSPhone"  class='allcontent'>
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
        <el-col :span="20" style="height:100%;" v-if="ids.unit_show || userType==3">
            <el-tabs v-model="activeName" v-if="activeName" @tab-click="handleClick">
                <el-tab-pane label="远程监控系统" name="1" :key="1">
                    <child2 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='handleClick'></child2>
                </el-tab-pane>
                <el-tab-pane label="智慧用水系统" name="2" :key="2">
                    <child2 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='handleClick'></child2>
                </el-tab-pane>
                <el-tab-pane label="智慧用电系统" name="3" :key="3">
                    <child2 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='handleClick'></child2>
                </el-tab-pane>
                <el-tab-pane label="智能预警系统" name="4" :key="4">
                    <child2 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='handleClick'></child2>
                </el-tab-pane>
                <el-tab-pane label="燃气监测系统" name="5" :key="5">
                    <child2 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='handleClick'></child2>
                </el-tab-pane>
                <el-tab-pane label="智能电桩系统" name="6" :key="6">
                    <child2 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='handleClick'></child2>
                </el-tab-pane>
                <el-tab-pane label="智能疏散系统" name="7" :key="7">
                    <child2 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='handleClick'></child2>
                </el-tab-pane>
                <el-tab-pane label="视频监控系统" name="8" :key="8">
                    <child2 :name='typeData' :ids='ids' :checkedCities='checkedAlarm' @list='handleClick'></child2>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </div>
</template>
<script>
import tab_Alarm_child2 from './../Children/tab_Alarm_child2'
import {Common} from './../../js/common'
export default {
    mixins:[Common],
    name: 'tabZujian',
    components:{
        child2:tab_Alarm_child2,
    },
    data() {
        return {
            //默认第一个选项卡
            activeName:'1',//选中系统类型
            module:'SmsPhone',
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
                url   :'/api/admin/sms/alarmType',
                method: 'post',
                data  : {
                    pageNum:1,
                    pageSize: 1000,
                    systemId:this.activeName,
                    unitId:this.ids.companyId
                }
            }).then(res=>{
                if(res.data.code==0){
                    _this.typeData=res.data.data[0];
                    _this.checkedAlarm=res.data.data[1]?res.data.data[1]:[];

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
            if(data.type==1){
                this.ids.unit_show=true;
                this.ids.companyId=data.id;
                this.rows = 10
                this.currentPage = 1
                this.handleClick();
                // this.list();

            }else{
                this.ids.unit_show=false;
            }
            
        },
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
    #SMSPhone .el-tabs__content{
        display: block;
        background-color: #ffffff;
    }
</style>