<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <div class="q-mg-lg">
          <q-btn round color="deep-orange" icon="keyboard_backspace" @click="back"/>
        </div>
        <q-toolbar-title class="q-ml-lg">
          {{ title }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div>
        <q-page class="flex flex-center">
          <auth v-if="stage === 1" @login="login"/>
          <shop v-if="stage === 2" @pay="pay"/>
          <pay v-if="stage === 3" :user="user" :items="items" :currency="currency" @done="done"/>
          <ware v-if="stage === 4" :user="user" :itemsProp="items" :userProp="user" @orderPrepared="orderPrepared"/>
          <order v-if="stage === 5" :toConfirmProp="toConfirm" @confirmAlts="confirmAlts" />
          <final v-if="stage === 6" :user="user" :preparedItems="preparedItems" :discard="discard" @send="send"/>
          <done v-if="stage === 7" :weight="weight" :preparedItems="preparedItems"/>
        </q-page>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      title: 'E-shop',
      stage: 1,
      user: '',
      items: '',
      currency: '',
      weight: 0,
      discard: [],
      preparedItems: [],
      toConfirm: []
    }
  },
  components: {
    auth: require('components/Auth.vue').default,
    shop: require('components/Shop.vue').default,
    pay: require('components/Pay.vue').default,
    ware: require('components/Warehouse.vue').default,
    order: require('components/Orders.vue').default,
    final: require('components/Final.vue').default,
    done: require('components/Done.vue').default
  },
  methods: {
    login (user) {
      this.user = user
      this.stage = 2
    },
    pay (items, currency) {
      this.items = items
      this.currency = currency
      this.stage = 3
    },
    done (x) {
      this.title = 'Interný systém pobočky'
      this.weight = x
      this.stage = 4
    },
    orderPrepared(available, toConfirm, denied) {
      this.preparedItems = available
      this.toConfirm = toConfirm
      this.discard = denied
      if (this.toConfirm.length > 0) {
        this.stage = 5
        this.title = 'E-shop Správa objednávok'
      } else if (this.preparedItems.length === 0) {
        this.title = 'E-shop Správa objednávok'
        this.stage = 7
      } else {
      this.title = 'Interný systém pobočky'
        this.stage = 6
      }
    },
    confirmAlts(out, discard) {
      this.discard = this.discard.concat(discard)
      this.preparedItems = this.preparedItems.concat(out)
      if (this.preparedItems.length === 0) {
        this.title = 'E-shop Správa objednávok'
        this.stage = 7
      }
      this.title = 'Interný systém pobočky'
      this.stage = 6
    },
    send(weight) {
      if (this.weight === 0) {
        this.weight = weight
      }
      this.title = 'E-shop Správa objednávok'
      this.stage = 7
    },
    back () {
      if (this.stage > 1) this.stage--
    }
  }
}
</script>
