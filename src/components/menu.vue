<template>
    <div id="menu">
        <el-container style="height:100%;">
            <!-- 左边导航 -->
            <el-aside width="230px">
              <el-menu>
                  <h1 style="text-align:center">智慧消防</h1>
                  <el-submenu index="1">
                    <template slot="title">单位日常管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1"><router-link to="/unitmanagement/userManagement">人员信息</router-link></el-menu-item>
                        <!-- <el-menu-item index="1-2"><router-link to="/unitmanagement/networkUnitManagement">联网单位</router-link></el-menu-item>
                        <el-menu-item index="1-3"><router-link to="/unitmanagement/buildingAreaManagement">建筑物区域</router-link></el-menu-item>
                        <el-menu-item index="1-4"><router-link to="/unitmanagement/miniStationManagement">微型站</router-link></el-menu-item>
                        <el-menu-item index="1-5"><router-link to="/unitmanagement/PollingTask">巡检任务</router-link></el-menu-item>
                        <el-menu-item index="1-6"><router-link to="/unitmanagement/drillTaskmanagement">演练任务</router-link></el-menu-item>
                        <el-menu-item index="1-7"><router-link to="/unitmanagement/MaintenancePlan">维修计划</router-link></el-menu-item>
                        <el-menu-item index="1-8"><router-link to="/unitmanagement/noticeManagement">公告发布</router-link></el-menu-item>
                        <el-menu-item index="1-9"><router-link to="/unitmanagement/trainingTask">培训任务</router-link></el-menu-item> -->
                        <el-menu-item index="1-10"><router-link to="/configurationModule/inspectionRecord">巡检记录</router-link></el-menu-item>
                        <!-- <template v-if="userType==2">
                          <el-menu-item index="1-11"><router-link to="/unitmanagement/complaintsReportList">投诉管理</router-link></el-menu-item>
                        </template> -->
                        <el-menu-item index="1-12"><router-link to="/unitmanagement/everydayRecord">每日一查</router-link></el-menu-item>
                        <el-menu-item index="1-19"><router-link to="/unitmanagement/everydatPatrol">每日巡逻</router-link></el-menu-item>
                        <!-- <el-menu-item index="1-13"><router-link to="/unitmanagement/ErPollingTask">二维码巡检</router-link></el-menu-item> -->
                        <el-menu-item index="1-16"><router-link to="/unitmanagement/spotCheck">每月点检</router-link></el-menu-item>
                        <el-menu-item index="1-14"><router-link to="/unitmanagement/fireWatch">每月防火检查</router-link></el-menu-item>
                        <el-menu-item index="1-13"><router-link to="/unitmanagement/connectList">消控交接记录</router-link></el-menu-item>
                        <!-- <el-menu-item index="1-15"><router-link to="/unitmanagement/fireFacility">消防设施维修记录</router-link></el-menu-item> -->
                        <el-menu-item index="1-17"><router-link to="/unitmanagement/pumpHouse">消防水泵房记录</router-link></el-menu-item>
                        <el-menu-item index="1-18"><router-link to="/unitmanagement/lightPolling">疏散/照明灯月检</router-link></el-menu-item>
                        <el-menu-item index="3-7"><router-link to="/configurationModule/qrCode">设备二维码</router-link></el-menu-item>
                    </el-menu-item-group>
                  </el-submenu>
                  <!-- <el-submenu index="2">
                    <template slot="title">单位物联设施</template>
                    <el-menu-item-group>
                        <el-menu-item index="2-1"><router-link to="/facilityFacilities/equipmentLibrary">设备库</router-link></el-menu-item>
                        <el-menu-item index="2-2"><router-link to="/facilityFacilities/deviceManagement">设备管理</router-link></el-menu-item>
                    </el-menu-item-group>
                  </el-submenu> -->
                  <!-- <el-submenu index="3">
                    <template slot="title">单位基础配置</template>
                    <el-menu-item-group>
                      <el-menu-item index="3-1"><router-link to="/configurationModule/importantAlarm">重要报警类型弹框</router-link></el-menu-item>
                        <el-menu-item index="3-2"><router-link to="/configurationModule/mailList">单位设备通讯录</router-link></el-menu-item>
                        <el-menu-item index="3-3"><router-link to="/configurationModule/SMSPhone">短信电话报警</router-link></el-menu-item>
                        <el-menu-item index="3-4"><router-link to="/configurationModule/audioconfig">报警声音设置</router-link></el-menu-item>
                        <el-menu-item index="3-5"><router-link to="/configurationModule/installationInformation">设备安装信息</router-link></el-menu-item>
                        <el-menu-item index="3-6"><router-link to="/configurationModule/unitScore">单位评分标准</router-link></el-menu-item>
                        <el-menu-item index="3-8"><router-link to="/configurationModule/accountabilitySystem">履责制度</router-link></el-menu-item>
                        <template v-if="userType==1">
                            <el-menu-item index="3-9"><router-link to="/configurationModule/AreaModuleConfiguration">综合区域模块</router-link></el-menu-item>
                        </template>
                        <template v-if="userType==2 || userType==1">
                            <el-menu-item index="3-10"><router-link to="/configurationModule/unitIndustry">行业模块</router-link></el-menu-item>
                            <el-menu-item index="3-11"><router-link to="/configurationModule/unitAreaModule">区域模块</router-link></el-menu-item>
                        </template>
                        <el-menu-item index="3-12"><router-link to="/configurationModule/logManagement">日志</router-link></el-menu-item>
                          <el-menu-item index="3-13"><router-link to="/configurationModule/SMSPhoneStatistics">短信电话统计设置模块</router-link></el-menu-item>
                          <el-menu-item index="3-14"><router-link to="/configurationModule/pollingTaskConfig">巡检任务设置</router-link></el-menu-item>
                    </el-menu-item-group>
                  </el-submenu>
                  <el-submenu index="4">
                    <template slot="title">资料管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="4-1"><router-link to="/databaseManagement/trainingMaterials">培训资料</router-link></el-menu-item>
                        <template v-if="userType==1">
                          <el-menu-item index="4-2"><router-link to="/databaseManagement/equipmentInformation">设备资料</router-link></el-menu-item>
                          <el-menu-item index="4-3"><router-link to="/databaseManagement/maintenanceLibrary">维保库</router-link></el-menu-item>
                        </template>
                    </el-menu-item-group>
                  </el-submenu> -->
                  <!-- <el-submenu index="5">
                    <template slot="title">消防内部数据</template>
                    <el-menu-item-group>
                        <el-menu-item index="5-5"><router-link to="/internalData/FireData">火警数据</router-link></el-menu-item>
                        <el-menu-item index="5-6"><router-link to="/internalData/conflagration">火灾数据</router-link></el-menu-item>
                        <el-menu-item index="5-7"><router-link to="/internalData/Hazardous">危化品数据</router-link></el-menu-item>
                        <el-menu-item index="5-1"><router-link to="/internalData/outFireData">灭火救援数据</router-link></el-menu-item>
                        <el-menu-item index="5-4"><router-link to="/internalData/census">户籍化管理数据</router-link></el-menu-item>
                        <el-menu-item index="5-2"><router-link to="/internalData/fireSupervision">消防监督检查数据</router-link></el-menu-item>
                        <el-menu-item index="5-3"><router-link to="/internalData/officeStaff">办公机构人员数据</router-link></el-menu-item>
                    </el-menu-item-group>
                  </el-submenu> -->
                   <!-- <el-submenu index="6">
                    <template slot="title">技术服务管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="6-1"><router-link to="/technicalService/contract">合同管理</router-link></el-menu-item>
                        <el-menu-item index="6-2"><router-link to="/technicalService/servicePlan">服务计划</router-link></el-menu-item>
                    </el-menu-item-group>
                  </el-submenu> -->
              </el-menu>
            </el-aside>

            <!-- 用户查看个人信息 -->
            <el-dialog 
              title="个人信息" 
              :visible.sync="displayVisible"
              width="30%"
              class="showuserbox"
              >
                <div>
                    <p><span class="userbox">用户账号：</span><span class="user">{{userbox.user}}</span></p>
                    <p><span class="userbox">姓名：</span><span class="username">{{userbox.username}}</span></p>
                    <p><span class="userbox">手机号码：</span><span class="phone">{{userbox.phone}}</span></p>
                    <p><span class="userbox">邮箱Email：</span><span class="email">{{userbox.email}}</span></p>
                </div>
            </el-dialog>

            <!-- //修改密码 -->
            <el-dialog 
              title="修改密码" 
              :visible.sync="updateVisible"
              width="25%"
              class='updateuserbox'>
                <el-form :model="ruleForm2" :rules="rules2" status-icon ref="ruleForm2" label-width="120px" class="demo-ruleForm">
                  <el-form-item label="原密码" prop="password">
                    <el-input type="password" v-model="ruleForm2.password" @blur.prevent="changePassword()" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="新密码" prop="pass">
                    <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitFormuser('ruleForm2')">保存</el-button>
                    <el-button @click="resetFormuser('ruleForm2')">重置</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>

            <!-- 单位信息 -->
            <el-dialog 
              title="单位信息" 
              :visible.sync="showunitVisible"
              width="65%"
              class='showunitbox'>
              <fieldset>
                  <legend>单位信息</legend>
                  <table class="detail_table">
                    <tr>
                        <td>单位名称： <span>{{unit_Form.name}}</span></td>
                        <td>单位电话： <span>{{unit_Form.phone}}</span></td>
                        <td>单位类型： <span>{{unit_Form.typeName}}</span></td>
                    </tr>
                    <tr>
                        <td>所属区域： <span>{{unit_Form.region}}</span></td>
                        <td>统一社会信用代码： <span>{{unit_Form.organizationCode}}</span></td>
                        <td>成立时间： <span>{{unit_Form.establishmentDate}}</span></td>
                    </tr>
                    <tr>
                        <td>邮政编码： <span>{{unit_Form.postalCode}}</span></td>
                        <td>单位地址： <span>{{unit_Form.address}}</span></td>
                        <td>单位备注： <span>{{unit_Form.unitDesc?unit_Form.unitDesc:'暂无'}}</span></td>
                    </tr>
                    <tr>
                        <td>法人姓名： <span>{{unit_Form.legalPersonName}}</span></td>
                        <td>法人电话： <span>{{unit_Form.legalPersonPhone}}</span></td>
                        <td>法人身份证号： <span>{{unit_Form.legalPersonIdNo}}</span></td>
                    </tr>
                  </table>
              </fieldset>
              <fieldset>
                  <legend>消防信息</legend>
                  <table class="detail_table">
                    <tr>
                        <td>消防安全责任人姓名： <span>{{unit_Form.fireRunnerName}}</span></td>
                        <td>消防安全责任人电话： <span>{{unit_Form.fireRunnerPhone}}</span></td>
                        <td>消防安全责任人身份号码： <span>{{unit_Form.fireRunnerIdNo}}</span></td>
                    </tr>
                    <tr>
                        <td>消防安全管理人姓名： <span>{{unit_Form.fireSafetyOfficerName}}</span></td>
                        <td>消防安全管理人电话： <span>{{unit_Form.fireSafetyOfficerPhone}}</span></td>
                        <td>消防安全管理人身份号码： <span>{{unit_Form.fireSafetyOfficerIdNo}}</span></td>
                    </tr>
                    <tr>
                        <td>消防安全控制室电话： <span>{{unit_Form.fireControlRoomPhone}}</span></td>
                        <td>兼职消防管理人电话： <span>{{unit_Form.fireSafetyOfficerBackupPhone}}</span></td>
                        <td></td>
                    </tr>
                  </table>
              </fieldset>
              <fieldset>
                  <legend>其他信息</legend>
                  <table class="detail_table">
                    <tr>
                        <td>经济所有制： <span>{{unit_Form.economicsOwnership}}</span></td>
                        <td>单位固定资产： <span>{{unit_Form.fixedAssets}}</span></td>
                        <td>单位占地面积： <span>{{unit_Form.unitArea}}</span></td>
                    </tr>
                    <tr>
                        <td>单位职工人数： <span>{{unit_Form.staffNum}}</span></td>
                        <td>单位建筑面积： <span>{{unit_Form.totalArea}}</span></td>
                        <!-- <td>单位总平面图：<img src={{unit_Form.unitPlanUrl}}/></td> -->
                    </tr>
                  </table>
              </fieldset>
            </el-dialog>

            <!-- 右边显示 -->
            <el-container>
              <el-header id="user_operation" style="text-align: right;">
                  <!-- 头部信息 -->
                  <span class='loginuser'>王小虎</span>
                  <el-dropdown @command="handleCommand">
                  <i class="el-icon-setting" style="margin-right: 15px;color:#fff;font-size:14px"></i>
                  <el-dropdown-menu slot="dropdown" id="dropdown">
                      <el-dropdown-item command="1">查看个人信息</el-dropdown-item>
                      <div v-if="unitId!=-1">
                          <el-dropdown-item command="4">查看单位信息</el-dropdown-item>
                      </div>
                      <el-dropdown-item command="2">修改密码</el-dropdown-item>
                      <el-dropdown-item command="3">退出</el-dropdown-item>
                  </el-dropdown-menu>
                  </el-dropdown>
                  
              </el-header>
              <div class="content">
                  <div>
                      <el-tabs
                      v-model="activeIndex"
                      type="border-card"
                      closable
                      v-if="openTab.length"
                      @tab-click='tabClick'
                      @tab-remove='tabRemove'>
                          <el-tab-pane
                          :key="item.name"
                          v-for="(item) in openTab"
                          :label="item.name"
                          :name="item.route"
                          ></el-tab-pane>
                      </el-tabs>
                  </div>
                  <div class="content-wrap">
                      <!-- 菜单显示区域 -->
                      <!-- <template v-if="openTab">
                        <keep-alive>
                          
                        </keep-alive>
                      </template> -->
                      <!-- <keep-alive>
                          <router-view></router-view>
                      </keep-alive> -->
                      <router-view></router-view>
                  </div>
              </div>
            </el-container>
      </el-container>
    </div>
</template>

<script>
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎'
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再一次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次密码不一致，请重新输入!'));
        } else {
          callback();
        }
      };
      return {
        tableData: Array(20).fill(item),
        editableTabsValue: '2',//tab切换
        datapassword:null,//原密码
        userType:sessionStorage.getItem('userTypes'),//用户权限
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
          }, {
          title: 'Tab 2',
          name: '2',
          content: 'Tab 2 content'
        }],
        tabIndex: 2,
        displayVisible:false,//查看个人信息
        updateVisible:false,//修改密码
        showunitVisible:false,//单位信息
        ruleForm2:{
            password:'',//原密码
            pass:'', //新密码
            checkPass:''//验证密码
        },
        rules2: {
          password:{required: true, message: '请输入原密码', trigger: 'blur' },
          pass: [{ required: true,validator: validatePass, trigger: 'blur' }],
          checkPass: [{ required: true,validator: validatePass2, trigger: 'blur'}],
        },
        userbox:{
            user:'',
            username:'',
            phone:'',
            email:'',
        },
        unitId:'',
        unit_Form:{
                name:'',        //单位名字/
                address:'',     //单位地址/
                latitude:0,     //单位纬度/
                longitude:0,    //单位经度/
                organizationCode:'',//单位隶属组织机构编码/统一社会信用代码
                phone:'',       //单位手机/
                postalCode:'',  //邮政编码/
                region:'',      //单位所属区域/
                typeName:'',    //单位类型名/
                unitNum:'',    //单位编号/
                fireControlRoomPhone:'',//消控室电话/
                fireRunnerName:'',//消防安全责任人姓名/
                fireRunnerPhone:'',//消防安全责任人电话/
                fireRunnerIdNo:'',//消防安全责任人身份号码/
                fireSafetyOfficerName:'',//消防安全管理人姓名/
                fireSafetyOfficerPhone:'',//消防安全管理人电话/
                fireSafetyOfficerIdNo:'',//消防安全管理人身份号码/
                fireSafetyOfficerBackupPhone:'',//后补消防管理人电话/
                legalPersonName:'',//法人代表姓名/
                legalPersonIdNo:'',//法人代表公民身份号码/
                legalPersonPhone:'',//法人代表电话/
                staffNum:'',//职工总人数/
                establishmentDate:'',//成立时间/
                // competentOrganization:'',//上级主管单位名称/
                // governmentOrganization:'',//管辖单位名称/
                economicsOwnership:'',//经济所有制/
                fixedAssets:null,//固定资产/
                unitArea:null,//单位占地面积/
                totalArea:null,//总建筑物面积/
                unitPlanUrl:'',//单位总平面图
                unitDesc:'',//单位描述
                createdTime:'',
        }
      }
    },
    methods:{
        //tab标签点击时，切换相应的路由
        tabClick(){
          this.$router.push({path: this.activeIndex});//点击跳转到页面
          this.$store.commit('routeJump/delete_tabs', '/unitmanagement/PollingSummary');
           this.$store.commit('routeJump/delete_tabs', '/unitmanagement/ligthSpot');
        },
        //移除tab标签
        tabRemove(targetName){
          // console.log("tabRemove",targetName);
          //首页不删
          if(targetName == '/unitmanagement/userManagement'){
            return
          }
          this.$store.commit('routeJump/delete_tabs', targetName);
            // console.log(2233)
            // console.log(this.activeIndex)

          if (this.activeIndex === targetName) {
            // 设置当前激活的路由
            if (this.openTab && this.openTab.length >= 1) {
              // console.log('=============',this.openTab[this.openTab.length-1].route)
              this.$store.commit('routeJump/set_active_index', this.openTab[this.openTab.length-1].route);
              this.$router.push({path: this.activeIndex});
            } else {
              this.$router.push({path: '/unitmanagement/userManagement'});
            }
          }
        },
        handleCommand(command) {//个人设置
          var _this=this;
          if(command==1){
              this.axios({
                    url:'/api/admin/user/single',
                    method: 'post',
                    data:{
                        id:sessionStorage.getItem('user_id'),
                    }
                }).then(res=>{
                    if(res.data.code==0){
                      _this.userbox.user=res.data.data.account;
                        _this.userbox.username=res.data.data.username;
                        _this.userbox.phone=res.data.data.phone;
                        _this.userbox.email=res.data.data.email;
                        this.displayVisible=true;
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
          }else if(command==3){
              sessionStorage.clear();
              this.$router.push('/login');
          }else if(command==2){
              this.updateVisible=true;
          }else{
              this.axios({
                    url:'/api/admin/unit/single',
                    method: 'post',
                    data:{
                        id:sessionStorage.getItem('unitId'),
                    }
                }).then(res=>{
                    if(res.data.code==0){
                        // console.log(res.data)
                        _this.showunitVisible=true;
                        _this.unit_Form=res.data.data;
                    }else{
                        _this.$alert(res.data.msg, '提示', {
                            confirmButtonText: 'OK',
                        });
                    }
                })
              
          }
        },
        submitFormuser(formName) {//表单提交
            this.$refs[formName].validate((valid) => {
              if (valid) {
                  var _this=this;
                  this.axios({
                      url:'/api/admin/user/update.password',
                      method: 'post',
                      data:{
                          password:this.ruleForm2.pass,
                      }
                  }).then(res=>{
                      if(res.data.code==0){
                          _this.$alert('修改成功', '提示', {
                              confirmButtonText: 'OK',
                              callback:()=>{
                                _this.resetFormuser('ruleForm2');
                                _this.updateVisible=false;
                              }
                          });

                      }else{
                          _this.$alert(res.data.msg, '提示', {
                              confirmButtonText: 'OK',
                          });
                      }
                  })
              } else {
                // console.log('error submit!!');
                return false;
              }
            });
        },
        resetFormuser(formName) {//表单重置
          this.$refs[formName].resetFields();
        },
        changePassword(){
          var _this=this;
          this.axios({
              url:'/api/admin/user/password/valid',
              method: 'post',
              data:{
                  password:this.ruleForm2.password,
              }
          }).then(res=>{
              if(res.data.code!=0){
                  _this.ruleForm2.password='';
                  _this.$message.error(res.data.msg);
              }
          })
        },
        
        
    },
    computed: {
      openTab () {
        return this.$store.state.routeJump.openTab;
      },
      activeIndex:{
        get () {
          return this.$store.state.routeJump.activeIndex;
        },
        set (val) {
          this.$store.commit('routeJump/set_active_index', val);
        }
      }
    },
    watch:{
      '$route'(to){
          //判断路由是否已经打开
          //已经打开的 ，将其置为active
          //未打开的，将其放入队列里
          let flag = false;
          for(let item of this.openTab){
            if(item.name === to.name){
              this.$store.commit('routeJump/set_active_index',to.path)
              this.activeIndex=to.path;
              flag = true;
              break;
            }
          }
          if(!flag){
            this.$store.commit('routeJump/add_tabs', {route: to.path, name: to.name});
            this.$store.commit('routeJump/set_active_index', to.path);
          }
      },
    },
    mounted () {
        // 刷新时以当前路由做为tab加入tabs
        // 当前路由不是首页时，添加首页以及另一页到store里，并设置激活状态
        // 当当前路由是首页时，添加首页到store，并设置激活状态
        if (this.$route.path !== '/login' && this.$route.path !== '/unitmanagement/userManagement') {
            // this.$store.commit('add_tabs', {route: '/systemmanage/organiMainte' , name: '组织结构维护'});
            this.$store.commit('routeJump/add_tabs', {route: this.$route.path , name: this.$route.name });
            this.$store.commit('routeJump/set_active_index', this.$route.path);
        } else {
          this.$store.commit('routeJump/add_tabs', {route: '/unitmanagement/userManagement', name: '人员管理'});
          this.$store.commit('routeJump/set_active_index', '/unitmanagement/userManagement');
          this.$router.push('/unitmanagement/userManagement');
        }

        //个人信息
        document.querySelector('.loginuser').innerHTML=sessionStorage.user_name;
        this.unitId=sessionStorage.unitId;
    },
  };
</script>
<style lang="scss">
#menu{
    height: 100%;
    fieldset{
      border:1px solid #eee;
    }
    .detail_table{
        border-collapse: collapse;
        // border:1px solid #eee;
        tr,td{
            // border:2px solid #eee;
            height:40px;
        }
        td{
            width:10%;
            padding-left: 15px;
            span{
              color: #da6ccb;
            }
        }
    }
}
.el-tabs__content{
    background-color: #f0f2f5;
    height: 0%;
    display: none;
}
.el-tabs__header{
   margin: 0!important;
   padding: 10px;
}
// 头部
.el-header {
    background-color: #05498c;
    color: #fff;
    line-height: 60px;
    font-size: 14px;
  }

  // 左右分布
  .el-aside{
    background-color:#05498c;
  }
  .el-aside .el-menu{
    background-color:#05498c!important;
    border-right: none!important;
  }
 .el-aside ul{
    background-color:#111!important;
  }
  .el-submenu__title:hover {
      background-color: #000;
  }
  .el-menu-item:focus, .el-menu-item:hover{
      outline: 0;
      background-color: #0188d4!important;
  }
  .el-submenu__title:hover{
    background-color: #05498c!important;
  }
  .el-submenu__title,.el-submenu__title i,.el-menu-item a{
    color: #fff!important;
    text-decoration: none;
    display: inline-block;
    height: 100%;
    width: 100%;
  }
  .el-submenu .el-menu-item{
    padding:0!important;
  }
  .el-menu-item a{
    width: 80%;
    padding-left:20%;
  }
  .el-menu-item-group .is-active{
    background:#0188d4;
  }
  .el-menu-item-group__title{
      display:none;
  }
  #tags{
    margin: 15px;
    height: 3%;
  }
  #tags .el-tag{
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
  }
  .el-menu-item .is-active{
    background-color: #0188d4;
  }
  .el-submenu{
    height: 35%;
  }
  .el-submenu__title i{
    width: 10%;
    height: 10%;
  }
  .el-submenu__icon-arrow{
    right: 40px!important;
    top: 61%!important;
  }
  // 个人信息修改
  #user_operation{
    i{
      margin-right: 0;
      margin-left: 10px;
    }
  }
  #dropdown-menu-8524{
    top: 40px!important;

  }
  .showuserbox{
    .el-dialog__body{
      text-align: left;
      margin-left: 7%;
      font-size: 18px;
      padding:7% 0 15%;
    }
    .userbox{
      display: inline-block;
      width: 130px;
      text-align: right;
    }
  }
  .updateuserbox{
      .el-input{
        width: 230px;
        height: 25px;
      }
  }
</style>
