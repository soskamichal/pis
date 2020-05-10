<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <div class="q-mg-lg">
          <q-btn round color="deep-orange" icon="keyboard_backspace" @click="back"/>
        </div>
        <q-toolbar-title class="q-ml-lg">
          E-shop
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div>
        <q-page class="flex flex-center">
          <auth v-if="stage === 1" @login="login"/>
          <shop v-if="stage === 2" @pay="pay"/>
          <pay v-if="stage === 3" :user="user" :items="items" :currency="currency" @done="done"/>
        </q-page>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      stage: 1,
      user: '',
      items: '',
      currency: ''
    }
  },
  components: {
    auth: require('components/Auth.vue').default,
    shop: require('components/Shop.vue').default,
    pay: require('components/Pay.vue').default
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
    done () {
      this.stage = 2
    },
    back () {
      if (this.stage > 1) this.stage--
    }
  }
}
</script>
