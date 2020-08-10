<template>
    <div class="electronic">
        <el-form :model="ruleForm" status-icon ref="ruleForm" :rules="rules" class="demo-ruleForm">
            <div class="textDesc">单位门头照，表示违法行为存在位置</div>
            <el-form-item label="拍摄时间" prop="unitTime">
                <el-date-picker
                    v-model="ruleForm.unitTime"
                    type="date"
                    @blur="blurTime"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="拍摄点" prop="unitAddress">
                <el-input v-model="ruleForm.unitAddress" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="拍摄描述" prop="unitContent">
                <el-input v-model="ruleForm.unitContent" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <div class="hoverImage">只能是jpg,png格式，最大10M</div>
                <el-upload
                    action="#"
                    list-type="picture-card"
                    :on-change="handleChange1"
                    multiple
                    :http-request="upload1"
                    :on-remove="handleRemove1"
                    :file-list="ruleForm.unitImage"
                    :limit="5"
                    ref="unload1"
                    >
                    <i slot="default" class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <div class="textDesc">违法行为现场照片</div>
            <el-form-item label="拍摄时间" prop="sceneTime">
                <el-date-picker
                    v-model="ruleForm.sceneTime"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="拍摄点" prop="sceneAddress">
                <el-input v-model="ruleForm.sceneAddress" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="拍摄描述" prop="sceneContent">
                <el-input v-model="ruleForm.sceneContent" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item >
                <div class="hoverImage">只能是jpg,png格式，最大10M</div>
                <el-upload
                    action="#"
                    list-type="picture-card"
                    :on-change="handleChange2"
                    :http-request="upload2"
                    :on-remove="handleRemove2"
                    :file-list="ruleForm.sceneImage"
                    multiple
                    :limit="5"
                    ref="unload2"
                    >
                        <i slot="default" class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <div class="textDesc">违法行为人现场照片</div>
            <el-form-item label="拍摄时间" prop="peopleTime">
                <el-date-picker
                    v-model="ruleForm.peopleTime"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="拍摄点" prop="peopleAddress">
                <el-input v-model="ruleForm.peopleAddress" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="拍摄描述" prop="peopleContent">
                <el-input v-model="ruleForm.peopleContent" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item >
                <div class="hoverImage">只能是jpg,png格式，最大10M</div>
                <el-upload
                    action="#"
                    list-type="picture-card"
                    :on-change="handleChange3"
                    :http-request="upload3"
                    multiple
                    :on-remove="handleRemove3"
                    :file-list="ruleForm.peopleImage"
                    :limit="5"
                    ref="unload3"
                    >
                        <i slot="default" class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="违法行为人签名" prop="delinquent">
                <el-input v-model="ruleForm.delinquent" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="submitButton">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            ruleForm:{
                unitTime:'',//违法存在位置 拍摄时间
                unitAddress:'',//违法存在位置 拍摄地址
                unitContent:'',//违法存在位置 拍摄描述
                unitImage:[],//违法存在位置 照片

                sceneTime:'',//违法行为现场照片 拍摄时间
                sceneAddress:'',//违法行为现场照片 拍摄地址
                sceneContent:'',//违法行为现场照片 拍摄描述
                sceneImage:[],//违法行为现场照片 照片
                
                peopleTime:'',//违法行为人现场照片 拍摄时间
                peopleAddress:'',//违法行为人现场照片 拍摄地址
                peopleContent:'',//违法行为人现场照片 拍摄描述
                peopleImage:[],//违法行为人现场照片 照片
                delinquent:'',//违法行为人签名
            },
            rules:{
                unitTime: [
                    { required: true, message: '请选择拍摄时间', trigger: 'blur' },
                ],
                unitAddress: [
                    { required: true, message: '请输入拍摄地址', trigger: 'blur' },
                ],
                unitContent: [
                    { required: true, message: '请输入拍摄描述', trigger: 'blur' },
                ],

                sceneTime: [
                    { required: true, message: '请选择拍摄时间', trigger: 'blur' },
                ],
                sceneAddress: [
                    { required: true, message: '请输入拍摄地址', trigger: 'blur' },
                ],
                sceneContent: [
                    { required: true, message: '请输入拍摄描述', trigger: 'blur' },
                ],

                peopleTime: [
                    { required: true, message: '请选择拍摄时间', trigger: 'blur' },
                ],
                peopleAddress: [
                    { required: true, message: '请输入拍摄地址', trigger: 'blur' },
                ],
                peopleContent: [
                    { required: true, message: '请输入拍摄描述', trigger: 'blur' },
                ],
                delinquent: [
                    { required: true, message: '请输入违法行为人签名', trigger: 'blur' },
                ],
            },
            disabled: false,
            uploads:'',
            taskId:'',//页面识别id
        }
    },
    methods:{
        handleRemove1(file) {
            for(var i in this.ruleForm.unitImage){
                if(this.ruleForm.unitImage[i].uid==file.uid){
                    this.ruleForm.unitImage.splice(i,1);
                }
            } 
        },
        handleRemove2(file) {
            for(var i in this.ruleForm.sceneImage){
                if(this.ruleForm.sceneImage[i].uid==file.uid){
                    this.ruleForm.sceneImage.splice(i,1);
                }
            } 
        },
        handleRemove3(file) {
            for(var i in this.ruleForm.peopleImage){
                if(this.ruleForm.peopleImage[i].uid==file.uid){
                    this.ruleForm.peopleImage.splice(i,1);
                }
            } 
        },
        handleChange1(file){
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'jpg'
            const extension2 = testmsg === 'png'
            const isLt2M = file.size / 1024 / 1024 < 10
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是jpg,png格式!',
                    type: 'warning'
                });
                this.$refs.upload1.clearFiles();
                return ;
            }
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 10MB!',
                    type: 'warning'
                });
                this.$refs.upload1.clearFiles();
                return ;
            }
            this.uploads= file.raw;
        },
        handleChange2(file){
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'jpg'
            const extension2 = testmsg === 'png'
            const isLt2M = file.size / 1024 / 1024 < 10
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是jpg,png格式!',
                    type: 'warning'
                });
                this.$refs.upload2.clearFiles();
                return ;
            }
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 10MB!',
                    type: 'warning'
                });
                this.$refs.upload2.clearFiles();
                return ;
            }
            this.uploads= file.raw;
        },
        handleChange3(file){
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'jpg'
            const extension2 = testmsg === 'png'
            const isLt2M = file.size / 1024 / 1024 < 10
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是jpg,png格式!',
                    type: 'warning'
                });
                this.$refs.upload3.clearFiles();
                return ;
            }
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 10MB!',
                    type: 'warning'
                });
                this.$refs.upload3.clearFiles();
                return ;
            }
            this.uploads= file.raw;
        },
        upload1(){
            var _this=this;
            let formdata = new FormData();
            formdata.append('file', this.uploads);
            formdata.append('fileType',4);
            this.axios({
                url   : "/api/admin/file/upload",
                method: 'post',
                data  :formdata
            }).then(res=>{    
                if(res.data.code==0){
                    this.ruleForm.unitImage.push({url:res.data.data.fileUrl,uid:this.uploads.uid});
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }                                             
            })
        },
        upload2(){
            var _this=this;
            let formdata = new FormData();
            formdata.append('file', this.uploads);
            formdata.append('fileType',4);
            this.axios({
                url   : "/api/admin/file/upload",
                method: 'post',
                data  :formdata
            }).then(res=>{    
                if(res.data.code==0){
                    this.ruleForm.sceneImage.push({url:res.data.data.fileUrl,uid:this.uploads.uid});
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }                                             
            })
        },
        upload3(){
            var _this=this;
            let formdata = new FormData();
            formdata.append('file', this.uploads);
            formdata.append('fileType',4);
            this.axios({
                url   : "/api/admin/file/upload",
                method: 'post',
                data  :formdata
            }).then(res=>{    
                if(res.data.code==0){
                    this.ruleForm.peopleImage.push({url:res.data.data.fileUrl,uid:this.uploads.uid});
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }                                             
            })
        },
        submitForm(name){
            var _this=this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.ruleForm.unitImages=JSON.stringify(this.ruleForm.unitImage)
                    this.ruleForm.sceneImages=JSON.stringify(this.ruleForm.sceneImage)
                    this.ruleForm.peopleImages=JSON.stringify(this.ruleForm.peopleImage)
                    var url='/api/admin/police/images/add';
                    if(this.taskId){
                        url='/api/admin/police/images/update'
                    }
                    this.axios({
                        method: 'post',
                        url: url,
                        data: this.ruleForm,
                    }).then(res => {  //res是返回结果
                        if(res.data.code==0){
                            this.$message({
                                message: '保存成功,即将跳转',
                                type: 'success'
                            });
                            sessionStorage.setItem('taskId',res.data.data)
                            setTimeout(function(){
                                _this.$router.push('/addTask')
                            },1000)
                        }else{
                            _this.$alert(res.data.msg, '提示', {
                                confirmButtonText: 'OK',
                            });
                        }
                    })
                }
            })
        },
        blurTime(){//第一个时间离开
            if(this.ruleForm.unitTime){
                this.ruleForm.sceneTime=this.ruleForm.unitTime;
                this.ruleForm.peopleTime=this.ruleForm.unitTime;
            }
        },
        getDetail(){
            this.axios({
                method: 'post',
                url: '/api/admin/police/images/single',
                data:{
                    id:this.taskId
                },
            }).then(res => {  //res是返回结果
                if(res.data.code==0){
                    this.ruleForm=res.data.data;
                    this.ruleForm.unitImage=this.ruleForm.unitImages?JSON.parse(this.ruleForm.unitImages):[];
                    this.ruleForm.sceneImage=this.ruleForm.sceneImages?JSON.parse(this.ruleForm.sceneImages):[];
                    this.ruleForm.peopleImage=this.ruleForm.peopleImages?JSON.parse(this.ruleForm.peopleImages):[];
                }else{
                    _this.$alert(res.data.msg, '提示', {
                        confirmButtonText: 'OK',
                    });
                }
            })
        }
    },
    mounted(){
        if(sessionStorage.getItem('taskId')){
            this.taskId=sessionStorage.getItem('taskId');
            this.getDetail();
        }
    }
}
</script>
<style lang="scss" scoped>
    .electronic{
        .el-form{
            margin: 10px 15px;
            /deep/ .el-form-item{
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #eee;
                margin-bottom: 0;

                .el-form-item__content{
                    flex: 1;
                }
                .el-input__inner{
                    border: none;
                }
                .el-textarea__inner{
                    border: none;
                    background-color: #e9e9e9;
                    margin: 10px 0;
                }
                .el-form-item__error{
                    top: 20%;
                }
            }
            .hoverImage{
                color: black;
                font-size: 12px;
            }
            .textDesc{
                color: black;
                background-color: #FBFBFB;
                font-size: 15px;
                line-height: 30px;
            }
            .submitButton{
                text-align: center;
                margin: 15px 0;
                border-bottom: 0;
                .el-button{
                    width: 200px;
                    background-color: #0B93DD;
                }
            }
            /deep/ .el-upload--picture-card{
                width: 50px;
                height: 50px;
                line-height: 58px;
                margin: 15px;
            }
            /deep/ .el-upload-list--picture-card .el-upload-list__item{
                width: 50px;
                height: 50px;
                line-height: 68px;
                margin: 55px 3px;
                &>div{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>