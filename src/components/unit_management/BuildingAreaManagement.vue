<template>
    <!-- 建筑物区域管理 -->
    <div id='BuildingAreaManagement' class="allcontent">
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
            <el-col :span="20" style='padding-left:10px;height:100%'>
                <!-- 头部 -->
                <div >
                    <div >
                       
                         &nbsp;建构筑物类别 <el-select v-model="type" placeholder="请选择">
                            <el-option
                            v-for="item in typeOptions"
                           :key="item.code"
                            :label="item.description"
                            :value="item.code">
                            </el-option>
                        </el-select>
                        &nbsp;结构类型 <el-select v-model="type1" placeholder="请选择">
                            <el-option
                            v-for="item in constructionOptions"
                            :key="item.code"
                            :label="item.description"
                            :value="item.code">
                            </el-option>
                        </el-select>
                         <el-button type="primary" @click="addBuild"  :style="{'margin':' 0 auto'}" v-if="userType==3"><i class="el-icon-plus"></i> 新增</el-button>
                        <el-button type="primary" @click="addBuild" :style="{'margin':' 0 auto'}" :disabled='addFalg' v-else><i class="el-icon-plus"></i> 新增</el-button>
                        <el-button type="primary" @click="seach"> 查询</el-button>
                        <el-button type="primary" @click="handleReset1">重置</el-button>
                    </div>

                </div>

                <!-- 内容 -->
                <div class="bottom">
                    <!-- 表格 -->
                    <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
                        <el-table-column
                        type="selection"
                        width="55"
                        >
                        </el-table-column>
                        <el-table-column   									
                        prop="unitName"
                        label="单位名称"
                        width="180">
                        </el-table-column>
                        <el-table-column   									
                        prop="name"
                        label="建构筑物名称"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="type"
                        label="建构筑物类别"
                        width="140">
                        </el-table-column>
                        <el-table-column
                        prop="height"
                        label="建筑高度"
                        width="80">
                        </el-table-column>
                        <el-table-column
                        prop="fireResistantLevel"
                        label="耐火等级"
                        width="80">
                        </el-table-column>
                        <el-table-column
                        prop="structure"
                        label="建筑结构"
                        width="120">
                        </el-table-column>
                        <el-table-column
                        prop="constructionTime"
                        label="建造日期"
                        width="120">
                        </el-table-column>
                        <el-table-column
                        prop="upperFloor"
                        label="地上层数"
                        width="60">
                        </el-table-column>
                        <el-table-column
                        prop="underFloor"
                        label="地下层数"
                        width="60">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope='scope'>
                                <el-button
                                size="mini"
                                type="primary"
                                class='el-icon-edit'
                                @click="editData(scope.row.id)">编辑</el-button>
                                <el-button
                                size="mini"
                                type="danger"
                                class='el-icon-delete'
                                @click="handleDelete(scope.row.id)">删除</el-button>
                                <el-button
                                size="mini"
                                type="primary"
                                @click="openArchitectural(scope.row.id)">查看建筑图</el-button>
                             </template>
                        </el-table-column>
                        
                    </el-table>
                    <!-- 分页 -->
                    <div class="page_all">
                        <pagination :total='total' @pageChange="pageChange" ref="paginations"></pagination>
                    </div>
                </div>

                <!-- 弹框 -->
                <el-dialog
                    title="添加修改建筑信息"
                    :visible.sync="dialogVisible"
                    width="50%"
                    :close-on-click-modal="false"
                    class='dialog'
                    :before-close="closedialog">
                        <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                            <el-form-item label="建构筑物名称" prop="name">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="建筑物地址" prop="address" label-width="150px">
                                <el-input v-model="ruleForm.address" :disabled="true" label-width="150px" ></el-input>
                                <el-button @click="openmap">点击地图</el-button>
                                <div id="mapdiv">
                                    <el-dialog
                                        title="百度地图定位查询"
                                        :visible.sync="mapVisible"
                                        width="95%"
                                        :modal-append-to-body='false'
                                        class="mapdialog"
                                        :before-close="handleClose">
                                            <div class="amap-wrapper">
                                                <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult">
                                                </el-amap-search-box>
                                                <el-button type="primary" @click="getok" class="searchok">确定</el-button>
                                                
                                                <el-amap vid="amap-vue" :plugin="plugins" :events='events'  :zoom="zoom" :center="center" class="amap-demo bm_view" >
                                                    <el-amap-marker v-for="(marker, index) in markermap" :key="marker.index" :position="marker.position" :icon="marker.icon" :title="marker.title" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index"></el-amap-marker>
                                                    <el-amap-info-window
                                                        :position="currentWindow.position"
                                                        :content="currentWindow.content"
                                                        :visible="currentWindow.visible"
                                                        :events="currentWindow.events">
                                                    </el-amap-info-window>
                                                </el-amap>
                                            </div>
                                    </el-dialog>
                                </div>
                            </el-form-item>
                            <el-form-item label="建构筑物类别" prop="type">
                                <el-select v-model="ruleForm.type" placeholder="请选择">
                                    <el-option
                                        v-for="item in typeOptions"
                                        :key="item.code"
                                        :label="item.description"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>                   

                            <el-form-item label="使用性质" prop="application">
                                <el-select v-model="ruleForm.application" placeholder="请选择">
                                    <el-option
                                        v-for="item in propertyOptions"
                                        :key="item.code"
                                        :label="item.description"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            
                            <el-form-item label="火灾危险性" prop="fireHazardLevel">
                                <el-select v-model="ruleForm.fireHazardLevel" placeholder="请选择">
                                    <el-option
                                        v-for="item in fireRiskOptions"
                                        :key="item.code"
                                        :label="item.description"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="耐火等级" prop="fireResistantLevel">
                                <el-select v-model="ruleForm.fireResistantLevel" placeholder="请选择">
                                    <el-option
                                        v-for="item in fireResistanceOptions"
                                        :key="item.code"
                                        :label="item.description"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="结构类型" prop="structure">
                                <el-select v-model="ruleForm.structure" placeholder="请选择">
                                    <el-option
                                        v-for="item in constructionOptions"
                                        :key="item.code"
                                        :label="item.description"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="消防设备" prop="fireControlDeviceType">
                                <el-select v-model="ruleForm.fireControlDeviceType" placeholder="请选择">
                                    <el-option
                                        v-for="item in fireFightingOPtions"
                                        :key="item.code"
                                        :label="item.description"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                             <el-form-item label="地上层数" prop="upperFloor">
                                <el-input type="number" v-model="ruleForm.upperFloor"></el-input>
                            </el-form-item>

                            <el-form-item label="地下层数" prop="underFloor">
                                <el-input type="number" v-model="ruleForm.underFloor"></el-input>
                            </el-form-item>


                            <el-form-item label="建筑高度" prop="height">
                                <el-input v-model="ruleForm.height"></el-input> m
                            </el-form-item>
                            <el-form-item label="建筑面积" prop="floorArea">
                                <el-input v-model="ruleForm.floorArea"></el-input> ㎡
                            </el-form-item>
                            <el-form-item label="建造日期" prop="constructionTime">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.constructionTime" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="占地面积" prop="occupyArea">
                                <el-input v-model="ruleForm.occupyArea"></el-input> ㎡
                            </el-form-item>
                            <el-form-item label="标准层面积" prop="standardFloorArea">
                                <el-input v-model="ruleForm.standardFloorArea"></el-input> ㎡
                            </el-form-item>
                           
                           
                            <el-form-item label="地上层面积" prop="upperArea">
                                <el-input v-model="ruleForm.upperArea"></el-input> ㎡
                            </el-form-item>
                            
                            <el-form-item label="地下面积" prop="undergroundArea">
                                <el-input v-model="ruleForm.undergroundArea"></el-input> ㎡
                            </el-form-item>
                            <el-form-item label="地下层面积" prop="undergroundFloorArea">
                                <el-input v-model="ruleForm.undergroundFloorArea"></el-input> ㎡
                            </el-form-item>
                            <el-form-item label="隧道高度" prop="tunnelHeight">
                                <el-input v-model="ruleForm.tunnelHeight"></el-input> m
                            </el-form-item>
                            <el-form-item label="隧道长度" prop="tunnelLength">
                                <el-input v-model="ruleForm.tunnelLength"></el-input> m
                            </el-form-item>
                            <el-form-item label="消防控制室位置" prop="fireControlRoomSite">
                                <el-input v-model="ruleForm.fireControlRoomSite"></el-input>
                            </el-form-item>
                            <el-form-item label="避难层数量" prop="refugeStoreyNum">
                                <el-input v-model="ruleForm.refugeStoreyNum"></el-input>
                            </el-form-item>
                            <el-form-item label="避难层总面积" prop="refugeStoreyArea">
                                <el-input v-model="ruleForm.refugeStoreyArea"></el-input> ㎡
                            </el-form-item>
                            <el-form-item label="避难层位置" prop="refugeStoreySite">
                                <el-input v-model="ruleForm.refugeStoreySite"></el-input>
                            </el-form-item>
                            <el-form-item label="安全出口数量" prop="exitNum">
                                <el-input v-model="ruleForm.exitNum"></el-input>
                            </el-form-item>
                            <el-form-item label="安全出口位置/形式" prop="buildname">
                                <el-input v-model="exitsMesseg" @focus="dialogFormVisible = true"></el-input>
                            </el-form-item>
                            <el-form-item label="消防电梯数量" prop="fireElevatorNum">
                                <el-input v-model="ruleForm.fireElevatorNum"></el-input>
                            </el-form-item>
                            <el-form-item label="消防电梯容纳总重量" prop="fireElevatorWeight"> 
                                <el-input v-model="ruleForm.fireElevatorWeight"></el-input>kg
                            </el-form-item>
                            <el-form-item label="日常工作时间人数" prop="dailyWorkerNum">
                                <el-input v-model="ruleForm.dailyWorkerNum"></el-input>
                            </el-form-item>
                            <el-form-item label="最大容纳人数" prop="maxAccommodateNum">
                                <el-input v-model="ruleForm.maxAccommodateNum"></el-input>
                            </el-form-item>
                           
                            <el-form-item label="储存物数量" prop="storageNum">
                                <el-input v-model="ruleForm.storageNum"></el-input>
                            </el-form-item>
                            <el-form-item label="储存物性质" prop="storageNature">
                                <el-select v-model="ruleForm.storageNature" placeholder="请选择">
                                    <el-option
                                        v-for="item in storageNatureOPtions"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="储存物形态" prop="storageForm">
                                <el-select v-model="ruleForm.storageForm" placeholder="请选择">
                                    <el-option
                                        v-for="item in storageFormOPtions"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="储存容积" prop="storageCapacity">
                                <el-input v-model="ruleForm.storageCapacity"></el-input>
                            </el-form-item>
                            <el-form-item label="主要原料" prop="mainMaterials">
                                <el-input v-model="ruleForm.mainMaterials"></el-input>
                            </el-form-item>
                            <el-form-item label="主要产品" prop="mainProducts">
                                <el-input v-model="ruleForm.mainProducts"></el-input>
                            </el-form-item>
                            <!-- <el-form-item label="建筑物所属单位名称" prop="unitName">
                                <el-input v-model="ruleForm.unitName"></el-input>
                            </el-form-item> -->

                            <el-form-item class='submitagency'>
                                <el-button type="primary" @click="handleSubmit('ruleForm')" v-noMoreClick>立即提交</el-button>
                                <el-button @click="closedialog">取 消</el-button>
                            </el-form-item>

                        </el-form>
                         
                </el-dialog>
                <!-- 安全出口位置与形式 -->
                <el-dialog title="安全出口位置与形式" :visible.sync="dialogFormVisible"> 
                   <el-form >
                        <el-form-item label="安全出口位置" :label-width="formLabelWidth">
                        <el-input v-model="exitSite" autocomplete="off"></el-input>
                        </el-form-item>

                         <el-form-item label="安全出口形式" prop="exits" :label-width="formLabelWidth" >
                                <el-select v-model="exitForm" placeholder="请选择">
                                    <el-option
                                        v-for="item in exitsOPtions"
                                        :key="item.code"
                                        :label="item.description"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                                 <el-button @click="addExit">添加</el-button>
                        </el-form-item>

            
                         <el-table :data="exits">
                            <el-table-column property="exitSite" label="安全出口位置" width="150"></el-table-column>
                            
                            <el-table-column property="exitFormName" label="安全出口形式" width="200"></el-table-column>
                            <el-table-column label="操作">  
                                <template slot-scope='scope'>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    class='el-icon-delete'
                                    @click="deleteExits(scope)">
                                    删除
                                </el-button> 
                                </template>
                            </el-table-column>
                        </el-table>
                   </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                    </div>
                    </el-dialog>
                <!-- 上传图片弹框 -->
                <el-dialog
                    title="建筑物平面图"
                    :visible.sync="ArchitecturalVisible"
                    width="50%"
                    class='dialog'
                    :close-on-click-modal="false"
                    :before-close="closeArchitectural">
                    <fieldset>
                        <legend>各层建筑物图</legend>
                        <el-carousel :autoplay=false arrow ='always' type='card' height="300px" :initial-index = 1 >
                            
                            <el-carousel-item v-for="item in imgList" :key="item.floor" class="elbg">
                                <span style="width:100%;text-align: center;display:inline-block;margin-bottom:5px;"> {{ item.floor }} </span>
                                <!-- <img :src="item.img" style="width:100%;height:100%" /> -->
                               <el-image 
                                    style="width: 100%; height: 100%"
                                    :src="item.img" 
                                    :preview-src-list="[item.img]">
                                </el-image>
                            </el-carousel-item>
                        </el-carousel>
                    </fieldset>
                    
                    <fieldset>
                        <legend>新增建筑物图</legend>
                        <el-form :rules="Architectrules" :model="Architect" :data="Architect" status-icon  ref="Architect" label-width="100px">
                           
                            <el-form-item label="建筑楼层" prop="buildFloor">
                                <el-select v-model="buildFloorName" placeholder="请选择" >
                                    <el-option
                                        v-for="item in buildFloorOptions"
                                        :key="item.floor"
                                        :label="item.floor"
                                        :value="item.floor">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="建筑物图" prop="phone">
                                
                                <el-upload
                                    class="avatar-uploader"
                                    action=""
                                    accept=".jpg,.png,.JPG,.PNG"
                                    :show-file-list="false"
                                    :on-change="beforeUpload"
                                    :auto-upload="false">
                                    <template v-if="imgUrl">
                                        <template v-if="loading">
                                            <div 
                                                v-if="imgUrl"
                                                v-loading="loading"
                                                element-loading-text="上传中"
                                                element-loading-spinner="el-icon-loading"
                                                element-loading-background="rgba(0, 0, 0, 0.8)"
                                            >
                                                <img  :src="imgUrl" class="avatar">
                                            </div>
                                        </template>
                                        <template v-else>
                                            <img  :src="imgUrl" class="avatar">
                                        </template>
                                    </template>
                                    
                                    <i v-else class="el-icon-plus avatar-uploader-icon" > </i>
                                </el-upload>
                            
                            </el-form-item>
                            <el-form-item>
                                     <el-button @click="uploads" >立即上传</el-button>
                                     <el-button @click="cancelUpload" >取消上传</el-button>
                            </el-form-item>
                            <el-form-item solt-scope="scope">
                                <el-button size="small" type="primary" @click="photoSubmit" v-noMoreClick>提交</el-button>
                                <!-- slot.row.id -->
                                <el-button size="small" type="primary" @click="photoReset">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </fieldset>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import VueAMap from 'vue-amap'
import {Common} from './../../js/common'
import {GaodeMap} from './../../js/gaodemap'
import pagination from '../Children/Pagination'
export default {
    mixins:[GaodeMap,Common],
    components:{
        pagination:pagination
    },
    data(){
        var validatename=(rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入建筑名称'));
            }
            if (value) {
                this.axios({
                url   : "/api/admin/building/check.name",
                method: 'post',
                data  :{
                    name:value,
                    unitId:this.buildId
                }
                }).then(res=>{   
                    if(res.data.code==1){
                        if(res.data.msg!=this.ruleForm.id){
                            callback(new Error('同家单位不可出现相同建筑名称'));
                        }else{
                            callback();
                        }
                    } else {
                        callback()
                    }                                          
                })
            }
        };
        var validateFloor=(rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入层数'));
            }
            if (value|| value==0) {
                var num = parseInt(value)
                if(num>=0){
                    this.ruleForm.upperFloor = num
                }else{
                     this.ruleForm.upperFloor = num*-1
                }
                callback();
            }else{
                callback(new Error('请输入层数'));
            }
        };
        var validateFloor1=(rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入层数'));
            }
            if (value || value==0) {
                 var num = parseInt(value)
                if(num>=0){
                    this.ruleForm.underFloor = num
                }else{
                     this.ruleForm.underFloor = num*-1
                }
                callback();
            }else{
                callback(new Error('请输入层数'));
            }
        };
       
        return {
            module:'building',
            userType:sessionStorage.getItem('userTypes'),//用户等级
            buildingId:'',//建筑物Id
            buildId:sessionStorage.getItem('unitId'),//单位Id
            total:1,
            currentPage:1,
            rows:10,
            imgUrl:null,//建筑图
            loading:false,//上传图片显示加载中
            imgFile:'',//上传图片文件
            buildFloorName:'',//建筑图名称
            buildFloorOptions:[//建筑图字段

                {
                    floor:'第一层',
                   
                },
                
            ],
            storageFormOPtions:[//储存物形态
                {
                    id:1,
                    label:'固态'
                },{
                    id:2,
                    label:'液态'
                },{
                    id:3,
                    label:'气态'
                },{
                    id:4,
                    label:'混合'
                }
            ],
            storageNatureOPtions:[//储存物物质
                {
                    id:1,
                    label:'甲'
                },{
                    id:2,
                    label:'乙'
                },{
                    id:3,
                    label:'丙'
                },{
                    id:4,
                    label:'丁'
                },{
                    id:5,
                    label:'戊'
                }
            ],
            buildList:null,//建筑物图提交字段
                
            typeOptions: [//建筑物类别
               
            ],
            propertyOptions: [//使用性质
               
            ],
            fireRiskOptions: [//火灾危险性
               
            ],
            fireResistanceOptions: [//耐火等级
               
            ],
            constructionOptions: [//结构类型
               
            ],
            fireFightingOPtions :[//消防设备

            ],
            exitsOPtions: [//安全出口形式
               
            ],
            fileList:[],
            exits:[],//安全出口位置和形式存放
            exitForm:'',//安全出口形式
            exitSite:'',//安全出口位置
            exitsMesseg:'请点击进行编辑',
            ruleForm: {
                unitId:'',//城市Id
                id:'',//建筑Id
                name: '',//建、构筑物名称
                address:'',//建筑物地址
                longitude:'',//建筑物经度
                latitude:'',//建筑物纬度
                type:'',//建、构筑物类型
                application:'',//建筑物使用性质
                fireHazardLevel:'',//建筑物火灾危害等级
                fireResistantLevel:'',//建筑物耐火等级
                structure:'',//建筑物结构
                fireControlDeviceType:'',//建筑消防设施类别
                constructionTime:'',//建筑时间
                occupyArea:'',//占地面积
                undergroundArea:'',//地下面积
                undergroundFloorArea:'',//地下层面积
                underFloor:'',//地下层数
                upperFloor:'',//地上层数
                upperArea:'',//地上面积
                height:'',//建筑物高度
                standardFloorArea:'',//标准层面积
                floorArea:'',//地下层面积
                tunnelHeight:'',//隧道高度
                tunnelLength:'',//隧道长度
                fireControlRoomSite:'',//消防控制室位置
                refugeStoreyNum:'',//避难层数量
                refugeStoreyArea:'',//避难层总面积
                refugeStoreySite:'',//避难层位置
                exitNum:'',//安全出口数量
                fireElevatorNum:'',//消防电梯数量
                fireElevatorWeight:'',//消防电梯容纳总重量
                dailyWorkerNum:'',//日常工作时间总人数
                maxAccommodateNum:'',//最大容纳人数
                storageNum:'',//储存物数量
                storageNature:'',//储存物性质
                storageForm:'',//储存物形态
                storageCapacity:'',//储存容积
                mainMaterials:'',//主要原料
                mainProducts:'',//主要产品
                unitName:'',//建筑物所属单位名称
                exits:null,//安全出口位置和形式存放
            },
            rules: {
                    name: [
                        {validator: validatename, required: true, trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入建筑物地址', trigger: 'blur' },
                    ],
                   type:[
                        { required: false, message: '请输入建筑物类型', trigger: 'blur' },
                   ],
                   application:[
                        { required: false, message: '请输入建筑物使用性质', trigger: 'blur' },
                   ],
                   fireHazardLevel:[
                        { required: false, message: '请输入建筑物火灾危害等级', trigger: 'blur' },
                   ],
                   fireResistantLevel:[
                        { required: false, message: '请输入建筑物耐火等级', trigger: 'blur' },
                   ],
                   structure:[
                        { required: false, message: '请输入建筑物结构', trigger: 'blur' },
                   ],
                   fireControlDeviceType:[
                        { required: true, message: '请输入建筑消防设施类别', trigger: 'blur' },
                   ],
                   longitude:[
                       { required: true, message: '请输入建筑物经度', trigger: 'blur' },
                   ],
                   latitude:[
                       { required: true, message: '请输入建筑物维度', trigger: 'blur' },
                   ],
                   upperFloor:[
                       { required: true, message: '请输入地上层数', trigger: 'blur' },
                        {validator: validateFloor, required: true, trigger: 'change' }
                   ],
                   underFloor:[
                       { required: true, message: '请输入地下层数', trigger: 'blur' },
                       {validator: validateFloor1, required: true, trigger: 'change' }
                   ],
                   floorArea:[
                       { required: true, message: '请输入建筑面积', trigger: 'blur' },
                   ],
                   height:[
                       { required: true, message: '请输入建筑高度', trigger: 'blur' },
                   ],
                   
            },
            data:null,//树数据
            defaultProps: { //树
                children: 'children',
                label: 'label'
            },
            addFalg: true,//新增开关
            ArchitecturalVisible:false,//建筑物图弹框显示
            imgList:[//建筑物图列表
                {
                    floor:'第一层',
                    img: require('../../assets/image/1.jpg'),
                },
                {
                    floor:'第二层',
                    img:require('../../assets/image/2.jpg'),
                },
                {
                    floor:'第三层',
                    img:"https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/common/no_pic.gif",
                },
                ],
            Architect:{
                floor:'',
            },
            Architectrules:{
                
                buildFloor:[
                    
                       { required: true, message: '建筑物维度', trigger: 'blur' },
                   ],
            },
            dialogFormVisible: false,//安全位置与出口弹框
            formLabelWidth:'120px',
            type:'',
            type1:''
        }
    },
    methods:{
       
        beforeUpload(file) {       //上传前
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'jpg'
            const extension2 = testmsg === 'png'
            const isLt2M = file.size / 1024 / 1024 < 5
            if(!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是jpg,png格式!',
                    type: 'warning'
                });
                this.$refs.upload.clearFiles();
                this.imgFile=null;
                return ;
            }
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 5MB!',
                    type: 'warning'
                });
                this.$refs.upload.clearFiles();
                this.files = null;
                return ;
            }
           
            this.imgUrl = URL.createObjectURL(file.raw);
            this.imgFile= file.raw;
        },
      
        uploads(){  //上传图片
             var _this=this;
            let formdata = new FormData();
            formdata.append('file', this.imgFile );
            formdata.append('fileType',3);
            this.loading=true;
            this.axios({
                url   : "/api/admin/file/upload",
                method: 'post',
                data  :formdata
                }).then(res=>{    
                    if(res.data.code==0){
                        _this.imgUrl=res.data.data.fileUrl;
                        this.loading=false;
                        this.$message({
                            message: '上传成功',
                            type: 'success'
                        });
                    }else{
                        this.loading=false;
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }                                             
                })
        },
        cancelUpload () {//取消上传
            this.imgUrl = null
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
           this.buildId = data.id
           this.ruleForm.unitId = data.id
           this.rows = 10
           this.currentPage = 1
           if( data.type == 0 ) {
               this.addFalg = true
           }else{
                this.addFalg = false
           }
           this.getData()
          
        },
        openNode(data){     //打开树节点
            data.icon='el-icon-folder-opened'
        },
        closeNode(data){    //关闭树节点
            data.icon='el-icon-folder'
        },
        openArchitectural(id){    //打开上传建筑图弹窗
            this.ArchitecturalVisible=true;
            this.buildingId = id
            this.axios({
                url:'/api/admin/building/single.picture',
                method:'post',
                data:{
                    id
                }
            }).then( res => {
                
                if( res.data.code === 0 ) {
                    this.imgList = res.data.data
                    this.buildFloorOptions =  res.data.data
                }
               
            })
        },
        closeArchitectural(){   //关闭上传建筑图弹窗
            this.ArchitecturalVisible=false;
        },
        photoSubmit(){//提交建筑物图

            if ( this.buildFloorName ) {
                this.buildList={
                    floor:this.buildFloorName,
                    img:this.imgUrl && this.imgUrl ||"https://oss-kaleidoscope.oss-cn-hangzhou.aliyuncs.com/common/no_pic.gif",
                    buildingId:this.buildingId
                }
                this.axios({
                    url:'/api/admin/building/update.picture',
                    method:'post',
                    data:{
                        ...this.buildList
                    }
                }).then( res => {
                    if( res.data.code === 0) {

                    this.photoReset()
                    this.openArchitectural(this.buildingId)
                    this.$alert('添加成功', '提示', {
                        confirmButtonText: 'OK',
                    });

                    }else{

                    this.$alert(res.data.message, '提示', {
                        confirmButtonText: 'OK',
                    });
                    
                    }               
                })
            }else{
                this.$alert('请选择建筑楼层', '提示', {
                    confirmButtonText: 'OK',
                });
            }
           
        },
        photoReset(){//重置建筑物图
            this.buildList = []
            this.buildFloorName = ''
            this.imgUrl = null
        },
       
       addExit () {//添加安全出口位置/形式
           var _this = this
           if( this.exitSite !== ''){
           this.exits.push(
               {
                   exitSite: _this.exitSite,
                   exitForm: _this.exitForm,
                   exitFormName:  _this.exitsOPtions[0] && _this.exitsOPtions[_this.exitForm-1].description
               }
           )
           this.exitSite = ''
           this.exitForm = ''
           this.ruleForm.exits = this.exits
          
           }else{
               alert('安全出口位置不能为空')
           }

       },
       deleteExits (data) {//删除安全出口位置/形式
           this.exits.splice( data.$index,1)
       },
       addBuild () {//添加建筑
           this.opendialog()
           this.ruleForm.id = ''
       },
        pageChange (item) {//页数页码改变页面重新刷新
            this.currentPage = item.page_index;
            this.rows = item.page_limit;
            this.getData() //改变页码，重新渲染页面
        },
        handleReset1(){
            this.type=''
            this.type1=''
            this.currentPage=1
            this.$refs.paginations.changePageNum(1)
            this.getData()
        },
         seach(){
            this.currentPage = 1
            this.getData()
        },
      
    },
     created(){
        this.ruleForm.unitId =Number(sessionStorage.getItem('unitId'))
        this.buildId = Number(sessionStorage.getItem('unitId'))
    },
    mounted() {
        if(this.ruleForm.unitId!=-1){
            this.getData()
        }
        
    },
}
</script>

<style lang="scss">
    #BuildingAreaManagement{
         background: #fff;
        .el-form-item{
            width:48%;
        }
         .el-input{
            width:180px;
        }
        .el-dialog{
            .el-select,.el-input{
                width:180px;
            }
        }
        .el-carousel__item h3 {
            color: #475669;
            font-size: 18px;
            opacity: 0.75;
            line-height: 300px;
            margin: 0;
        }
        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }
        
        .el-carousel__item:nth-child(2n+1) {
            background-color: #d3dce6;
        }
        fieldset{
            padding:30px;
            margin-bottom:20px;
            border: 1px solid;
            border-color: #e8e5e5;
        }

        .mapdialog{
            .el-dialog{
                height: 77%;
                width:85%!important;
                margin-left:11%;
            }
            .el-dialog__wrapper{
                height: 100%;
                position: relative;
                margin-top: -10px!important;
            }
                
            .el-dialog__body{
                padding: 0;
            }
            .el-dialog__header {
                padding: 5px 0px!important;
                background-color: #74c6d8;
                text-align: center;
                .el-dialog__title{
                    font-size: 14px!important;
                }
                .el-dialog__headerbtn{
                    top: 15px;
                }
            }
            .bm_view{
                width: 100%;
                height: 700px;
            }
            .search-box{
                position: absolute;
            }
            .searchok{
                position: absolute;
                top: 50px;
                z-index: 22222222;
                right: 25px;
                height:40px;
                width:60px;
            }
            .el-vue-search-box-container{
                right: 90px;
                top: 50px;
            }
        }

        .avatar-uploader  {
            border: 1px dashed #DCDFE6!important;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            display: inline-block;
            width: 177px!important;
            height: 95px;
        }
        .avatar-uploader :hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 177px;
            height: 95px;
            line-height: 95px;
            text-align: center;
        }
        .avatar {
            width: 177px;
            height: 95px;
            display: block;
        }

        .el-loading-spinner{
            position: relative;
            top: 0;
            margin-top: 0px;
        }
    }
    .elbg{
        background: #FFF!important;
    }
    
 
 
    
</style>