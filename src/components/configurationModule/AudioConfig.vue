<template>
<!-- 声音任务 -->
    <div id='audio_config' class='allcontent'>
        <el-row style='height:100%'>
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
                        :props="defaultProps" 
                        @node-click="handleNodeClick" 
                        :render-content="renderContent"
                        highlight-current
                        :filter-node-method="filterNode"
                        ref="tree"
                    >
                    </el-tree>
                </div>
            </el-col> 
        <el-col :span="20" style='height:100%'>
        <!-- 内容 -->
        <div style='margin-top:10px;height: 88%;position: relative;padding-left:10px;'>
            <el-tabs v-model="activeName"  @tab-click="handleClick" type="card">
                <el-tab-pane label="重要报警声音配置" name="1">重要报警声音配置</el-tab-pane>
                <el-tab-pane label="非重要报警声音配置" name="2">非重要报警声音配置</el-tab-pane>
            </el-tabs>
            <div class="audio" v-show="alarmAudio == 1">
                <el-radio-group v-model="radio">
                    <el-radio :label="1" @click.native="audioPlay(1)">音频一</el-radio>
                    <el-radio :label="2" @click.native="audioPlay(2)">音频二</el-radio>
                </el-radio-group>
                <el-button type="primary" @click="submit(1)"> 提交 </el-button>
            </div>
            <div class="audio" v-show="alarmAudio == 2">
                <el-radio-group v-model="radio1">
                    <el-radio :label="1" @click.native="audioPlay(1)">音频一</el-radio>
                    <el-radio :label="2" @click.native="audioPlay(2)">音频二</el-radio>
                    <el-switch
                    v-model="value"
                    active-text="开启"
                    inactive-text="关闭">
                    </el-switch>
                    <el-button type="primary" @click="submit(2)"> 提交 </el-button>
                </el-radio-group>
            </div>
            <audio :src="audios" ref="audio" preload></audio>
        </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import {Common} from './../../js/common'
import song from '../../../static/audio/song.wav'
import song1 from '../../../static/audio/song1.mp3'
export default {
    mixins:[Common],
   data() {
       return {
            module:'AudioConfig',//模块
            userType:"",//用户类型
            unitId:'',//单位id
            voiceId:"",//主键id
            activeName: '1',//选项卡
            radio:1,//重要报警音频选项
            radio1:2,//非重要报警音频选项
            alarmAudio:1,//切换开关
            audios:song,//音频
            value:false,//非重要报警声音开关
       }
   },
    methods: {
        submit (type) {//提交
            var data = ""
            if ( type == 1 ) {
                data = {
                    id:this.voiceId,
                    voiceType:this.radio,
                    openStatus:1,
                    type
                }
            }else if ( type == 2 ) {
                var openStatus = ""
                if ( this.value ) {
                    openStatus = 1
                }else{
                    openStatus = 0
                }
                data = {
                    id:this.voiceId,
                    voiceType:this.radio1,
                    openStatus,
                    type
                }
            }
            this.axios({
                url:"/api/admin/voice/update",
                method:"post",
                data
            }).then ( res => {
                if ( res.data.code == 0 ) {
                    this.$alert( "修改成功",{
                        confirmButtonText: '确定'
                    })
                }else{
                    this.$alert(res.data.msg, {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        audioPlay ( type ) {//播放音频
            if ( type == 1 ) {
                this.audios = song 
            }else if ( type == 2 ) {
                this.audios = song1 
            }
            this.$refs.audio.load()
            var playPromise = this.$refs.audio.play();
            if (playPromise) {
                playPromise.then(() => {
                    // 音频加载成功
                    // 音频的播放需要耗时
                    setTimeout(() => {
                        // 后续操作
                    }, audio.duration * 1000); // audio.duration 为音频的时长单位为秒
        
        
                }).catch((e) => {
                    // console.log("Operation is too fast, audio play fails");
                });
            }

            clearTimeout( this.timer )
            this.timer = setTimeout ( () => {
                if ( !(this.$refs.audio.paused) ) {
                        this.$refs.audio.pause()
                    }
            },3000)
        },
        handleClick( tab ) {//切换
            this.alarmAudio = tab.name;
        },
        getData () {//获取数据
            this.axios({
                url:"/api/admin/voice/detail",
                method:"post",
                data:{
                    id:this.unitId
                }
            }).then ( res => {
                this.voiceId = res.data.data.id
                this.radio = res.data.data.importantAlarmVoice.voice
                this.radio1 = res.data.data.unimportanceAlarmVoice.voice
                var flag = res.data.data.unimportanceAlarmVoice.open
                if ( flag ) {
                    this.value = true
                }else{
                     this.value = false
                }
            })
        },
        handleNodeClick (data) {//点击树节点
           this.unitId = data.id
           this.getData()
        },
        Treeunit(){//单位树
            var _this=this;
            var url="api/admin/unit/list.left";
            this.axios({
                url   :url,
                method: 'post',
                params  : {
                    pageNum:1,
                    pageSize:1000,
                }
            }).then(res=>{
                if(res.data.code==0){
                    if(res.data.data){
                        _this.Treedata=res.data.data;
                        _this.data=res.data.data
                        for(var i=0;i<_this.Treedata.length;i++){
                            _this.Treedata[i].icon='el-icon-folder';
                        }
                    } 
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        },
    },
    mounted() {
        this.userType = sessionStorage.getItem('userTypes')
        this.unitId =Number(sessionStorage.getItem('unitId'))
        if ( this.userType !=3 ) {
            this.Treeunit()
        }
        this.getData()
    },
}
</script>

<style lang="scss" >
    #audio_config{
        .el-table::before{
            width:0;
        }
        .el-input{
            width:230px;
        }
        .top{
            border-bottom: 1px solid #eee;
        }
        .top .el-date-editor{
            width:180px;
        }
        .el-table--border{
            border: none;
        }
       .el-tabs__header{
           padding: 0;
       }
       .audio{
           margin-top: 20px;
           margin-left: 10px;
       }
       .el-button{
           margin-left:20px;
       }
       .el-switch{
           vertical-align: baseline;
           display: inline;
       }
    }
</style>