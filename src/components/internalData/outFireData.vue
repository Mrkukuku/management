<template>
    <div id="drillTaskmanagement" class='allcontent'>
         <el-col :span="4" class="tree_box" v-if="userType==1 ||userType==2">
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
                    highlight-current
                    :filter-node-method="filterNode"
                    ref="tree"
                >
                </el-tree>
            </div>
        </el-col>
        <el-col :span="20" style="height:100%;padding-left:10px;">
            <!-- 头部 -->
            <div class="top">
                <el-button type="primary">新增</el-button>
            </div>
        </el-col>
    </div>
</template>
<script>
export default {
    data(){
        return{
            Treedata:[],
            treedefaultProps: {
                children: 'children',
                label: 'label'
            },
            unitId:'',
            filterText:'',
            userType:''
        }
    },
    methods:{
        handleNodeClick(data){ //点击树节点
            this.unitId=data.id;
        },
        filterNode(value, data) {//树节点筛选
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        getTreeData(){//获取单位树状图列表
            var _this=this;
            this.axios({
                url   :"api/admin/unit/list.left",
                method: 'post',
                params  : {
                    pageNum:1,
                    pageSize:1000,
                }
            }).then(res=>{
                if(res.data.code==0){
                    this.Treedata=res.data.data;
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
    },
    mounted(){
        this.userType=sessionStorage.getItem('userTypes');
        this.getTreeData();
    },
    watch:{
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    }
}
</script>
