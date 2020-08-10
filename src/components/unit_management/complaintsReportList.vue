<template >
    <!-- 投诉模块 -->
    <div id="complaintsReportList" class='allcontent'>
         <div id="erwei" style="display:none">
                    <img :src="imgUrl" alt="二维码">
                </div>
        <el-col :span="24" style="height:100%;padding-left:10px;">
            <!-- 头部 -->
            <div class="top">
                选择时间:<el-date-picker
                    v-model="startTime"
                    align="right"
                    type="date"
                    placeholder="开始日期">
                    </el-date-picker>
                    - <el-date-picker
                    v-model="endTime"
                    align="right"
                    type="date"
                    placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" @click='searchData'>查询</el-button>
                <el-button @click='searchreset'>重置</el-button>
                <el-button type="success" @click='haveEQ'>下载二维码</el-button>
                <div id="erwei" style="display:none">
                    <div style="display: flex;flex-direction: column;align-items: center;height:520px">
                        <img :src="imgUrl" alt="二维码">
                    </div>
                </div>
               

            </div>
            <div class="bottom">
                <!-- 表格 -->
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="name"
                    label="投诉人"
                    width="130">
                    </el-table-column>
                    <el-table-column
                    prop="phone"
                    label="电话"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="type"
                    label="场所类型"
                    width="250">
                    </el-table-column>
                    
                    <el-table-column
                    prop="address"
                    label="地址"
                    width="250">
                    </el-table-column>
                    <el-table-column
                    prop="createdTime"
                    label="时间"
                    width="95">
                    </el-table-column>
                    <el-table-column
                    prop="content"
                    label="投诉内容"
                    >
                    </el-table-column>
                    <!-- <el-table-column label="操作">
                        <template slot-scope='scope'>
                            <el-button
                                size="mini"
                                type="warning"
                                @click="searchBox(scope.row.id)">查看反馈</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
                <!-- 分页 -->
                <div class="page_all">
                    <pagination :total='total' ref="paginationChild" @pageChange="pageChange"></pagination>
                </div>

                <!-- 反馈详情 -->
            <!-- <el-dialog
                title="反馈信息"
                :visible.sync="selectReplySingleDialog"
                class='Feedback dialog'
                :close-on-click-modal="false"
                :before-close="closeReplySingle">
                    <div class="divBox">
                        <div class="descript">实际参加人数:</div>
                        <div>{{ReplySingleData.actualPersonNum}}</div>
                    </div>
                    <div class="divBox">
                        <div class="descript">演练反馈提交人员:</div>
                        <div>{{ReplySingleData.feedbackName}}</div>
                    </div>
                    <div class="textarea">
                        <div class="descript">演练反馈描述:</div>
                        <div>
                            {{ReplySingleData.content}}
                        </div>
                    </div>
                    <div class="textarea">
                        <div class="descript">公告图片:</div>
                        <div class="img">
                            <span style="display:inline-block;margin-left:10px;" v-for="item in ReplySingleData.imgUrlData" :key="item.id">
                                <img :src="item" alt="">
                            </span>
                            
                        </div>
                    </div>
            </el-dialog> -->
            </div>



        </el-col>
    </div>
</template>
<script>
import download from './../../js/download'
import pagination from '../Children/Pagination'
export default {
    data(){
        return {
            tableData:[],//表格数据
            pageNum:1,
            pageSize:10,
            total:0,
            startTime:'',//开始时间
            endTime:'',//结束时间
            unitId:'',//单位id
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            ruleForm:{
                name:'',//区域名称
                unitId:'',//演练单位
                endTime:'',//结束时间
                chargeId:'',//负责人
                type:'1',//演练类型
                address:'',//演练地点
                content:'',//演练描述
                planPersonNum:'',//预计人数参加
            },
            imgUrl:''
        }
    },
    components:{
        pagination:pagination
    },
    methods:{
        searchreset(){//模糊查询重置
            this.startTime='';//开始时间
            this.endTime='';//结束时间
            this.getData();
        },
        pageChange (item) {//页数页码改变页面重新刷新
            this.pageNum = item.page_index;
            this.pageSize = item.page_limit;
            this.getData(); //改变页码，重新渲染页面
        },
        searchData(){//模糊查询
            this.pageNum=1;
            this.$refs.paginationChild.changePageNum(this.pageNum)
            this.getData();
        },
        getData(){//获取列表数据
            var start=new Date(this.startTime);
            var end=new Date(this.endTime)
            if((this.startTime=='' && this.endTime=='') || start.getTime()<=end.getTime()){
                var _this=this;
                this.axios({
                    url:'/api/admin/complaints/page',
                    method:'post',
                    data:{
                        pageNum:this.pageNum,
                        pageSize:this.pageSize,
                        unitId:this.unitId,
                        startTime:this.startTime,
                        endTime:this.endTime
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        _this.tableData=res.data.list;
                        for(var i in  _this.tableData){
                            _this.tableData[i].createdTime=_this.$moment(_this.tableData[i].createdTime).format("YYYY-MM-DD");
                        }
                         
                        _this.total=res.data.total;
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
            }else{
                this.$message.error('开始时间不能小于结束时间')
            }
        },
        haveEQ(){//生成二维码
            var that=this;
            this.axios({
                url:'/api/admin/complaints/qr',
                method:'post',
                data:{
                    id:this.unitId,
                }
            }).then(res=>{
                if(res.data.code==0){
                    this.imgUrl=res.data.data;
                    var x=new XMLHttpRequest();
                    x.open("GET", this.imgUrl, true);
                    x.responseType = 'blob';
                    x.onload=function(){download(x.response, '图片',"text/plain"); }
                    x.send();
                        // this.$nextTick( ()=> {
                        //     setTimeout( () => {
                        //         var windows = that.print(document.getElementById('erwei').innerHTML,800,600);
                        //     },800)
                        // })
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
        print(content, w = null, h = null) {
            const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
            const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
            const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
            w = +w === 0 ? width : w;
            h = +h === 0 ? height : h;
            const left = ((width / 2) - (w / 2)) + dualScreenLeft;
            const top = ((height / 2) - (h / 2)) + dualScreenTop;
            var myWindow = window.open("", "打印", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
            var style = "<style type='text/css'>table.gridtable {font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;}table.gridtable th {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}table.gridtable td {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff;}</style>";
            myWindow.document.write(content + style);
            myWindow.focus();
            myWindow.document.close();     //关闭document的输出流, 显示选定的数据
            myWindow.print();   //打印当前窗口
            return myWindow;
        },

       
    },
    mounted() {
        this.unitId=sessionStorage.getItem('unitId')
        this.getData();
    },
    
}
</script>

<style lang="scss" scoped>
    #complaintsReportList{
        .top{
            .el-date-editor{
                width: 160px!important;
            }
        }
        /deep/ .el-dialog{
            width: 688px;
            .el-date-editor,.el-input{
                width: 200px!important;
            }
            .el-textarea{
                width: 500px;
            }
            
        }

        .Feedback{
        .divBox{
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #eee;
            &>div{
                display: inline-block;
            }
            &>div:nth-of-type(1){
                width: 150px;
            }
            &>div:nth-of-type(2){
                width: 400px;
            }
            .descript{
                font-size: 15px;
                margin-right: 20px;
            }
        }
        .textarea{
            height: 100px;
            border-bottom: 1px solid #eee;
            display:flex;

            &>div{
                display: inline-block;
            }
            &>div:nth-of-type(1){
                width: 100px;
                line-height: 100px;
            }
            &>div:nth-of-type(2){
                width: 80%;
                height: 90px;
                padding: 5px;
                overflow-y: auto;
                &::-webkit-scrollbar{
                    width: 5px;
                }
                &::-webkit-scrollbar-thumb { 
                    border-radius: 10px;
                    box-shadow: inset 0 0 5px #232D36;
                    background-color: #eeeeee;
                    height: 30px;
                }
            }
        }
        .img{
            img{
                margin-top: 5px;
                width: 80px;
                height: 80px;
                display: inline-block;
            }
        }

    }

    }
</style>