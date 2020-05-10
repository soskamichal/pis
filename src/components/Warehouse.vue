<template>
  <div>
    <h3>Objednávka pre zákazníka {{ user.name }} {{ user.surname }}</h3>
    <hr>
    <h5 v-if="orderedItems.length === 0">Objednávka je prázdna</h5>
    <div v-else >
      <h6>Objednané položky</h6>
      <q-list bordered separator>
        <q-item v-for="(item, index) in orderedItems" :key="index">
          <q-item-section>
            <q-item-label>{{ item.name._text }}</q-item-label>
            <q-item-label caption>{{ item.amount }} KS</q-item-label>
          </q-item-section>
          <q-item-section>
            <h6 style="margin-bottom: 5px; margin-top: 5px">Dostupné na sklade a pripravené</h6>
            <q-btn-group spread>
              <q-btn color="red" icon="clear" @click="showAlt(index)"/>
              <q-btn color="green" icon="check" @click="prepare(index)" />
            </q-btn-group>
          </q-item-section>
          <div v-if="item.showAlt === 1" style="padding-left: 10px; margin-left: 10px; border-left: 1px solid black;">
            <q-item-section>
              <h5 style="margin-bottom: 5px; margin-top: 5px">Alternatíva</h5>
              <q-item-label>{{ item.altItem.name._text }}</q-item-label>
              <q-item-label caption>{{ item.amount }} KS</q-item-label>
            </q-item-section>
            <q-item-section>
              <h6 style="margin-bottom: 5px; margin-top: 5px">Dostupné na sklade</h6>
              <q-btn-group spread>
                <q-btn color="red" icon="clear" @click="unavailable(index)"/>
                <q-btn color="green" icon="check" @click="prepareAlt(index)" />
              </q-btn-group>
            </q-item-section>
          </div>
        </q-item>
      </q-list>
    </div>
    <hr>
    <h6>Spracované položky</h6>
    <q-list bordered separator >
      <q-item v-for="(item, index) in preparedItems" :key="index" v-bind:class="{ ready: item.style === 0, alter: item.style === 1, unavailable: item.style === 2 }">
        <q-item-section>
          <q-item-label v-if="item.style === 1">{{ item.altItem.name._text }}</q-item-label>
          <q-item-label v-else>{{ item.name._text }}</q-item-label>
          <q-item-label caption>{{ item.amount }} KS</q-item-label>
        </q-item-section>
        <q-item-section>
          <h6 style="margin-bottom: 5px; margin-top: 5px">Stav:</h6>
          <h6 style="margin-bottom: 5px; margin-top: 5px">{{ item.state }}</h6>
          <p v-if="item.style === 1">Pôvodná položka: {{ item.name._text }}</p>
        </q-item-section>
        <q-item-section>
          <!-- <q-btn color="red" icon="clear" @click="unset(index)"/> -->
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn color="deep-orange" glossy label="Pripravená objednávka" @click="orderPrepared"/>
  </div>
</template>

<script>
const cloneDeep = require('clone-deep');

export default {
  props: ['itemsProp', 'userProp'],
  data () {
    return {
      user: {},
      allItems: [],
      orderedItems: [],
      preparedItems: [],
      available: [],
      toConfirm: [],
      denied: [],
      alts: []
    }
  },
  created () {
    this.alts = new Array(this.allItems.length).fill(0)
    this.allItems = this.itemsProp
    this.user = this.userProp
    for (let i = 0; i < this.allItems.length; i++) {
      if (this.allItems[i].amount > 0) {
        this.orderedItems.push(this.allItems[i])
      }
    }
    for (let i = 0; i < this.orderedItems.length; i++) {
      for (let j = 0; j < this.allItems.length; j++) {
        if (this.orderedItems[i].alt._text == this.allItems[j].id._text) {
          this.orderedItems[i].showAlt = 0
          this.orderedItems[i].altItem = cloneDeep(this.allItems[j])
          this.orderedItems[i].altItem.amount = this.allItems[j].amount
          break
        }
      }
    }
  },
  methods: {
    prepare(index) {
      const item = this.orderedItems[index]
      item.state = 'Pripravené'
      item.style = 0
      this.preparedItems.push(item)
      this.available.push(cloneDeep(item))
      this.orderedItems.splice(index, 1)
      this.alts.splice(index, 1)
    },
    showAlt(index) {
      const item = this.orderedItems[index]
      item.showAlt = 1
      this.orderedItems.splice(index, 1, item)
    },
    unavailable(index) {
      const item = this.orderedItems[index]
      item.state = 'Nedostupné'
      item.style = 2
      this.preparedItems.push(item)
      this.denied.push(cloneDeep(item))
      this.orderedItems.splice(index, 1)
      this.alts.splice(index, 1)
    },
    prepareAlt(index) {
      const item = this.orderedItems[index]
      item.state = 'Alternatíva'
      item.style = 1
      this.preparedItems.push(item)
      this.toConfirm.push(cloneDeep(item))
      this.orderedItems.splice(index, 1)
      this.alts.splice(index, 1)
    },
    unset(index) {
      this.alts.splice(this.orderedItems.length, 1, 0)
      const item = this.preparedItems[index]
      item.showAlt = 0
      this.orderedItems.push(item)
      this.preparedItems.splice(index, 1)
    },
    orderPrepared () {
      let len = this.preparedItems.length
      for (let i = 0; i < len; i++) {
        if (this.preparedItems[i].style === 2) {
          this.preparedItems.splice(i, 1)
          len--
        }
      }
      this.$emit('orderPrepared', this.available, this.toConfirm, this.denied)
    }
  }
}
</script>

<style scoped>
  .ready {
    background-color: #bcff9e;
  }
  .alter {
    background-color: #fff99e;
  }
  .unavailable {
    background-color: #ffa99e;
  }
</style>
