<template>
  <div>
    <Sidebar  v-model:visible="visibleLeft" :baseZIndex="1000">
      <img src="../assets/awt-herb-napis.png"  style="    padding-left: 15px;
      padding-top: 10px; width:100%">
      <Menu :model="items" />

    </Sidebar>
  <div id="main-panel" style="padding: 1% 15% 0% 15%; color:#7688b1;" >
      <div id="main-title">{{activePlace}} 
      </div>
      <div v-if="activePlace == 'ZLECENIA'"  class="orders-menu">

        <div @click="addActiveButtonClass('orders-menu-item' , 'finished-order') , filterOrder ='finished'" class="orders-menu-item finished-order menu-item inset-button">
          ZAKOŃCZONE
        </div>
        <div  @click="addActiveButtonClass( 'orders-menu-item' , 'uncompleted-order' ) , filterOrder ='uncompleted'" class="orders-menu-item uncompleted-order inset-button">
          W TRAKCIE
        </div>
        <div  @click="addActiveButtonClass( 'orders-menu-item' , 'all-order' ) , filterOrder ='all'" class="orders-menu-item all-order inset-button">
          WSZYSTKIE
        </div>
        <div @click="toast()" class="orders-menu-item add-order inset-button" style="background: #80b2eb;color: white;">
          DODAJ
        </div>

      </div>
      <div id="main-content">


        <!-- V-FOR ORDER -->
        <div v-if="activePlace == 'ZLECENIA'" class="orders-content">
          <div class="order" v-for="order in filtredOrderItems" :key="order.id">

            <Fieldset :toggleable="true" :class="{ finish: order.allCollected == order.allMax , redBorder:true  }"  v-model:collapsed="order.collapsed">
                <template  #legend>
                    <div  class="fieldset-legend-custom">
                        <div class="fieldset-legend-image">
                          <img style="width: inherit;
                height: inherit;
                border-radius: 5px 0px 0px 5px;" :src="require( `../assets/${order.owerImage}`)" alt="">
                        </div>
                        <div class="fieldset-legend-title"> - {{ order.title }} -</div>
                    </div>
                </template>

                <!-- ITEMKI -->
                <div  class="order-content">

                  <!-- V-FOR ITEM IN ORDER -->
                  <div class="initialize-transfer inset-button">
                    ROZPOCZNIJ TRANSFER
                  </div>
                  <div v-for="item in order.items" :key="item.id" class="order-item redBorder" :class="{ finish: item.collected == item.max , uncomplete : item.collected != item.max}"  >
                    <div class="order-item-name"> {{item.name}} </div>
                    <div class="order-item-image">

                        <img style="max-height: 50px;" @click="item.showZoomed = true" :src="require( `../assets/${item.image}`)" >

                        <div v-if="item.showZoomed" @click="item.showZoomed = false" class="zoomed-image">

                          <img @click="item.showZoomed = false" class="zoomed-image-content" :src="require( `../assets/${item.image}`)" >

                        </div>

                    </div>
                    <div class="order-item-counter">{{item.collected}}/{{item.max}}</div>
                    <div  class="order-item-add" @click="addToItem(order.id , item.id)" v-if="item.collected < item.max "  >
                      <i class="pi pi-plus"></i>
                    </div>

                    <div class="order-item-progress">

                      <div class="progress-bar">
                        <p style="z-index: 10;position: relative;"> {{ Math.round(item.collected/item.max *100 ) }}% </p>
                        <div class="progress-filling" :style="{ width: item.collected/item.max *100 + '%' }" >

                        </div>
                      </div>

                    </div>

                  </div>
                  <div style="display: grid;margin-top:2%">
                    <div class="order-items-progress">

                      <div class="progress-bar">
                        
                        <p style="z-index: 10;position: relative;"> {{ Math.round(order.allCollected/order.allMax *100) }}% </p>
                        <div class="progress-filling" :style="{ width: order.allCollected/order.allMax *100 + '%' }"    ></div>
                      </div>

                    </div>
                  </div>



                </div>


            </Fieldset>
            <div v-if="order.collapsed" style="margin-top:-55px;padding: 0% 20% 0% 20%;" class="fieldset-collapsed-info">
              <div>
                <div class="progress-bar">
                  <p style="z-index: 10;position: relative;"> {{ Math.round(order.allCollected/order.allMax *100) }}% </p>
                  <div class="progress-filling" :style="{ width: order.allCollected/order.allMax *100 + '%' }"    ></div>
                </div>

              </div>
            </div>



          </div>
        </div>

        <!-- AMUNICJA -->
        <div v-if="activePlace == 'AMUNICJA'" class="main-ammo">

          <div class="ammo-content" style="display: flex;min-height: 35vw;">
            <div class="ammo-item">

              <!-- <table style="font-size:0.7vw; width:100%" >
                <tr class="ammo-table-header" >
                  <th class="white">INFO</th>
                  <th class="">obrażenia</th>
                  <th class=" white">penetracja</th>
                  <th class="">obr. pancerza</th>
                  <th class=" white">szansa fragmentacja</th>
                  <th class="">szansa rykoszet</th>
                  <th class=" white">szybkość</th>
                </tr>
                <tr class="ammo-table-row" v-for="item in reponseApi" :key="item.name" >
                    <td class="ammo-table-cell" > 
                      <div class="ammo-row-name">

                      </div> 
                    </td>
                    <td class="ammo-table-cell" v-for="(value,key) in filtreditem(item)" :key="key" > {{value}} </td>
                </tr>
              </table> -->

            <DataTable 
            :value="reponseApi" 
            v-model:selection="selectedChartAmmo" 
            selectionMode="multiple" 
            dataKey="name" 
            :metaKeySelection="false" 
            style="margin-top: 2em"
            class="p-datatable-responsive-demo"
            @row-select="onRowSelect" 
            @row-unselect="onRowUnselect"
            >
                <template #header>
                  SZUKAJ AMUNICJI
                  <AutoComplete @item-select="apiCall('ammo',selectedAmmo.caliber)" v-model="selectedAmmo" :suggestions="filteredAmmo" @complete="searchAmmo($event)" field="caliber" />

                </template>
                <Column field="name" class="table-head-name"  sortable="true" header="INFO">
                    <template style="width:20%" #body="slotProps">
                      {{ slotProps.data.name }}
                  </template>
                </Column>
                <Column field="damage" sortable="true" header="DMG"></Column>
                <Column field="penetration_power" sortable="true" header="PENET"></Column>
                <Column field="armor_damage" sortable="true" header="ARM DMG"></Column>
                <Column field="fragmentation_chance" sortable="true" header="FRAG"></Column>
                <Column field="ricochet_chance" sortable="true" header="RICO"></Column>
                <Column field="speed" sortable="true" header="SPEED"></Column>
            </DataTable>

            </div>

            <div class="compared-ammo-chart ammo-item" style="position:relative; min-width: 50%;
                                                                                  max-width: 50%;">
              <Chart ref="firstChart" v-if="activeChartType == 'radar'" :type="activeChartType" :options="radarOptions" :data="radarData" class="radar-chart" />
              <Chart ref="firstChart" v-else :type="activeChartType" :data="stackedData" :options="stackedOptions" style="margin-top: 20%;" />
              
              

              <div v-if="activeChartType == 'bar'" @click="stackedOptions.scales.xAxes[0].stacked = !stackedOptions.scales.xAxes[0].stacked , reinitChart() " class="stact-slace"> oX </div>
              <div v-if="activeChartType == 'bar'"  @click="stackedOptions.scales.yAxes[0].stacked = !stackedOptions.scales.yAxes[0].stacked , reinitChart() " class="stact-slace"> oY </div>

              <div style="  position: absolute;
                            width: -webkit-fill-available;
                            bottom: 0;">
                <div class="chart-type" style="     position: absolute;
                                                    width: -webkit-fill-available;
                                                    bottom: 0;">
                  


                  <div @click="addActiveButtonClass('chart-single-type' , chartT.value ), changeActiveClassChart(chartT.value)" class="chart-single-type inset-button" :class="[chartT.value]"  v-for="chartT in chartTypes" :key="chartT.name"> 
                    {{chartT.name}}
                  </div>
                  
                </div>
              </div>

            </div>

          </div>

        </div>


      </div>
  </div>


  <div v-if="visibleLeft == false" style="top:1%;position:absolute" @click="visibleLeft = true" class="p-mr-2" >
    

    

    <span  class="pi pi-arrow-circle-right" style="    color: white;
    font-size: 25px; cursor: pointer;" ></span>
  </div>


    
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      finish:false,
      filterOrder:'all',
      showThisImage:false,
      selectedAmmo:null,
      selectedChartAmmo:null,
      filteredAmmo:null,
      reponseApi:null,
      activeChartType:'bar',
      stackedData: {
				labels: ['DMG', 'PENET', 'ARM DMG', 'FRAG', 'RICO', 'SPEED'],
				datasets: [
				]
      },
      radarData: {
				labels: ['DMG', 'PENET', 'ARM DMG', 'FRAG', 'RICO', 'SPEED'],
				datasets: [
				]
      },
      radarOptions: {
        scale: { 
          ticks: {
              fontColor: "#7688b1",
              backgroundColor: "white",
              backdropColor: 'white'
            },
        gridLines: {
          display: true ,
          color: "#fdfdff63"
        },
        }
      },
			stackedOptions: {
				tooltips: {
					mode: 'index',
					intersect: false
				},
				responsive: true,
				scales: {
					xAxes: [{
						stacked: true,
					}],
					yAxes: [{
						stacked: false
					}]
				}
      },
      chartTypes:[
        {
          name:'RADAR',
          value:'radar'
        },
        {
          name:'SŁUPKI',
          value:'bar'
        }
      ],
      ammoTypes:[
          {
              "name": "7.62x25mm Tokarev",
              "caliber": "7.62x25",
              "image": ""
          },
          {
              "name": "9x18mm Makarov",
              "caliber": "9x18",
              "image": ""
          },
          {
              "name": "9x19mm Parabellum",
              "caliber": "9x19",
              "image": ""
          },
          {
              "name": "9x21mm Gyurza",
              "caliber": "9x21",
              "image": ""
          },
          {
              "name": "4.6x30mm HK",
              "caliber": "4.6x30",
              "image": ""
          },
          {
              "name": "5.7x28mm FN",
              "caliber": "5.7x28",
              "image": ""
          },
          {
              "name": "5.45x39mm",
              "caliber": "5.45x39",
              "image": ""
          },
          {
              "name": "5.56x45mm NATO",
              "caliber": "5.56x45",
              "image": ""
          },
          {
              "name": "7.62x39mm",
              "caliber": "7.62x39",
              "image": ""
          },
          {
              "name": "7.62x51mm NATO",
              "caliber": "7.62x51",
              "image": ""
          },
          {
              "name": "7.62x54mmR",
              "caliber": "7.62x54",
              "image": ""
          },
          {
              "name": "9x39mm",
              "caliber": "9x39",
              "image": ""
          },
          {
              "name": ".366 TKM",
              "caliber": ".366",
              "image": ""
          },
          {
              "name": "12.7x55mm STs-130",
              "caliber": "12.7x55",
              "image": ""
          },
          {
              "name": "12.7x108mm",
              "caliber": "12.7x108",
              "image": ""
          },
          {
              "name": "12x70mm",
              "caliber": "12x70",
              "image": ""
          },
          {
              "name": "20x70mm",
              "caliber": "20x70",
              "image": ""
          },
          {
              "name": "M381 (HE)",
              "caliber": "M381",
              "image": ""
          },
          {
              "name": "M386 (HE)",
              "caliber": "M386",
              "image": ""
          },
          {
              "name": "M406 (HE)",
              "caliber": "M406",
              "image": ""
          },
          {
              "name": "M441 (HE)",
              "caliber": "M441",
              "image": ""
          },
          {
              "name": "XM576E (Buckshot)",
              "caliber": "XM57E",
              "image": ""
          },
          {
              "name": "M716 (Smoke)",
              "caliber": "M716",
              "image": ""
          },
          {
              "name": "30x29mm",
              "caliber": "30x39",
              "image": ""
          }
      ],
      orderItems:null,
      orderItems2:[
        {
          id:1,
          owner:"Franz",
          owerImage:"franz.jpg",
          title:"Dawać stuff",
          items:[
            {
            id:1,
            name:"Red Gun Powder",
            image:"powder.png",
            showZoomed:false,
            collected:5,
            max:5
            },
            {
            id:2,
            name:"Green Gun Powder",
            image:"gpowder.png",
            showZoomed:false,
            collected:3,
            max:4,
            }
          ],
          allCollected:8,
          allMax:9,
          collapsed:true
        },
        {
          id:2,
          owner:"Arczi",
          owerImage:"arczi.jpg",
          title:"Siema byczki !",
          items:[
            {
            id:3,
            name:"Red Gun Powder",
            image:"powder.png",
            showZoomed:false,
            collected:3,
            max:5
            },
            {
            id:4,
            name:"Green Gun Powder",
            image:"gpowder.png",
            showZoomed:false,
            collected:3,
            max:4,
            }
          ],
          precent:5,
          allCollected:6,
          allMax:9,
          collapsed:false
        }
      ],
      value:50,
      activePlace:'AMUNICJA',
      activeColor: 'white',
      visibleLeft: true,
			items: [
				{
					label: 'ZLECENIA',
					command: () => {
            this.activePlace = 'ZLECENIA'
          }
				},
				{
					label: 'MAPY',
					command: () => {
            this.activePlace = 'MAPY'
          }
        },
				{
					label: 'AMUNICJA',
					command: () => {
            this.activePlace = 'AMUNICJA'
          }
				}
			]
    }
  },
  interval: null,
  methods: {
    changeActiveClassChart(value){
        this.activeChartType = value
    },
    reinitChart(){
      this.$refs.firstChart.reinit()
    },
    getRandomColor(transparent) {
        var o = Math.round, r = Math.random, s = 255;

        var color = 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + '1' + ')'
        var transparentColor = color.replace(',1)', ',0.3)')

        if(transparent){
          return [ color , transparentColor ]
        }
        
        return color
        
        

    },
    addToStackDataset(data){
      
      let formatedData = []
      // format data to dataset

      for( var key in data ){
        console.log( data[key], key , 'dsadsadsad')
        if( ['damage' , 'penetration_power','armor_damage' ].includes(key)  ){
          formatedData.push( data[key] )
        }
        if( key == 'fragmentation_chance' ){
          formatedData.push( data[key]*100 )
        }
        if( key == 'ricochet_chance' ){
          formatedData.push( data[key]*100 )
        }
        if( key == 'speed' ){
          formatedData.push( data[key]/10 )
        }
      }

      console.log( formatedData )

      let colors  = this.getRandomColor(true)

      let background = colors[0]
      let backgroudnTransparent  = colors[1]

      
      console.log('TRANSPARENT', colors  )

      let datasetTemplate = {
            label: data.name,
            backgroundColor: background,
            data: formatedData
          }

        
      this.stackedData.datasets.push( datasetTemplate )

      let datasetTemplateTransparent = {
            label: data.name,
            backgroundColor: backgroudnTransparent,
            borderColor: background,
            pointBackgroundColor: background,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: background,
            data: formatedData
          }
      
      this.radarData.datasets.push( datasetTemplateTransparent )

      
      

    },
    removeFromStackDataset(data){

        this.stackedData.datasets  = this.stackedData.datasets.filter( item =>{

          return item.label != data.name
        })

        this.radarData.datasets  = this.radarData.datasets.filter( item =>{

          return item.label != data.name
        })
    },
    onRowSelect(event) {
      try {
        this.addToStackDataset( event.data )
        this.$refs.firstChart.reinit()
      } catch (error) {
        console.log(error , 'ERROR')
      }


    },
    onRowUnselect(event) {
      try {
        this.removeFromStackDataset( event.data )
        this.$refs.firstChart.reinit()
      } catch (error) {
        console.log(error , 'ERROR')
      }
    },
    filtreditem(item){

      delete item['name']; 
      delete item['special_effects']; 
      delete item['sold_by']; 

      return item

    },
    toast(){
      this.$toast.add({severity:'warn', summary: 'Error Message', detail:'Message Content', life: 3000});
      
      this.$toast.add({severity:'error', summary: 'Error Message', detail:'Message Content', life: 4000});

      this.$toast.add({severity:'info', summary: 'Error Message', detail:'Message Content', life: 5000});

      this.$toast.add({severity:'success', summary: 'Error Message', detail:'Message Content', life: 6000});

    },
    searchAmmo(event) {
        setTimeout(() => {
            if (!event.query.trim().length) {
                this.filteredAmmo = [...this.ammoTypes];
            }
            else {
                this.filteredAmmo = this.ammoTypes.filter((ammo) => {
                    return ammo.caliber.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
        }, 250);
    },
    addToItem(orderID, itemID){
      itemID

      this.orderItems.find(x => x.id === orderID).items.find(x => x.id === itemID).collected++
      this.orderItems.find(x => x.id === orderID).allCollected++

      if ( this.orderItems.find(x => x.id === orderID).items.find(x => x.id === itemID).collected == this.orderItems.find(x => x.id === orderID).items.find(x => x.id === itemID).max &&
        this.orderItems.find(x => x.id === orderID).allCollected != this.orderItems.find(x => x.id === orderID).allMax
      ){
        this.$toast.add({severity:'success', summary: 'Error Message', detail:'Message Content', life: 6000});
      }




      if( this.orderItems.find(x => x.id === orderID).allCollected == this.orderItems.find(x => x.id === orderID).allMax ){
      
        this.$toast.add({severity:'success', summary: 'Error Message', detail:'Message Content', life: 6000});

      }

    },
    orderPrecent(orderID){

      return this.orderItems.find(x => x.id === orderID).allCollected
    },
    test(zoomed){
      console.log(zoomed)
    },
    addActiveButtonClass(removedFrom, addTo){
      
      const itemsRemove = document.getElementsByClassName(removedFrom);
      const itemsAdd = document.getElementsByClassName(addTo)[0];

      for(var item of itemsRemove){
           item.classList.remove('active-button');
         }

      itemsAdd.classList.add('active-button')

    },
    apiCall(type, query){
        type = null
        // query = type
        console.log(query)
        let url = 'https://escape-from-tarkov.p.rapidapi.com/items/ammunitions/'+query

        fetch(url, {
          "method": "GET",
          "headers": {
            "x-rapidapi-key": "e9388da679msh40653d1b5975748p1b8f97jsn6cb332776068",
            "x-rapidapi-host": "escape-from-tarkov.p.rapidapi.com"
          }
        })
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData);
          this.reponseApi = responseData;
        })
        .catch(err => {
          console.error(err);
        });

        // this.reponseApi = [ { "name": "AP 6.3", "damage": "52", "penetration_power": 25, "armor_damage": "48", "fragmentation_chance": 0.05, "ricochet_chance": 0.2, "speed": 392, "special_effects": "", "sold_by": "Peacekeeper LL3" }, { "name": "Green Tracer", "damage": "58", "penetration_power": 14, "armor_damage": "33", "fragmentation_chance": 0.15, "ricochet_chance": 0.05, "speed": 365, "special_effects": "Tracer", "sold_by": "Mechanic LL3" }, { "name": "Luger CCI", "damage": "70", "penetration_power": 10, "armor_damage": "38", "fragmentation_chance": 0.25, "ricochet_chance": 0.06, "speed": 420, "special_effects": "", "sold_by": "Skier LL4" }, { "name": "PSO gzh", "damage": "56", "penetration_power": 10, "armor_damage": "32", "fragmentation_chance": 0.25, "ricochet_chance": 0.06, "speed": 340, "special_effects": "Subsonic", "sold_by": "Prapor LL1 Peacekeeper LL1" }, { "name": "Pst gzh", "damage": "54", "penetration_power": 18, "armor_damage": "33", "fragmentation_chance": 0.15, "ricochet_chance": 0.05, "speed": 457, "special_effects": "", "sold_by": "Prapor LL2 Mechanic LL1 Peacekeeper LL2" }, { "name": "RIP", "damage": "102", "penetration_power": 2, "armor_damage": "11", "fragmentation_chance": 1, "ricochet_chance": 0, "speed": 381, "special_effects": "", "sold_by": "Skier LL4 (Barter) after Setup" } ]
    }
  },
  computed: {
    filtredOrderItems(){

      if(this.filterOrder == 'all'){
        return this.orderItems
      }
      if (this.filterOrder == 'uncompleted'){
        return this.orderItems.filter( order =>{
          return order.allMax > order.allCollected
        })
      }

      if (this.filterOrder == 'finished'){
        return this.orderItems.filter( order =>{
          return order.allMax == order.allCollected
        })
      }

      return []
    }
  },
  watch: {
  },
  directives: {
    outsite:{
      bind () {
          this.event = event => this.vm.$emit(this.expression, event)
          this.el.addEventListener('click', this.stopProp)
          document.body.addEventListener('click', this.event)
      },   
      unbind() {
        this.el.removeEventListener('click', this.stopProp)
        document.body.removeEventListener('click', this.event)
      },
    
      stopProp(event) { event.stopPropagation() }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.stact-slace{
  cursor: pointer;
  z-index: -1;
}
.ammo-table-row{
  background: #ffffff13;
}
.ammo-table-header{
  background: #21598d6b;
}
.ammo-table-row:hover{
  background: #21598d6b;
  cursor: pointer;
}
tr:nth-child(even) {
  background-color: #f2f2f231;
}
td:nth-child(odd) {
  color: white;
}
.white{
  color: white;
}
.chart-value-single{
    display: table-cell;
    font-size: 0.6vw;
}
.ammo-chart-value{
    display: table;
    width: 80%;
    float: right;
    margin: 1% 3% 1% 16%;
}
.ammo-chart-labels{
    display: table;
    width: 80%;
    float: right;
    margin: 1% 3% 1% 16%;
}
.chart-label{
    display: table-cell;
    font-size: 0.6vw;
}
.ammo-list{
  margin: 2%;
}
.ammo-list:hover{
  background: #ffffff38;
  transform: scale(1.02);
  transition:  1s;
  cursor: pointer;
}
.radar-chart{
    width: 160%;
    margin-left: -31%;
    z-index: -1;
}
.p-chart {
    position: unset !important;
}
.ammo-item{
  width: 50%;
  border-style: double;
}
.p-autocomplete-panel{
  background: whitesmoke;
}
.p-toast .p-toast-message {
    margin: 0 0 1rem 0;
    box-shadow: 0px 4px 18px 7px rgb(128 178 235 / 34%);
    border-radius: 3px;
}
.p-toast .p-toast-message .p-toast-message-content {
    padding: 1rem;
    border-width: 0 0 0 6px;
}
.p-toast .p-toast-message .p-toast-message-content .p-toast-message-icon {
    font-size: 2rem;
}
.p-toast-message-error{
    background: #ff7878d1;
    border: solid #f70000;
    border-width: 0 0 0 6px;
    color: #044868;
}
.p-toast-message-info{
    background: #91dbf7b0;
    border: solid #0891cf;
    border-width: 0 0 0 6px;
    color: #044868;
}
.p-toast-message-warn{
    background: #f7ea91b0;
    border: solid #ffde00;
    border-width: 0 0 0 6px;
    color: #044868;
}
.p-toast-message-success{
    background: #a5f791b0;
    border: solid #00ce00;
    border-width: 0 0 0 6px;
    color: #044868;
}
.active-button{
  background: #7688b142;
}
.orders-menu{
  display: table;
  width: -webkit-fill-available;

}
.orders-menu-item{
  display: table-cell;
    border-style: inset;
    padding: 0.5%;
    border-color: #7688b1;
    font-weight: 900;
    cursor: pointer;
}
.zoomed-image{
  position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #000000a6;
    z-index: 999;
}
.zoomed-image-content{
    max-width: 100%;
    max-height: 100%;
    bottom: 0;
    left: 0;
    margin: auto;
    overflow: auto;
    position: fixed;
    right: 0;
    top: 0;
    -o-object-fit: contain;
    object-fit: contain;
    transition: 1s;
}
.redBorder{
      box-shadow: 0 0 20px 7px rgb(33 52 73);
}
.finish{
  background:#00ce0059;
  
}
.progress-bar{
    background: #213449;
    position: relative;
    color:white
}
.progress-filling{
    background: #80b2eb;
    width: 10%;
    height: 122%;
    position: absolute;
    top: -2px;
}
.order{
  padding:50px 2% 1% 1%;
}
#main-title{
    border-style: outset;
    padding: 1%;
    border-color: #7688b1;
    font-weight: 900;
    margin-bottom: 1%;

}
#main-content{
    border-style: outset;
    margin-top: 1%;
    min-height: 250px;
    border-color: #7688b1;
    font-weight: 900;

}
.p-sidebar-content{
    height: 100%;
    background:#4340464a;
    color: white;
    width: 250px;
}
.p-sidebar-close{
  background: #7688b1;
}

.p-menu{
  padding-top: 25px;
}
.p-menu .p-menuitem-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    text-decoration: none;
    overflow: hidden;
    position: relative;
    margin-bottom: 10px;
}
.p-menu .p-menuitem-text {
    line-height: 3 !important;
    margin: auto !important;
    border-style: outset;
    border-width: 8px;
    width: 90%;
    opacity: 0.6;
    border-color: #7688b1;
    color: #7688b1;
    font-weight: 900;
}
.p-menu .p-menuitem-text:hover{
  opacity: 1;
}
.p-menu .p-menuitem-text:active{
  border-style: inset;
}

.p-menuitem-link:focus{
  outline: none !important;
  box-shadow: none !important;
}

fieldset {
  position: relative;
  padding-top: 40px;
}
.p-fieldset-toggler {
  display: none;
}
.fieldset-legend-custom{
  display: contents;
}
.fieldset-legend-image{
height: 60px;
    width: 60px;
}
.fieldset-legend-title{
    background: white;
    margin-top: 8px;
    padding: 5px;
}
legend {
    position: absolute;
    top: -37px;
    padding: 0px;
    border-radius: 8px;

}
.order-content{
padding: 1% 10% 1% 10%;
}
.order-item{
    border-style: inset;
    display: table;
    width: -webkit-fill-available;
    margin: 1% 0% 1% 0%;
    padding: 1% 10% 1% 10%;
    border-color: #4c566e94;
}
.order-item-name{
      display: table-cell;
      vertical-align: middle;
      width:30%
}
.order-item-image{
      display: table-cell;
      vertical-align: middle;
      width:20%
}
.order-item-counter{
      display: table-cell;
      vertical-align: middle;
      width:5%
}
.order-item-add{
    cursor: pointer;
      display: table-cell;
      vertical-align: middle;
      width:5%
}
.order-item-progress{
      display: table-cell;
      vertical-align: middle;
      width:20%
}
.order-items-progress{
      display: table-cell;
      vertical-align: middle;
}
.order-item-add:active{
  font-size: 110%;
}
.uncomplete:hover{
  background:#ffffff21;
  cursor: pointer;
  transition: 0.1s;
}
.p-progressbar{
  display: block;
}
.zoom {
  transition: transform .5s; /* Animation */
  margin: 0 auto;
  
}
.zoom:hover {
  transform: scale(4.5); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
  position: relative;
  z-index: 10000;
}
.initialize-transfer{
  width: 33%;
}
.inset-button{
    border-style: inset;
    padding: 0.5%;
    border-color: #7688b1;
    font-weight: 900;
    cursor: pointer;
}
.inset-button:active{
  border-style: outset;
}

.pi {
    font-family: primeicons;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.p-fieldset-toggler{
  display: none;
}

.p-datatable .p-datatable-tbody > tr.p-highlight {
    background: #7587b0;
    color: white;
    border-style: solid;
    border-color: #ffffff6b;
}
.p-datatable table {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
    font-size: 0.7vw;
}
</style>