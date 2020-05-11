<template>
  <q-card class="absolute-center" style="padding: 20px">
    <div>
      <h3 v-if="status === 0">Ďakujeme za váš nákup, vaša objednávka je na ceste a bude vám doručená {{ courier }}</h3>
      <div v-else-if="status === 1" class="fit column wrap justify-center items-center content-center">
        <h3>Kuriér vám nemôže doručiť zásielku, prosím vyberte si iný dátum doručenia</h3>
        <q-date
          v-model="date"
          minimal
        />
        <q-btn style="margin-top: 20px" color="deep-orange" glossy label="Odoslať kuriérskej službe" @click="send"/>
      </div>
      <h3 v-else>Keďže vo vašej objednávke nič neostalo, bola zrušená</h3>
    </div>
  </q-card>
</template>

<script>
export default {
  props: ['weight', 'preparedItems'],
  data () {
    return {
      status: 0,
      courier: 'Autom',
      date: '2020/5/13'
    }
  },
  created () {
    let count = 0
    for (let i = 0; i < this.preparedItems.length; i++) {
      count += this.preparedItems[i].amount
    }
    if (count === 0) {
      this.status = 2
      return
    }
    if (!this.weight.localeCompare('shop')) {
      this.courier = 'na vami vybranú pobočku'
      return
    }
    if (count < 20 && this.weight < 10) {
      this.courier = 'Cyklokuriérom'
    }
    if (1) {
      this.status = 1
    }
  },
  methods: {
    send() {
      this.status = 0
    }
  }
}
</script>
