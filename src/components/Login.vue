<template>
    <div id="login">
        <div class="logo_login">

        </div>
        <div class="logo_bottom"></div>

        <div class='login_box'>
            <div class="login_box_box">
                <div class="login_title">登录</div>
                <el-form :model="ruleForm" status-icon ref="ruleForm" class="demo-ruleForm">
                <el-form-item prop="account">
                    <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item class='submit'>
                    <el-button type="primary" @click="submitForm('ruleForm')">登 &nbsp;&nbsp;录</el-button>
                </el-form-item>
                </el-form>
                <div class="ifpwd">
                    <el-checkbox v-model="checked">记住账号密码</el-checkbox>
                </div>
            </div>
            
        </div>
        <div class="login_bottom">
            <div>应 急 管 理 平 台</div>
            <div class="icpCss" style="text-align:center">
                <span>浙ICP备:<a href="http://www.beian.gov.cn/portal/index" target="_blank">18052704号-2</a></span>
                <span style="margin-left:10px;">
                    <img src="https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/test/1585729336838-%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200401161959.png" style="height:17px" alt=""/>
                    浙公网安备 33060202000785号</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import md5 from 'js-md5';
import base64 from 'js-base64';
export default {
    data(){
        return {
            userToken:"",   //用户token
            ruleForm:{
                name:'',
                password:''
            },
            checked:false//是否记住密码
        }
    },
    methods:{
        // ...mapMutations(['changeLogin']),
        ...mapMutations('routeJump',['changeLogin']),
        submitForm(formName) {
            var _this=this;
            this.$refs[formName].validate((valid) => {
              if (valid) {
                  this.ruleForm.name = this.ruleForm.name.replace(/\s+/g,"")
                  this.ruleForm.password = this.ruleForm.password.replace(/\s+/g,"")
                  this.axios({
                    method: 'post',
                    url: '/api/admin/user/login',
                    data: {
                      'account': this.ruleForm.name,
                      'password': this.ruleForm.password,
                    },
                    headers:{
                      "Authorization":" "
                    }
                  }).then(res => {  //res是返回结果
                      if(res.data.code==0){
                          _this.userToken=res.data.data;
                          _this.changeLogin({ Authorization: this.userToken});
                          if(this.checked==true){
                              localStorage.setItem(md5('houmanagename'),Base64.encode(this.ruleForm.name));
                              localStorage.setItem(md5('houmanagepassword'),Base64.encode(this.ruleForm.password));
                          }else{
                              localStorage.removeItem(md5('houmanagename'));
                              localStorage.removeItem(md5('houmanagepassword'));
                          }
                          _this.getuser();
                          sessionStorage.setItem('user_name',_this.ruleForm.name);
                      }else{
                          _this.$alert(res.data.msg, '提示', {
                              confirmButtonText: 'OK',
                          });
                          _this.ruleForm.name='';
                          _this.ruleForm.password='';
                      }
                  }).catch(err => {
                      _this.$alert('服务器崩溃了，请联系管理员'+err, '提示', {
                          confirmButtonText: 'OK',
                      });
                  })
              } else {
                  _this.$alert('error submit!!', '提示', {
                        confirmButtonText: 'OK',
                    });
                  return false;
              }
            });
        },
        getuser(){
          var _this=this;
          this.axios({
            method: 'post',
            url: '/api/admin/user',
          }).then(res=>{
              sessionStorage.setItem('user_id',res.data.data.id);
              sessionStorage.setItem('unitId',res.data.data.unitId?res.data.data.unitId:-1);
              sessionStorage.setItem('userTypes',res.data.data.userType);
              _this.$router.replace('/unitmanagement');
              _this.$store.state.routeJump.openTab = [];
              _this.$store.state.routeJump.activeIndex = '/unitmanagement';
          })
        }
    },
    mounted() {
        if(localStorage.getItem(md5('houmanagename'))){
            this.checked=true;
            this.ruleForm.name=Base64.decode(localStorage.getItem(md5('houmanagename')));
            this.ruleForm.password=Base64.decode(localStorage.getItem(md5('houmanagepassword')));
        }
        
    },
}
</script>

<style lang="scss">
  .login_box {
    position: absolute;
    width: 572px;
    height: 334px;
    top: 250px;
    left: calc(50% - 286px);
    border: 3px solid #d6d6d6;
    border-radius: 10px;
    .login_box_box{
        margin: 5% 8%;
    }
  }
  .logo_login{
      background: url(../assets/image/2.png) no-repeat;
      width: 200px;
      height: 80px;
      position:absolute;
      top: 100px;
      left: calc(50% - 100px);
      background-size:100% 100%;
  }
  .logo_bottom{
       background: url(../assets/image/dingren1.png) no-repeat;
        width: 40px;
        height: 22px;
        position: absolute;
        top: 191px;
        left: calc(50% - 26px);
        background-size: 100% 100%;
  }
  #login{
    background-color: #fff;
    background-size:100% 100%;
    height: 100%;
    .login_title{
        font-size: 30px;
        font-weight: 700;
        color: #bebebe;
        margin-bottom: 8%;
    }
  .demo-ruleForm {
    text-align: center;
  }
.el-input input {
      height: 55px!important;
      width: 440px!important;
      font-size: 18px!important;
  }
  /deep/ .el-input .el-input__inner{
    border:none;
    background-color: #fafafa!important;
    color: #000!important;
    font-size: 18px!important;
  }
  input:-webkit-autofill{
    // 　　-webkit-box-shadow: 0 0 0 400px #E8ECED inset;
     //input 背景色     #0C2034根据自己需要替换
      -webkit-box-shadow : 0 0 0 1000px #fafafa inset !important;
      //input字体颜色 颜色根据自己要求替换
      -webkit-text-fill-color: #000 !important;
    }
  .el-input__inner:focus{
      background-color: #e8f0fd!important;
      border: 1PX solid #f8b62c;
      box-shadow: 0 0px 5px 2px #f8b62c;
  }
  /deep/ .el-form-item {
      margin-bottom: 3%;
  }
  .submit{
      position:absolute;
      top: 110%;
      left: calc(50% - 83px);
      .el-button{
          width: 166px;
          height: 55px;
          border: none;
          background-color: #f8b62c;
          color: #000;
          font-size: 24px;
      }
  }
  .login_bottom{
      position:absolute;
      width: 340px;
      height: 10%;
      text-align: center;
      bottom: 2%;
      left: calc(50% - 170px);
      color: #d7d9d8;
    //   &>:nth-of-type(1){
    //       background: url(../assets/image/dingren1.png) no-repeat;
    //       width: 70%;
    //       height: 50%;
    //       margin-left:30%;
    //   }
      &>:nth-of-type(1){
          font-size: 18px;
          color: #8c8c8c;
      }
  }
  .ifpwd{
      .el-checkbox__label{
          color: #000;
      }
      .el-checkbox__inner{
          background-color: #fff;
          border-color: #d7d9d8;
      }
      .el-checkbox__inner::after{
          border: 1px solid #f8b735;
      }
      
  }
  .icpCss{
      margin-top: 10px;
      font-size: 12px;
      color: #8c8c8c;
        a:hover{
            text-decoration: underline;
            color: #f8b62d;
        }
    }
}
</style>
