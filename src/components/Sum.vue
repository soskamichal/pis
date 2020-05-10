<template>
  <q-card-section>
    Vaša objednávka bude pripravená doručená na vami zadanú adresu v meste <b>{{ city }}</b>.
    Vašu objednávku spracuje naša pobočka v meste <b>{{ final.city.label }}</b>, ktorá je od miesta doručenia vzdialená <b>{{final.distance}}</b> km.
  </q-card-section>
</template>

<script>
export default {
  props: ['city', 'lat', 'lon'],
  data () {
    return {
      options: [
        {
          label: 'Bratislava',
          value: 1,
          lat: 48.1458923,
          lon: 17.1071373,
          distance: 0
        },
        {
          label: 'Bojnice',
          value: 2,
          lat: 48.7813298,
          lon: 18.5840386,
          distance: 0
        },
        {
          label: 'Košice',
          value: 3,
          lat: 48.7210053,
          lon: 21.2577999,
          distance: 0
        }
        ],
        final: {}
    }
  },
  methods: {
    getDistances(source) {
      var convert = require('xml-js');
      for (let i = 0; i < this.options.length; i++) {
        var raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:typ=\"http://pis.predmety.fiit.stuba.sk/pis/geoservices/locations/types\">
            <soapenv:Header/>
            <soapenv:Body>
              <typ:distanceByGPS>
                  <latitudeFrom>` + source.lat + `</latitudeFrom>
                  <longitudeFrom>` + source.lon + `</longitudeFrom>
                  <latitudeTo>` + this.options[i].lat + `</latitudeTo>
                  <longitudeTo>` + this.options[i].lon + `</longitudeTo>
              </typ:distanceByGPS>
            </soapenv:Body>
        </soapenv:Envelope>`
        var requestOptions = {
          method: 'POST',
          headers: {"Content-Type": "application/xml"},
          body: raw,
          redirect: 'manual'
        };
        fetch("http://pis.predmety.fiit.stuba.sk/pis/ws/GeoServices/Locations", requestOptions)
          .then(response => response.text())
          .then(result => {
            result = JSON.parse(convert.xml2json(result, {compact: true, spaces: 2}));
            this.options[i].distance = Number(result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:distanceByGPSResponse"].distance._text) / 1000
          })
          .catch(error => console.log('error', error));
      }
    },
  },
  created() {
    console.log('Its alive!')
  },
  beforeMount() {
    this.getDistances({
      lat: this.lat,
      lon: this.lon
    })
  },
  mounted() {
    setTimeout((() => {
      let shortest = this.options[0].distance
      let shortestIndex = 0
      for (let i = 1; i < this.options.length; i++) {
        if (this.options[i].distance < shortest) {
          shortest = this.options[i].distance
          shortestIndex = i
        }
      }
      this.final = {
        city: this.options[shortestIndex],
        distance: Math.round(shortest * 100) / 100
      }
    }), 250)
  }
}
</script>
