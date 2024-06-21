<template>
    <div>
        <div id="map" ref="map"></div>
        
    </div>
</template>

<script>
import moment from "moment";
import config from '@/../config.json'
export default {
    name: 'HereMap',
    props: {
        center: Object,
        zoom: Number
    },
    data() {
        return {
            apikey: config.hereMaps.apiKey,
            appId: '',
            appCode: '',
            platform: {},
            map: {},
            stops: [],
            index: 0,
        }
    },
    created() {
        this.platform = new window.H.service.Platform({
            apikey: this.apikey
        })
    },
    mounted() {
        this.map = new window.H.Map(
            this.$refs.map,
            this.platform.createDefaultLayers().vector.normal.map,
            {
                zoom: this.zoom,
                center: this.center,
                lg: 'es'
            }
        );

        var defaultLayers = this.platform.createDefaultLayers();
        var ui = window.H.ui.UI.createDefault(this.map, defaultLayers);
        ui.getControl('zoom').setDisabled(false)

        let mapEvent = new window.H.mapevents.MapEvents(this.map)
        new window.H.mapevents.Behavior(mapEvent)
    },
    methods: {
        async setCenter () {
            this.platform.createDefaultLayers().vector.normal.map,
            {
                zoom: this.zoom,
                center: this.center,
                lg: 'es'
            }
            this.map.setCenter(this.center);
            // this.map.setZoom(this.zoom);
        },
        async dropMarker(position, key) {
        // Verificar si ya existe un marcador con el mismo key y borrarlo si es necesario
        const existingMarkers = this.map.getObjects();
        existingMarkers.forEach(marker => {
        if (marker instanceof window.H.map.Marker && marker.getData() === key) {
            this.map.removeObject(marker);
        }
    });

    // Creación de capas predeterminadas
    this.platform.createDefaultLayers().vector.normal.map,
    {
        zoom: this.zoom,
        center: this.center,
        lg: 'es'
    }
    this.map.setCenter(this.center);

    // Crear el marcador
    let marker = new window.H.map.Marker(position);
    marker.setData(key); // Asignar el key al marcador para futuras referencias
    //Evento para poder dar clic al marcador 
    marker.addEventListener('tap', () => {
    this.$emit('marker-clicked', key);
    });
    // Crear el tooltip
    let tooltip = document.createElement('div');
    tooltip.innerHTML = key;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'white';
    tooltip.style.padding = '1px';
    tooltip.style.border = '1px solid black';
    tooltip.style.borderRadius = '1px';

    // Añadir el tooltip al mapa
    marker.addEventListener('pointerenter', () => {
        this.map.getElement().appendChild(tooltip);
        let screenCoords = this.map.geoToScreen(position);
        tooltip.style.left = `${screenCoords.x}px`;
        tooltip.style.top = `${screenCoords.y - 30}px`; // Ajuste para mostrar el tooltip arriba del marcador
    });

    marker.addEventListener('pointerleave', () => {
        this.map.getElement().removeChild(tooltip);
    });

 
    this.map.addObject(marker);
},
async removeObjectsByKey(key) {
  const existingObjects = this.map.getObjects();
  const objectsToRemove = existingObjects.filter(obj => {
    if (obj instanceof window.H.map.Marker || obj instanceof window.H.map.Polyline) {
      return obj.getData() === key;
    }
    return false;
  });
  this.map.removeObjects(objectsToRemove);
},
        async drawCircle(position, radius) {
            let circle = new window.H.map.Circle(position, radius, {
                style: {
                    strokeColor: 'rgba(55, 85, 170, 0.6)', // Color of the perimeter
                    lineWidth: 2,
                    fillColor: 'rgba(0, 128, 0, 0.7)'  // Color of the circle 
                }
            })
            this.map.addObject(circle)
        },
        async drawLine(start, finish) {
            let lineString = new window.H.geo.LineString()
            lineString.pushPoint(start)
            lineString.pushPoint(finish)
            let polyline = new window.H.map.Polyline(lineString)
            this.map.addObject(polyline)
        },
        async showParadas(route) {
            var paradas = []
            this._.forEach(route, function (point, index) {
                var start, end = null
                if (index % 2 == 0) {
                    start = point.sysDate
                } else {
                    end = point.sysDate
                }
                if (start !== null && end !== null) {
                    let duration = moment.duration(moment(start).diff(moment(end)));
                    let minuts = duration._data.minutes
                    if (minuts >= 5) {
                        paradas.push(point)
                    }
                }
            })
            this.stops = await [...paradas]
        },
        async drawRoute(route) {
            await this.showParadas(route);
            let lineString = new window.H.geo.LineString()
            this._.forEach(route, function (point) {
                lineString.pushPoint(point);
            })
            this.stops.forEach((dt, index) => {
                this.index = index
                this.drawCircle({ lat: dt.lat, lng: dt.lng }, 6)
                this.drawCircle({ lat: dt.lat, lng: dt.lng }, 23)
            });
            let polyline = new window.H.map.Polyline(lineString, {
                style: { lineWidth: 4, strokeColor: 'blue' }
            });
            this.map.addObject(polyline)
        },
        async removeLastMarker() {
            var objects = this.map.getObjects().filter(function (item) {
                return item.type === window.H.map.Object.Type.MARKER;
            });
            this.map.removeObject(objects[1])
        },
        async removeAllObjects() {
            var objects = this.map.getObjects();
            this.map.removeObjects(objects)
        },

        async waypoints(startPar, endPar, waypointsPar, points, color) {
            console.log('startPar: ', startPar)
            console.log('endPar: ', endPar)
            console.log('waypointsPar: ', waypointsPar)

            let start = startPar
            let waypoints = waypointsPar// this._.sampleSize(waypointsPar, 200);
            let end = endPar
            let routingParameters = {
                'origin': start,
                'destination': end,
                'via': new window.H.service.Url.MultiValueQueryParameter( waypoints ),
                'routingMode': 'fast',
                'transportMode': 'car',
                'return': 'polyline',
            };
            let router = this.platform.getRoutingService(null, 8)
            router.calculateRoute(routingParameters, ( result )=>{
                console.log('----> result: ', result)
                if (result.routes.length) {
                    result.routes[0].sections.forEach((section) => {
                        let linestring = window.H.geo.LineString.fromFlexiblePolyline(section.polyline);
                        let routeLine = new window.H.map.Polyline(linestring, {
                            style: { strokeColor: color, lineWidth: 3 }
                        });

                        let inicia = new window.H.map.Icon("https://firebasestorage.googleapis.com/v0/b/hd-asesores-go.appspot.com/o/CTrack%2Fmarcador-de-posicion1.png?alt=media&token=5f937ff6-08fe-4df4-a258-85837f05a376", { size: { w: 47, h: 47 } });
                        let startMarker = new window.H.map.Marker(this._.head(points), { icon: inicia })

                        let termina = new window.H.map.Icon("https://firebasestorage.googleapis.com/v0/b/hd-asesores-go.appspot.com/o/CTrack%2Fmarcador-de-posicion2.png?alt=media&token=a1851ccf-8dff-4d8e-98b6-a72bed6ba726", { size: { w: 47, h: 47 } });
                        let endMarker = new window.H.map.Marker(this._.last(points), { icon: termina })

                        this.map.addObjects([routeLine, startMarker, endMarker]);
                        this.map.getViewModel().setLookAtData({
                            zoom: this.zoom,
                            bounds: routeLine.getBoundingBox()
                        });
                        
                    })
                }
            }, ( onError ) => {
                console.log('onError: ', onError)
            })
        }
    }
}
</script>

<style scoped>
#map {
    height: 600px;
    width: 100%
}
</style>