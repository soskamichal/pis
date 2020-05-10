<template>
  <div>
    <h3>Super cool eshop</h3>
    <hr>
    <q-list bordered separator>
      <q-item v-for="(item, index) in items" :key="index">
        <q-item-section>
          <q-item-label>{{ item.name._text }}</q-item-label>
          <q-item-label caption>{{ item.price._text }} EUR</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-input
            v-model.number="amount[index]"
            :rules="[ val => val >= 0 || 'Prosím nenakupujte záporné hodnoty lebo vytvoríte čiernu dieru' ]"
            type="number"
            filled
            style="max-width: 200px"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select rounded outlined v-model="curr" :options="options" label="mena" />
        </q-item-section>
        <q-item-section>
          <q-btn color="deep-orange" glossy label="Do košíka" @click="pay"/>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [],
      amount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      curr: 'EUR',
      options: ['EUR', 'USD', 'CZK', 'RUB', 'JPY']
    }
  },
  created () {
    var convert = require('xml-js');
    var raw = `<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:typ=\"http://pis.predmety.fiit.stuba.sk/pis/students/team019products/types\">
      <soapenv:Header/>
      <soapenv:Body>
          <typ:getAll/>
      </soapenv:Body>
    </soapenv:Envelope>`
    var requestOptions = {
      method: 'POST',
      headers: {"Content-Type": "application/xml"},
      body: raw,
      redirect: 'manual'
    };
    fetch("http://pis.predmety.fiit.stuba.sk/pis/ws/Students/Team019products", requestOptions)
      .then(response => response.text())
      .then(result => {
        result = JSON.parse(convert.xml2json(result, {compact: true, spaces: 2}));
        result = result["SOAP-ENV:Envelope"]["SOAP-ENV:Body"]["ns1:getAllResponse"].productss.product
        console.log(result)
        this.items = result
      })
      .catch(error => console.log('error', error));
  },
  methods: {
    pay () {
      let sum = 0
      for (let i = 0; i < this.amount.length; i++) {
        if (this.amount[i] < 0) {
          alert('Zadajte nezápornú hodnotu prosím')
          return
        }
        sum += this.amount[i]
      }
      if (sum === 0) {
        alert('Košík je prázdny')
        return
      }
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].amount = this.amount[i]
      }
      console.log('kosik na zaplatenie', this.items)
      this.$emit('pay', this.items, this.curr)
    }
  }
}
</script>
