export const GaodeMap={
  data () {
    let self = this;
    return {
      mapVisible:false,
      zoom:10,
      lng: 0,
      lat: 0,
      address:'',
      windows: [
            {
              position: [120.5273285, 30.21515044],
              content: 'Hi! I am here!',
              visible: false,
            },
      ],
      currentWindow: {
        position: [0, 0],
        content: '',
        events: {},
        visible: false
      },
      loaded: false,
      center:[120.213178,30.291063],
      markermap:[
          {
              position:[0,0]
          }
      ],
      searchOption: {
          city: '杭州',
          citylimit: false
      },
      plugins: [  //  插件
          {
            pName:'Geolocation',
            events: {
              init(o) {
                // o 是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  if (result && result.position) {
                    self.lng = result.position.lng;
                    self.lat = result.position.lat;
                    self.center = [self.lng, self.lat];
                    self.windows[0].position= [self.lng, self.lat];
                    self.loaded = true;
                    self.$nextTick();
                  }
                });
              }
            }
          },
          'ToolBar',
          {
            pName: 'Scale',
            events: {
            }
          },
          {
            pName: 'Geocoder',
            events: {
            }
          },
          {
            pName: 'Autocomplete',
            events: {
              init() {
                  // var autoOptions = {
                  //     input: "tipinput"
                  // };
                  // var auto = new AMap.Autocomplete(autoOptions);
                  // var placeSearch = new AMap.PlaceSearch({
                  //     map: map
                  // });  //构造地点查询类
                  // AMap.event.addListener(auto,"select", select);//注册监听，当选中某条记录时会触发
                  // function select(e) {
                  //     placeSearch.setCity(e.poi.adcode);
                  //     placeSearch.search(e.poi.name);  //关键字查询查询
                  // }
              }
              
            }
          }
      ],
      events:{    //事件
          click(e){
            let { lng, lat } = e.lnglat;
            self.lng = lng;
            self.lat = lat;
            self.markermap = [{
                position: [self.lng, self.lat],
            }];
            // self.center = [e.lnglat.lng, e.lnglat.lat];

            

            // 这里通过高德 SDK 完成。
            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });

            geocoder.getAddress([lng ,lat], function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  if (result && result.regeocode) {
                      self.address = result.regeocode.formattedAddress;
                      console.log(result)
                      self.ruleForm.address=self.address;
                      self.currentWindow.content='经纬度:'+e.lnglat.lng+','+e.lnglat.lat+'<br/>地址:'+self.address;
                      self.$nextTick();                
                  }
                }
            });
            self.currentWindow.position=[e.lnglat.lng,e.lnglat.lat];
            self.currentWindow.visible=true;
            
            self.ruleForm.latitude=e.lnglat.lat;
            self.ruleForm.longitude=e.lnglat.lng;

          }
      }
    }
  },
  methods: {
      openmap(){    //打开地图
         this.mapVisible=true;
      },
      handleClose(){  //关闭地图
        document.querySelector('.v-modal').style.display= 'none';
        this.mapVisible=false;
        // this.currentWindow.visible=false;
      },
      onSearchResult(pois) {  //搜索框搜索地址
          let latSum = 0;
          let lngSum = 0;
          var self=this;
          if (pois.length > 0) {
            pois.forEach(poi => {
              let {lng, lat} = poi;
              lngSum += lng;
              latSum += lat;
            });
            let center = {
              lng: lngSum / pois.length,
              lat: latSum / pois.length
            };
            center.lng=Number(center.lng).toFixed(6);
            center.lat=Number(center.lat).toFixed(6);

            self.markermap = [{
                position: [center.lng, center.lat],
            }];

            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            
            geocoder.getAddress([center.lng ,center.lat], function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  if (result && result.regeocode) {
                        self.address = result.regeocode.formattedAddress;
                        console.log(result.regeocode)
                        self.ruleForm.address=self.address;
                        self.currentWindow.content='经纬度:'+center.lng+','+center.lat+'<br/>地址:'+self.address;
                        self.$nextTick();                
                  }
                }
            });

            
            this.currentWindow.position=[center.lng,center.lat];
            this.currentWindow.visible=true;
            
            this.center = [center.lng, center.lat];
            self.ruleForm.latitude=center.lat;
            self.ruleForm.longitude=center.lng;
            
          }
      },
      getok(){
        document.querySelector('.v-modal').style.display= 'none';
        this.mapVisible=false;
      },
  },
  mounted() {
    this.currentWindow = this.windows[0];
  },
}

