import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: '页面',
      redirect: '/login'
    },
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/components/Login.vue')
    },
    {
      path: '/complaintsReport',
      name: '投诉举报',
      component: () => import('@/components/configurationModule/complaintsReport.vue')
    },
    {
      path: '/logins',
      name: '除小患登录',
      component: () => import('@/components/hiddenDanger/logins.vue')
    },
    {
      path: '/regulations',
      name: '法规条例',
      component: () => import('@/components/hiddenDanger/regulations.vue')
    },
    {
      path: '/addTask',
      name: '新增任务',
      component: () => import('@/components/hiddenDanger/addTask.vue')
    },
    {
      path: '/electronic',
      name: '电子凭据',
      component: () => import('@/components/hiddenDanger/electronic.vue')
    },
    {
      path: '/unitmanagement',
      name: '单位日常管理',
      component: () => import('@/components/menu.vue'),
      redirect: '/unitmanagement/userManagement',
      children: [
        {
          path: 'userManagement',
          name: '人员信息',
          meta:{keepAlive: false},
          component: () => import('@/components/unit_management/User.vue'),
        },
        {
          path: 'complaintsReportList',
          name: '投诉管理',
          meta:{keepAlive: false},
          component: () => import('@/components/unit_management/complaintsReportList.vue'),
        },
        {
          path: 'networkUnitManagement',
          name: '联网单位',
          meta:{keepAlive: false},
          component: () => import('@/components/unit_management/NetworkUnit.vue'),
        },
        {
          path: 'buildingAreaManagement',
          name: '建筑物区域',
          meta:{keepAlive: false},
          component: () => import('@/components/unit_management/BuildingAreaManagement.vue'),
        },
        {
          path:"PollingTask",
          name:"巡检任务",
          meta:{keepAlive: false},
          component: () => import("@/components/unit_management/PollingTask.vue")
        },
        {
          path:"ErPollingTask",
          name:"二维码巡检任务",
          meta:{keepAlive: false},
          component: () => import("@/components/unit_management/ErPollingTask.vue")
        },
        {
          path:"MaintenancePlan",
          name:"维修计划",
          meta:{keepAlive: false},
          component: () => import("@/components/unit_management/MaintenancePlan.vue")
        },
        {
          path:"miniStationManagement",
          name:"微型站",
          meta:{keepAlive: false},
          component: () => import("@/components/unit_management/miniStationManagement.vue")
        },
        {
          path:"noticeManagement",
          name:"公告发布",
          meta:{keepAlive: false},
          component: () => import("@/components/unit_management/noticeManagement.vue")
        },
        {
          path: 'trainingTask',
          name: '培训任务',
          meta:{keepAlive: false},
          component: () => import('@/components/unit_management/TrainingTask.vue'),
        },
        {
          path:"drillTaskmanagement",
          name:"演练任务",
          meta:{keepAlive: false},
          component: () => import("@/components/unit_management/drillTaskmanagement.vue")
        },
        {
          path:"everydayRecord",
          name:"每日一查",
          meta:{keepAlive: false},
          component: () => import("@/components/unit_management/everydayRecord.vue")
        },
        {
          path:"PollingSummary",
          name:"巡查汇总",
          meta:{keepAlive: false},
          component: () => import("@/components/unit_management/PollingSummary.vue")
        },
        {
          path:"connectList",
          name:"消控交接记录",
          meta:{keepAlive: false},
          component: () => import("@/components/unit_management/connectList.vue")
        },
        {
          path:"fireWatch",
          name:"每月防火检查",
          meta:{keepAlive: false},
          component: () => import("@/components/unit_management/fireWatch.vue")
        },
        {
          path:"fireFacility",
          name:"消防设施维修记录",
          meta:{keepAlive: false},
          component: () => import("@/components/unit_management/fireFacility.vue")
        },
      ]
    },
    {
      path: '/facilityFacilities',
      name: '物联设备',
      component: () => import('@/components/menu.vue'),
      children: [
        {
          path: 'equipmentLibrary',
          name: '设备库',
          meta:{keepAlive: false},
          component: () => import('@/components/facilityFacilities/EquipmentLibrary.vue'),
        },
        {
          path: 'deviceManagement',
          name: '设备管理',
          meta:{keepAlive: false},
          component: () => import('@/components/facilityFacilities/DeviceManagement.vue'),
        },]
    },
    {
      path: '/configurationModule',
      name: '单位配置',
      component: () => import('@/components/menu.vue'),
      children: [
        {
          path: 'importantAlarm',
          name: '重要报警类型弹框',
          meta:{keepAlive: false},
          component: () => import('@/components/configurationModule/ImportantAlarm.vue'),
        },
        {
          path: 'SMSPhone',
          name: '短信电话报警',
          meta:{keepAlive: false},
          component: () => import('@/components/configurationModule/SMSPhone.vue'),
        },
        {
          path: 'SMSPhoneStatistics',
          name: '短信电话统计设置模块',
          component: () => import('@/components/configurationModule/SMSphoneStatistics.vue'),
        },
        {
          path: 'mailList',
          name: '单位通讯录',
          meta:{keepAlive: false},
          component: () => import('@/components/configurationModule/MailList.vue'),
        },
        {
          path: 'logManagement',
          name: '日志',
          meta:{keepAlive: false},
          component: () => import('@/components/configurationModule/LogManagement.vue'),
        },
        {
          path: 'unitScore',
          name: '单位评分标准',
          meta:{keepAlive: false},
          component: () => import('@/components/configurationModule/UnitScore.vue'),
        },
        {
          path: 'installationInformation',
          name: '设备安装信息',
          meta:{keepAlive: false},
          component: () => import('@/components/configurationModule/installationInformation.vue'),
        },
        {
          path: 'AreaModuleConfiguration',
          name: '综合区域模块',
          meta:{keepAlive: false},
          component: () => import('@/components/configurationModule/AreaModuleConfiguration.vue'),
        },
        {
          path:"audioConfig",
          name:"报警声音设置",
          meta:{keepAlive: false},
          component: () => import("@/components/configurationModule/AudioConfig.vue")
        },
        {
          path:"unitAreaModule",
          name:"区域模块",
          meta:{keepAlive: false},
          component: () => import("@/components/configurationModule/unitAreaModule.vue")
        },
        {
          path:"unitIndustry",
          name:"行业模块",
          meta:{keepAlive: false},
          component: () => import("@/components/configurationModule/unitIndustry.vue")
        },
        {
          path:"accountabilitySystem",
          name:"履责制度",
          meta:{keepAlive: false},
          component: () => import("@/components/configurationModule/accountabilitySystem.vue")
        },
        {
          path:"qrCode",
          name:"设备二维码",
          meta:{keepAlive: false},
          component: () => import("@/components/configurationModule/QRCode.vue")
        },
        {
          path:"pollingTaskConfig",
          name:"巡检任务设置",
          meta:{keepAlive: false},
          component: () => import("@/components/configurationModule/pollingTaskConfig.vue")
        },
        {
          path:"inspectionRecord",
          name:"巡检记录",
          meta:{keepAlive: false},
          component: () => import("@/components/configurationModule/inspectionRecord.vue")
        },
      ]
    },
    {
      path: '/databaseManagement',
      name: '资料库',
      component: () => import('@/components/menu.vue'),
      children: [
        {
          path: 'trainingMaterials',
          name: '培训资料',
          meta:{keepAlive: false},
          component: () => import('@/components/databaseManagement/Rainingmaterials.vue')
        },
        {
          path: 'equipmentInformation',
          name: '设备资料',
          meta:{keepAlive: false},
          component: () => import('@/components/databaseManagement/EquipmentInformation.vue')
        },
        {
          path: 'maintenanceLibrary',
          name: '维保库',
          meta:{keepAlive: false},
          component: () => import('@/components/databaseManagement/maintenanceLibrary.vue')
        }]
    },
    {
      path: '/internalData',
      name: '消防内部数据',
      component: () => import('@/components/menu.vue'),
      children: [
        {
          path: 'outFireData',
          name: '灭火救援数据',
          meta:{keepAlive: false},
          component: () => import('@/components/internalData/outFireData.vue')
        },
        {
          path: 'FireData',
          name: '火警数据',
          meta:{keepAlive: false},
          component: () => import('@/components/internalData/outFireData.vue')
        },
        {
          path: 'conflagration',
          name: '火灾数据',
          meta:{keepAlive: false},
          component: () => import('@/components/internalData/outFireData.vue')
        },
        {
          path: 'Hazardous',
          name: '危化品数据',
          meta:{keepAlive: false},
          component: () => import('@/components/internalData/outFireData.vue')
        },
        {
          path: 'census',
          name: '户籍化管理数据',
          meta:{keepAlive: false},
          component: () => import('@/components/internalData/outFireData.vue')
        },
        {
          path: 'fireSupervision',
          name: '消防监督检查数据',
          meta:{keepAlive: false},
          component: () => import('@/components/internalData/outFireData.vue')
        },
        {
          path: 'officeStaff',
          name: '办公机构人员数据',
          meta:{keepAlive: false},
          component: () => import('@/components/internalData/outFireData.vue')
        },
      ]
    },
    {
    path: '/technicalService',
      name: '技术服务管理',
      component: () => import('@/components/menu.vue'),
      children: [
        {
          path: 'contract',
          name: '合同管理',
          meta:{keepAlive: false},
          component: () => import('@/components/technicalService/contract.vue')
        },
        {
          path: 'servicePlan',
          name: '服务计划',
          meta:{keepAlive: false},
          component: () => import('@/components/technicalService/servicePlan.vue')
        },
        {
          path: 'maintenancePlan',
          name: '维保计划',
          meta:{keepAlive: false},
          component: () => import('@/components/technicalService/maintenancePlan.vue')
        },
        {
          path: 'maintenanceItems',
          name: '维保项目',
          meta:{keepAlive: false},
          component: () => import('@/components/technicalService/maintenanceItems.vue')
        }
      ]
    },  
    {
      path: '*',
      name: '404',
      component: () => import('@/components/error.vue')
    }
  ]
})
