<template>
    <!-- 公告管理 -->
    <div id="pollingSummary" class='allcontent'>
      
         <!-- 头部 -->
            <div class="top">
               
                <div class="date">
                    <!-- 每日防火巡查记录 -->
                     <el-page-header @back="goBack" content="应急灯/疏散指示灯点检表">
                </el-page-header>
                </div>
                <div></div>
            </div>
            <!-- 内容 -->
            <div style='margin-top:10px;height: 88%;position: relative;'>
                <!-- 表格 -->
                <el-table					
                    :data="tableData"
                    border
                   >
                    <el-table-column
                    prop="updatedTime"
                    label="区域"
                    align="center"
                    width="140">
                    </el-table-column>
                    <el-table-column
                     label="点检项目"
                     align="center"
                     >
                        <el-table-column
                            prop="time"
                            label="有无接电源"
                            align="center"
                            width="120">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="灯泡有无损坏"
                            align="center"
                            width="120">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="应急灯插上电源"
                            align="center"
                            width="120">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="后绿灯是否显示"
                            align="center"
                            width="120">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="按测试按钮后应急灯是否亮灯"
                            align="center"
                            width="170">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="应急灯是否有破损"
                            align="center"
                            width="140">
                                 <template slot-scope="scope">
                                    <span >{{ scope.row.fireViolation==1&&scope.row.fireViolationDesc.status==2&&'√'||'' }}</span>
                                </template>
                        </el-table-column>

                    </el-table-column>
                    <el-table-column
                        prop="uname"
                        align="center"
                        label="点检人员签名"
                        width="140">
                    </el-table-column>
                    <el-table-column
                        prop="uname"
                        align="center"
                        label="数量"
                        width="90">
                    </el-table-column>
                     <el-table-column
                        prop="time"
                        align="center"
                        label="备注"
                        >
                    </el-table-column>
                </el-table>
             
                <div class="bottom"> 
                  
                </div>
            </div>
            <el-dialog
                width="475px"
                title="巡查任务详情"
                :visible.sync="pollingVisible"
                id="polling"
                >
                <div class="content">

                <div v-if="pollingDetail.fireViolation==1">
                    <div class="taskName">
                        <div>
                         <div class="line"></div> 用火用电违章情况
                        </div>
                    </div>
                    <div class="taskName">
                        <div>是否违章</div>
                        <div>
                            <el-radio-group v-model="pollingDetail.fireViolationDesc.status">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="2">否</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="taskName">
                       <div> 巡检时间</div>
                        <div>{{pollingDetail.fireViolationDesc.time&&pollingDetail.fireViolationDesc.time||''}}</div>
                    </div>
                    <div class="taskName">
                       <div> 巡检经纬度</div>
                        <div>
                            {{pollingDetail.fireViolationDesc.longitude&&pollingDetail.fireViolationDesc.longitude||''}},
                            {{pollingDetail.fireViolationDesc.latitude&&pollingDetail.fireViolationDesc.latitude||''}}
                        </div>
                    </div>
                    <div v-if="pollingDetail.fireViolationDesc.status==1">
                        <div class="title">巡检记录</div>
                        <div class="descript">
                            <div class="title1">检查情况</div>
                            <div class="textarea">
                                {{pollingDetail.fireViolationDesc.content}}
                            </div>
                        </div>
                        <div class="checkImage" v-if="pollingDetail.fireViolationDesc.checkImg.length">
                            <div class="title1">
                                巡查照片
                            </div>
                            <div class="imageList">
                                <img  v-for="(item, index) in pollingDetail.fireViolationDesc.checkImg" :key="index" :src="item" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sign_head">
                    签名
                </div>
                <div class="sign">
                    <img :src="pollingDetail.watchkeeperImgUrl" alt="">
                </div>
                <div style="margin-left:15px">巡检人员:{{pollingDetail.uname}}</div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
       
        return {
            pageNum:1,
            pageSize:10,
            total:0,
            tableData:[
             
            ],
            parameter:{},
            allDate:[],
            pollingVisible:false,
            pollingDetail:{},
            date:'',
            auditor:""
        }
    },
    methods:{
        editData(data){
            this.pollingVisible =true
            this.pollingDetail = data
        },
        getData(){
                this.axios({
                url:"/api/admin/fire/control/statistics/unit/single/summary/date",
                method:"post",
                data:{
                    ...this.parameter,
                    pageSize:10,
                    pageNum:1,
                }
            }).then( res =>{
                if( res.data.code ==0 ){
                  
                }else{
                    this.$alert(res.data.msg)
                }
            })
        },
        goBack(){
            this.$router.push({path: '/unitmanagement/lightPolling'});
        }
    },
    mounted(){
      if(this.$route.query.unitId){
          this.parameter = this.$route.query
          this.getData()
      }else{
        // this.goBack()
      }
    },
   
}
</script>

<style lang="scss">
    #pollingSummary{
         .el-table{
            border-bottom: 1px solid #EBEEF5;
        }
     .top{
         display: flex;
         align-items: center;
         border: none;
         .date{
             flex: 1;
         }
         
        .el-page-header__content{
            flex: 1;
             text-align: center;
             font-size: 29px;
        }
     }
      #polling{
            ul{
                padding-inline-start: 0px;
            }
            .top{
                width: 110%;
            }
            .content{
                background-color: #FBFBFB;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                padding-top: 10px;
                overflow: hidden;
            }
            .content1{
                background-color: #FFF;
            }
            .select{
                height: 50px;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 15px;
                .left {
                    width: 132px;
                    height: 40px;
                    line-height: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal;
                    border-bottom: 1px solid #EDE9E5;
                }
                .right{
                    border-bottom: 1px solid #EDE9E5;
                    height: 40px;
                    line-height: 40px;
                    width: 160px;
                    text-align: right;
                }

            }
            .taskName{
                display: flex;
                justify-content: space-between;
                align-items: center;
                // border-top: 1px solid #F5F3F1;
                border-bottom: 1px solid #F5F3F1;
                height: 50px;
                background-color: #FFF;
                padding: 0 15px;
                 .line{
                    height: 12px;
                    width: 4px;
                    background-color: #1B9BDF;
                    margin-right: 10px;
                    border-radius: 2px;
                }
            }
            .title{
                font-size: 12px;
                background-color: #FBFBFB;
                height: 20px;
                color: #8E9497;
                line-height: 30px;
                padding: 0 15px;
            }
             .title1{
                margin-top: 10px;
            }
            .descript{
                padding: 0 15px;
                margin: 10px 0;
                background-color: #FFF;
                .textarea{
                    min-height:136px;
                    width: 100%;
                    padding: 2%;
                    background: #F5F5F5;
                    border-radius: 4px;
                    margin-top: 10px;
                }
            }
            .checkImage{
                padding: 0 15px;
                font-size: 15px;
                color: #5A4B41;
                display: flex;
                flex-direction: column;
                background-color: #FFF;
                .imageList{
                    margin: 10px 0 13px;
                    img{
                        width: 78px;
                        height: 78px;
                        margin-right: 18px;
                    }
                }
            }
            .heads{
                height:  44px;
                display: flex;
                align-items: center;
                font-size: 15px;
                font-weight:600;
                background-color: #FBFBFB;
                width: 100%;
                .line{
                    height: 12px;
                    width: 4px;
                    background-color: #1B9BDF;
                    margin-right: 10px;
                    border-radius: 2px;
                }
            }
            .head{
                background-color: #FFF;
               border-bottom: 1px solid #EDE9E5;
            }
            .device{
                padding: 0 30rpx;
                width: 100%;
                height: 40px;
                line-height: 40px;
                background-color: #F5F5F5;
                margin-top: 10px;
                 width: calc(100% - 15px) ;
            }
            .sign_head{
                 padding: 0 15px;
                font-size: 15px;
                margin-bottom: 10px;
            }
            .sign{
                width: calc(100% - 30px) ;
                height: 75px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px dashed rgba(142,148,151,0.5);
                margin-left: 15px;
                margin-bottom: 10px;
                img{
                    transform: rotate(-90deg);
                    width: 70px;
                    height: 400px;
                }
            }
        }
     .bottom{
         display: flex;
         height: 15%;
         align-items: center;
         .date{
            flex: 1;
            overflow: auto;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
         }
         .tags{
             margin-right: 5px;
             margin-bottom: 5px;
         }
     }
     .name{
        text-decoration:underline;
        width: 40px;
     }
     .el-table thead.is-group th{
         background-color: #FFF;
     }
    }

</style>