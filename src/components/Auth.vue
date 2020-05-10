<template>
    <q-card class="absolute-center">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Prihlásenie" />
          <q-tab name="register" label="Registrácia" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>

          <q-tab-panel name="login">
            <q-form class="q-pl-lg q-pr-lg max" @submit="login">
              <q-input class="q-mb-sm" square outlined v-model="formInput.email" type="email" label="Email" />
              <q-input class="q-mb-sm" square outlined v-model="formInput.password" type="password" label="Heslo" />
              <div class="row">
                <q-space/>
                <q-btn color="deep-orange" glossy type="submit" label="prihlásiť" />
              </div>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="register">
            <q-form class="q-pl-lg q-pr-lg max" @submit="register">
              <q-input class="q-mb-sm" square outlined v-model="formInput.name" type="text" label="Meno" />
              <q-input class="q-mb-sm" square outlined v-model="formInput.surname" type="text" label="Priezvisko" />
              <q-input class="q-mb-sm" square outlined v-model="formInput.city" type="text" label="Mesto" />
              <q-input class="q-mb-sm" square outlined v-model="formInput.email" type="email" label="Email" />
              <q-input class="q-mb-sm" square outlined v-model="formInput.password" type="password" label="Heslo" />
              <div class="row">
                <q-space/>
                <q-btn color="deep-orange" glossy type="submit" label="registrovať" />
              </div>
            </q-form>
          </q-tab-panel>

        </q-tab-panels>
      </q-card>


</template>

<script>
import axios from "axios"

export default {
  data () {
    return {
      tab: '',
      loggedIn: 0,
      user: {
        name: '',
        surname: '',
        city: '',
        lat: '',
        lon: '',
        email: '',
      },
      formInput: {
        name: '',
        surname: '',
        city: '',
        email: '',
        password: ''
      }
    }
  },
  created () {
    this.tab = 'login'
  },
  methods: {
    lookup (obj, k) {
      for (let key in obj) {

        let value = obj[key];
        if (k == key) return [k, value];

        if (typeof(value) == "Object") {
          var y = lookup(value, k);
          if (y && y[0] == k) return y;
        }
        if (typeof(value) == "Array") {
          // for..in doesn't work the way you want on arrays in some browsers
          //
          for (var i = 0; i < value.length; ++i) {
            var x = lookup(value[i], k);
            if (x && x[0] == k) return x;
          }
        }
      }

      return null;
    },
    register() {
      var convert = require('xml-js');
      var raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:typ=\"http://pis.predmety.fiit.stuba.sk/pis/geoservices/citiessk/types\">
          <soapenv:Header/>
          <soapenv:Body>
            <typ:getByName>
      		    <name>` + this.formInput.city + `</name>
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
          // console.log(result)
          result = JSON.parse(convert.xml2json(result, {compact: true, spaces: 2}));
          let lat = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByNameResponse"].city.coord_lat._text
          // lat = lat._text
          let lon = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByNameResponse"].city.coord_lon._text
          // lon = lon._text
          console.log(lat, lon)
          var raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:typ=\"http://pis.predmety.fiit.stuba.sk/pis/students/team019customers/types\">
              <soapenv:Header/>
              <soapenv:Body>
                <typ:insert>
                    <team_id>019</team_id>
                    <team_password>JK4F8E</team_password>
                    <customers>
                      <id>` + String(Math.floor(Math.random()*100000)) + `</id>
                      <name>` + this.formInput.name + `</name>
                      <surname>` + this.formInput.surname + `</surname>
                      <email>` + this.formInput.email + `</email>
                      <lat>` + lat + `</lat>
                      <lon>` + lon + `</lon>
                      <city>` + this.formInput.city + `</city>
                      <password>` + this.formInput.password + `</password>
                    </customers>
                </typ:insert>
              </soapenv:Body>\n</soapenv:Envelope>`
          console.log(raw)
          var requestOptions = {
            method: 'POST',
            headers: {"Content-Type": "application/xml"},
            body: raw,
            redirect: 'manual'
          };
          let x = ''
          fetch("http://pis.predmety.fiit.stuba.sk/pis/ws/Students/Team019customers", requestOptions)
            .then(response => response.text())
            .then(result => {console.log(result); alert('registrácia úspešná')})
            .catch(error => alert('error', error));
          this.tab = 'login'
        })
        .catch(error => {console.log('error', error); alert('Vami zadané mesto nieje v sluzbe CitiesSk :(')});
    },
    login() {
      var convert = require('xml-js');
      var raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:typ=\"http://pis.predmety.fiit.stuba.sk/pis/students/team019customers/types\">
          <soapenv:Header/>
          <soapenv:Body>
            <typ:getByAttributeValue>
                <attribute_name>email</attribute_name>
                <attribute_value>` + this.formInput.email + `</attribute_value>
                <ids>
                </ids>
            </typ:getByAttributeValue>
          </soapenv:Body>
      </soapenv:Envelope>`

      var requestOptions = {
        method: 'POST',
        headers: {"Content-Type": "application/xml"},
        body: raw,
        redirect: 'manual'
      };

      fetch("http://pis.predmety.fiit.stuba.sk/pis/ws/Students/Team019customers", requestOptions)
        .then(response => response.text())
        .then(result => {
          result = JSON.parse(convert.xml2json(result, {compact: true, spaces: 2}));
          this.user.email = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByAttributeValueResponse"].customerss.customer.email._text
          this.user.name = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByAttributeValueResponse"].customerss.customer.name._text
          this.user.surname = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByAttributeValueResponse"].customerss.customer.surname._text
          this.user.city = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByAttributeValueResponse"].customerss.customer.city._text
          this.user.lat = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByAttributeValueResponse"].customerss.customer.lat._text
          this.user.lon = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByAttributeValueResponse"].customerss.customer.lon._text
          // let tempId = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByAttributeValueResponse"].customerss.customer.id._text
          if (this.formInput.password === result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getByAttributeValueResponse"].customerss.customer.password._text) {
            this.user.loggedIn = 1
            this.$emit('login', this.user)
          } else {
            throw new Error('zle heslo')
          }
        })
        .catch(error => alert('Nespravne prihlasovacie udaje'));
    }
  }
}
</script>

<style scoped>
  q-form.max {
    max-width: 500px ;
  }
</style>
