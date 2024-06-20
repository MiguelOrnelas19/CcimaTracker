<template>
  <div class="gpsVisor">
    <div class="col-md-12">
      <div class="row">
        
        <!-- Barra Lateral -->
        <div class="col-md-3" style="background-color: #ffffff">

          <!-- Titulo Lateral -->
          <div style="padding-top:30px; text-align:center">
            <h4> <strong>Rastreo GPS</strong> </h4>
          </div>

          <!-- Listado de Unidades -->
          <div style="padding-top:30px; text-align:center; overflow-y: scroll;height: 810px;">
            <table class="table table-hover" >
              <thead> 
                <th>Estatus</th>
                <th>Nombre</th>
                <!--th>Tiempo</th-->
                <th></th>
              </thead>
              <tbody>
                <tr v-bind:class="{'table-info': isActive===index }" v-for="(m, index) in orderedItems" :key="index">
                    <td>
                      <div v-if="m.speed === 0 && m.since === 0">
                        <i class="fas fa-circle mr-2" style="color:red"></i>
                      </div>
                      <div v-else-if="m.speed > 0">
                        <i class="fas fa-circle mr-2" style="color:green"></i>
                      </div>
                      <div v-else>
                        <i class="fas fa-circle mr-2" style="color:yellow"></i>
                      </div>                    </td>
                    <td style="text-align:left">{{m.key}}</td>
                    <!--td style="font-size:13px">{{m.since}}</td-->
                    <td>
                      <button v-if="isActive===index" v-on:click="chooseUnity(m, index)" type="button" class="btn btn-info btn-sm">
                        <b-icon class="reff" icon="hand-index" font-scale="1"></b-icon>
                      </button>
                      <button v-else v-on:click="chooseUnity(m, index)" type="button" class="btn btn-outline-info btn-sm">
                        <b-icon class="reff" icon="hand-index" font-scale="1"></b-icon>
                      </button>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
          
        </div>
        
        <!-- Dashboard Mapa -->
        <div class="col-md-9" style="background-color: #f1f5f9">
          <!-- Indicadores -->
          <div class="col-md-12 cardPress">
            <div class="row">
              <div class="titulo col-md-12">
                <div class="row">
                  <div class="col-md-9">
                    <h2 style="font-size: 23px;">
                      <strong> {{selected.key}} <span style="color:red"> | </span> {{selected.name}} 
                        <i class="fas fa-circle mr-3" style="color:hwb(55deg 13% 10%);" v-b-tooltip.hover title="Ver Informe" v-on:click="infoData()"></i>
                        <i class="fas fa-circle mr-3" style="color:red" v-b-tooltip.hover title="Enviar Comandos" v-on:click="sendCommands()"></i>
                      </strong>
                    </h2>
                    <h5 style="font-size: 15px;">{{selected.grupo}} <span style="color:red">/</span> {{selected.subgrupo}} </h5>
                  </div>
                  <div class="col-md-3">
                    <a v-on:click="getRoutes(selected)" class="btn btn-danger" style="width: 80%;"> Ver Rutas</a>
                  </div>
                </div>
                
              </div>
            </div>
            <div class="row">
              <div class="col" style="padding-top: 11px;z-index: 10;">
                <b-card style="height: 110px;">
                  <strong>
                    Velocidad <b-icon icon="tachometer" scale="2" variant="success"></b-icon> <br>
                  </strong>
                  <div>
                    <span style="font-size: 33px;color: red; text-align: center;">
                      <strong>{{_.round(indicadores.velocidad, 2)}}</strong>
                    </span>
                    <span style="color: red; text-align: center;">hm/h</span>
                  </div>
                </b-card>
              </div>
              <div class="col" style="padding-top: 11px;z-index: 10;">
                <b-card style="height: 110px;">
                  <strong>
                    Distancia <br>
                  </strong>
                  <div>
                    <span style="font-size: 33px;color: green; text-align: center;">
                      <strong>0</strong>
                    </span>
                    <span style="color: green; text-align: center;">km</span>
                  </div>
                </b-card>
              </div>
              <div class="col" style="padding-top: 11px;z-index: 10;">
                <b-card style="height: 110px;">
                  <strong>
                    Fecha <br>
                  </strong>
                  <div>
                    <span style="font-size: 23px;color: #9436dc; text-align: center; line-height: 60px;">
                      <strong>{{$moment(indicadores.fecha).format('YYYY-MM-DD')}}</strong>
                    </span>
                  </div>
                </b-card>
              </div>
              <div class="col" style="padding-top: 11px;z-index: 10;">
                <b-card style="height: 110px;">
                  <strong>
                    Movimiento <br>
                  </strong>
                  <div style="padding-top: 10px;">
                    <span style="font-size: 20px; color: black; text-align: center;">
                      <strong>{{indicadores.movimiento}}</strong>
                    </span>
                    
                  </div>
                </b-card>
              </div>
            </div>
          </div>

          <!-- Mapa Here -->
          <div class="col-md-12" style="margin-top: -150px;position: inherit;">
            <HereMap ref="map" :center="center" :zoom="zoom"/>
          </div>
        </div>

      </div>
    </div>
    
    <b-modal v-model="infoModal" title="Resumen" hide-footer>
      <div class="d-block text-center">
        <b-card-text>
          <b-list-group v-if="!_.isUndefined(selected.gpsDevice)">
            <b-list-group-item> <strong>Clave</strong> : {{selected.key}}</b-list-group-item>
            <b-list-group-item> <strong>Nombre</strong> : {{selected.name}}</b-list-group-item>
            <b-list-group-item> <strong>Marca</strong> : {{selected.brand}}</b-list-group-item>
            <b-list-group-item> <strong>Modelo</strong> : {{selected.model}}</b-list-group-item>
            <b-list-group-item> <strong>NoSerie</strong> : {{selected.serial}}</b-list-group-item>
            <b-list-group-item> <strong>Rendimiento Kms</strong> : {{selected.gasPerformanceKms}}</b-list-group-item>
            <b-list-group-item> <strong>Rendimiento Hrs</strong> : {{selected.gasPerformanceHrs}}</b-list-group-item>
            <b-list-group-item> <strong>Número GPS</strong> : {{selected.gpsDevice.number}}</b-list-group-item>
            <b-list-group-item> <strong>IMEI</strong> : {{selected.gpsDevice.imei}}</b-list-group-item>
            <b-list-group-item> <strong>Modelo GPS</strong> : {{selected.gpsDevice.model}}</b-list-group-item>
          </b-list-group>
        </b-card-text>
      </div>
      <b-button class="mt-3 btn btn-danger" block v-on:click="infoModal=false">Cerrar</b-button>
    </b-modal>

    <b-modal v-model="commandsModal" title="Comandos" hide-footer>
      <div class="d-block text-center">
        <b-card-text>
          <b-list-group>
            <b-list-group-item>
              <a class="btn btn-sm btn-outline-dark" 
                style="width: 100%;"
                v-on:click="reconfigGps()">Reconfiguración de Host</a>
            </b-list-group-item>
            <b-list-group-item>
              <a class="btn btn-sm btn-outline-dark" 
              style="width: 100%;"
              v-on:click="powerOff()">Apagar GPS</a>
            </b-list-group-item>
          </b-list-group>
        </b-card-text>
      </div>
      <b-button class="mt-3 btn btn-danger" block v-on:click="commandsModal=false">Cerrar</b-button>
    </b-modal>

    <b-modal v-model="filterModal" title="Filtro por fechas" hide-footer>
      <div class="d-block text-center">
        <b-card-text>
          <b-form inline>
            <div class="col-md-12" style="padding-bottom:20px; text-align: left">
              <span style="" for="inline-form-input-SubGrupo">
                Rango de Fechas: <br><br>
                <div class="row">
                  <div class="col-md-6" style="font-size: 13px;"> <strong>Inicia:</strong> {{ filters.rangeDay[0] }}
                  </div>
                  <div class="col-md-6" style="font-size: 13px;"> <strong>Termina:</strong> {{ filters.rangeDay[1] }}
                  </div>
                </div>
              </span>
              <b-input-group class="col-md-12" style="width: 100%; padding-bottom:10px; padding-top: 20px;">
                <date-picker v-model="filters.rangeDay" range type="datetime" :not-after="new Date"
                  valueType="YYYY-MM-DD HH:mm:ss">></date-picker>
              </b-input-group>
            </div>
          </b-form>
          
        </b-card-text>
      </div>
        <b-button class="mt-3 btn btn-danger" block v-on:click="findRoutes()">Buscar Rutas</b-button>

    </b-modal>
    

  </div>
</template>

<script>
import TwilioService from './../services/TwilioService'
import VisorGpsService from '@/services/VisorGpsService';
import SocketioService from '@/services/socketio.service.js';
import GeolocationService from '@/services/GeolocationService';
import SETTINGS from './../../../Settings/Init.conf.json';
import { io } from 'socket.io-client';
import HereMap from '../components/HereMap'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/es';
export default {
  name: 'gpsVisor',
  data: function () {
    return {
        selectedUnits: [],
        filterModal: false,
        indicadores: {
          velocidad: 0,
          distancia: 0,
          movimiento: '0min, 0seg',
          fecha: this.$moment()
        },
        filters: {
          rangeDay: []
        },
        locationPoints: [],
        realTime: true,
        center: { lat: 23.8542214, lng: -102.256306 },
        zoom: 5.5,
        isActive: false,
        infoModal: false,
        commandsModal: false,
        pointers: [],
        visor: [],
        items: [],
        selected: {},
        fields: [
          {
            key: 'speed',
            label: 'Estatus',
            sortable: true
          },
          {
            key: 'key',
            label: 'Nombre',
            sortable: true
          },
          {
            key: 'since',
            label: 'Tiempo',
            sortable: true
          }
        ]
    }
  },

computed:{
orderedItems(){
  return this._.orderBy(this.items,[
    item => item.speed > 0 ? 'a' : item.speed === 0 && item.since === 0? 'c' : 'b'
  ], ['asc', 'asc']);
}
},

  mounted() {
    this.init()
  },
  methods: {
    async init () {
      let visor = await VisorGpsService.initVisor()
      if(!this._.isEmpty(visor)) {
        this.visor = visor.data
        this.items = visor.data
        this.selected = visor.data[0]
        this.isActive = 0
      } else {
        await this.$swal('Oops.!', 'No se encontraron unidades, puedes agregalas en la configuración', 'warning')
      }
    },
    async getRoutes () {
      this.realTime = false
      this.filterModal = true

      
    },
    async findRoutes () {
      let location = await GeolocationService.getLocationFilter({
        imei: this.selected.gpsDevice.imei,
        dates: this.filters.rangeDay
      })
      this.locationPoints = await this._.orderBy(location.data.path, ['sysDate'], ['asc'])
      this.map = await this.$refs.map
      // await this.map.removeAllObjects()
      if (!this._.isEmpty(this.locationPoints)) {
        console.log('entro: ', this.locationPoints)
        let pts = await this._.orderBy((this.locationPoints), ['sysDate'], ['asc'])
        let puntos = await this._.orderBy(this._.sampleSize(this.locationPoints, 65), ['sysDate'], ['asc']) // .slice(14, 18)
        let waypoints = await []
        let start = await this._.head(pts).lat + ',' + this._.head(pts).lng
        let end = await this._.last(pts).lat + ',' +this._.last(pts).lng
        puntos.map((coord)=>{
          waypoints.push(coord.lat + ',' + coord.lng)
          return waypoints
        })
        console.log('wp: ', waypoints)
        this.map.waypoints(start, end, waypoints, puntos, 'blue')
        this.filterModal = await false
      } else {
        console.log('empty Data: ', this.locationPoints)
      }
    },
    async infoData () {
      this.infoModal = true
    },
    async sendCommands () {
      this.commandsModal = true
    },
    async reconfigGps () {
      this.$swal({
        title: "¿Realmente quieres Reconfigurar?",
        text: "Es posible que la configuración tarde unos minutos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Reconfigurar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          TwilioService.configGPS({
            gpsDevice: this.selected.gpsDevice.number
          })
          this.commandsModal = false
        }
      });
    },
    async powerOff () {
      this.$swal({
        title: "¿Realmente quieres Apagar el GPS?",
        text: "Es posible que la unidad este tripulada ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Apagar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$swal('Oops.!', 'Por el momento esta opcion esta temporalmente desactivada', 'warning')
          this.commandsModal = false
        }
      });
    },
async chooseUnity(data, indx) {
  if (this.selectedUnits.includes(data)) {
    // Cuando se deselecciona una unidad, no mostrar el mensaje
    this.selectedUnits = this.selectedUnits.filter(unit => unit !== data);
    this.map.removeObjectsByKey(data.key);
  } else {
    // Cuando se selecciona una nueva unidad, mostrar el mensaje
    this.$swal({
      title: "Cargando coordenadas!",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Enterado",
    }).then((result) => {
      if(result.isConfirmed){
        this.commandsModal = false;
      }
    });
    console.log('data --> ', data);
    this.map = this.$refs.map;
    this.indicadores = {
      velocidad: 0,
      distancia: 0,
      movimiento: '0min, 0seg',
      fecha: this.$moment(),
    };

    if (this.selectedUnits.length < 5) {
      this.selectedUnits.push(data);
    } else {
      this.$swal('Atención', 'No puedes seleccionar más de 5 unidades', 'warning');
    }
  }

  this.isActive = indx;
  this.realTime = true;
}
  },
  components: {
    HereMap,
    DatePicker
  },
  created() {
  this.socket = io.connect('http://' + SETTINGS.SERVER_IP + ':' + SETTINGS.PORTS.SOCKET_IO);
  this.socket.emit('HandShake', 'Vue GpsVisor');
  this.socket.on('GeoData', (data) => {
    if (this.realTime) {
      this.$nextTick(() => {
        this.map = this.$refs.map
        const selectedUnit = this.selectedUnits.find(unit => unit.gpsDevice.imei === data.gpsDevice.imei);
        if (selectedUnit) {
          let gpsData = data.gpsData
          console.log('selectedUnit: ', selectedUnit)

          var end = this.$moment(data.gpsData.sysDate).format('YYYY-MM-DD HH:mm:ss')
          var start = this.$moment().format('YYYY-MM-DD HH:mm:ss')
          let duration = this.$moment.duration(this.$moment(start).diff(this.$moment(end)));
          let tiempo = duration._data

          if (tiempo.minutes > 5) {
            selectedUnit.movimiento = ' > 5min'
          } else {
            selectedUnit.movimiento = tiempo.minutes + ' min, ' + tiempo.seconds + ' sec, '
          }

          selectedUnit.velocidad = data.gpsData.speed
          selectedUnit.speed = data.gpsData.speed
          selectedUnit.fecha = data.gpsData.sysDate
          selectedUnit.since = selectedUnit.movimiento

          const pointers = [
            {
              lat: gpsData.lat,
              lng: gpsData.lng,
              time: gpsData.sysDate,
              speed: gpsData.speed,
              key: selectedUnit.key
            }
          ]
          this.center = { lat: gpsData.lat, lng: gpsData.lng }
          //this.map.removeAllObjects()
          this.map.dropMarker(this._.head(pointers), selectedUnit.key);
          setTimeout(() => {
              this.$swal.close();
              this.commandsModal = false;
            }
            );
        } else {
          console.log('data: ', data)
          console.log('items: ', this.items)

          this.items.find((val, idx, arr) => {
            if (val._id === data._id) {
              arr[idx].speed = data.gpsData.speed
              var end = this.$moment(data.gpsData.sysDate).format('YYYY-MM-DD HH:mm:ss')
              var start = this.$moment().format('YYYY-MM-DD HH:mm:ss')
              let duration = this.$moment.duration(this.$moment(start).diff(this.$moment(end)));
              let tiempo = duration._data

              if (tiempo.minutes > 5) {
                arr[idx].since = ' > 5min'
              } else {
                arr[idx].since = tiempo.minutes + 'min, ' + tiempo.seconds + 'sec, '
              }
            }
          })
        }
      })
    } else {
      console.log('TR Desactivado')
    }
  });
},
  beforeUnmount() {
    SocketioService.disconnect();
  }
}
</script>

<style scoped>
.gpsVisor {
  /* padding-top: 140px; */
  /* padding-bottom: 40px; */
  padding-top: 77px;
  padding-bottom: 0px;
}

.contenedor {
    max-width: 95% !important;
  }

.titleNF {
  padding: 130px;
  text-align: center;
}

.cardPress {
  background-color:#1e293b; 
  height: 400px; 
  padding-top: 100px; 
  border-radius: 30px;
  margin-top: 10px;
}

.titulo {
  
  position: absolute;
  top: 30px;
  left: 30px;
  color: #ffffff;
}

.mx-datepicker-range {
  width: 100% !important;
}
</style>
