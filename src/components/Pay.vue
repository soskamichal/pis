<template>
  <div>
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Košík"
        icon="store"
        :done="step > 1"
      >
        <h3>Košík</h3>
        <hr>
        <q-list bordered separator>
          <q-item v-for="(item, index) in items" :key="index">
            <q-item-section>
              <q-item-label>{{ item.name._text }}</q-item-label>
              <q-item-label caption>{{item.price._text}} EUR</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.amount }}</q-item-label>
              <q-item-label caption>Spolu: {{ Math.round(Number(item.price._text) * item.amount * 100) / 100 }} EUR</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <hr>
        <h5 style="margin-bottom: 5px">Spolu: {{ sum }} EUR</h5>
        <p v-if="currency != 'EUR'" style="color: grey">{{ foreignsum }} {{ currency }}</p>
      </q-step>

      <q-step
        :name="2"
        title="Doručenie"
        icon="local_shipping"
        :done="step > 2"
      >
        <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="home" label="Domov" />
          <q-tab name="shop" label="Na pobočku" />
          <q-tab name="address" label="Na adresu" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="home">
            <div class="text-h6">Domov</div>
            Vašu objednávku vám vybaví a doručí najbližšia pobočka ku vášmu domu v meste {{ user.city }}
          </q-tab-panel>

          <q-tab-panel name="shop">
            <div class="text-h6">Na Pobočku</div>
            Ak si želáte osobný odber na niektorú z našich pobočiek, vyberte si ktorú
            <q-select
              class="q-pt-mg"
              filled
              v-model="model"
              :options="options"
              label="Pobočka"
              color="teal"
              clearable
              options-selected-class="text-deep-orange"
            >
              <template v-slot:option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section>
                    <q-item-label v-html="scope.opt.label" />
                    <q-item-label caption>{{ String(scope.opt.distance) }} km od vášho domu</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-tab-panel>

          <q-tab-panel name="address">
            <div class="text-h6">Na inú adresu</div>
            Ak si tovar želáte doručiť na inú adresu než domov zadajte ju sem
            <q-form class="q-pl-lg q-pr-lg max">
              <q-input class="q-mb-sm" square outlined v-model="otherCity" type="text" label="Mesto" />
              <q-input class="q-mb-sm" square outlined disable type="text" label="Ulica" />
              <q-input class="q-mb-sm" square outlined disable type="text" label="Ďalšie..." />
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
          </div>
  </div>
      </q-step>

      <q-step
        :name="3"
        title="Zhrnutie"
        icon="functions"
      >
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Zhrnutie</div>
            <div class="text-subtitle2">Cena: {{ sum }} EUR</div>
          </q-card-section>

          <q-card-section v-if="tab == 'home'">
            Vaša objednávka bude pripravená doručená domov.
            Vašu objednávku spracuje naša pobočka v meste <b>{{ final.city }}</b>, ktorá je od miesta doručenia vzdialená <b>{{ Math.round(final.distance * 100) / 100}}</b> km.
          </q-card-section>
          <q-card-section v-else-if="tab == 'shop'">
            Vaša objednávka bude spracovaná a neskôr pripravená na vyzdvihnutie na našej pobočke v meste <b>{{ final.city }}</b>.
          </q-card-section>
          <sum v-else :lat="altLat" :lon="altLon" :city="otherCity"/>
        </q-card>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn v-if="step < 2" @click="$refs.stepper.next()" color="primary" label="Pokračovať" />
          <q-btn v-if="step === 2" @click="end" color="primary" label="Vybrať doručenie" />
          <q-btn v-if="step === 3" @click="done" color="primary" label="Potvrdiť objednávku" />
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Späť" class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script>
export default {
  props: ['user', 'items', 'currency'],
  components: {
    sum: () => import('components/Sum.vue')
  },
  data () {
    return {
      step: 1,
      tab: 'home',
      otherCity: '',
      sum: 0,
      altLat: 0,
      altLon: 0,
      model: null,
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
      foreignsum: 0,
      final: {}
    }
  },
  beforeMount () {
    this.getDistances({
      lat: this.user.lat,
      lon: this.user.lon
    })
  },
  created () {
    var convert = require('xml-js');
    for (let i = 0; i < this.items.length; i++) {
      this.sum += Number(this.items[i].price._text) * this.items[i].amount
    }
    this.sum = Math.round(this.sum * 100) / 100
    if (this.currency != 'EUR') {
      var raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:typ=\"http://pis.predmety.fiit.stuba.sk/pis/currencyconvertor/types\">
          <soapenv:Header/>
          <soapenv:Body>
            <typ:convert>
                <currency_from>eur</currency_from>
                <currency_to>` + this.currency + `</currency_to>
                <amount>` + String(this.sum) + `</amount>
                <precision>2</precision>
            </typ:convert>
          </soapenv:Body>
      </soapenv:Envelope>`
      var requestOptions = {
        method: 'POST',
        headers: {"Content-Type": "application/xml"},
        body: raw,
        redirect: 'manual'
      };
      fetch("http://pis.predmety.fiit.stuba.sk/pis/ws/CurrencyConvertor", requestOptions)
        .then(response => response.text())
        .then(result => {
          result = JSON.parse(convert.xml2json(result, {compact: true, spaces: 2}));
          this.foreignsum = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:convertResponse"].value._text
        })
        .catch(error => {alert('nepodarilo sa načítať cudziu menu'), console.log(error)});
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
    getShortest() {
      let shortestIndex = 0
      let shortest = this.options[0].distance
      for (let i = 1; i < this.options.length; i++) {
        if (this.options[i].distance < shortest) {
          shortest = this.options[i].distance
          shortestIndex = i
        }
      }
      let ret = {
        city: this.options[shortestIndex],
        distance: this.shortest
      }
      return ret
    },
    end () {
      if (!this.tab.localeCompare('home')) {
        let city = this.getShortest()
        this.final.city = String(city.city.label)
        this.final.distance = Number(city.city.distance)
        this.step = 3
      } else if (!this.tab.localeCompare('shop')) {
        if (this.model == null) {
          alert('Vyberte si pobočku')
          return
        }
        this.final.city = this.model.label
        this.step = 3
      } else {

      var convert = require('xml-js');
      var raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:typ=\"http://pis.predmety.fiit.stuba.sk/pis/geoservices/citiessk/types\">
          <soapenv:Header/>
          <soapenv:Body>
            <typ:getByName>
      		    <name>` + this.otherCity + `</name>
            </typ:getByName>
          </soapenv:Body>
      </soapenv:Envelope>`

      var requestOptions = {
        method: 'POST',
        headers: {"Content-Type": "application/xml"},
        body: raw,
        redirect: 'manual'
      };

      fetch("http://pis.predmety.fiit.stuba.sk/pis/ws/GeoServices/CitiesSK", requestOptions)
        .then(response => response.text())
        .then(result => {
          result = JSON.parse(convert.xml2json(result, {compact: true, spaces: 2}));
          this.altLat = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByNameResponse"].city.coord_lat._text
          this.altLon = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByNameResponse"].city.coord_lon._text
          this.step = 3
        })
        .catch(error => {console.log('error', error); alert('Vami zadané mesto nieje v sluzbe CitiesSk :(')});

      }
    },
    done() {
      alert('Objednávka bola potvrdená')
      this.$emit('done')
    }
  }
}
</script>
