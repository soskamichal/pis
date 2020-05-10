<template>
  <div>
    <h3>Vaša objednávka</h3>
    <hr>
    <q-list bordered separator>
      <div v-for="(item, index) in toConfirm" :key="index" v-bind:class="{ ready: styles[index] === 1, unavailable: styles[index] === 2 }">
        <q-item>
          <q-item-section>
            <h6 style="margin-bottom: 5px; margin-top: 5px">Pôvodná, nedostupná položka</h6>
            <q-item-label>{{ item.name._text }}</q-item-label>
            <q-item-label caption>{{item.amount}} Kus / Kusov po {{ item.price._text }} EUR / ks</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <h6 style="margin-bottom: 5px; margin-top: 5px">Ponúknuta alternatíva</h6>
            <q-item-label>{{ item.altItem.name._text }}</q-item-label>
            <q-item-label caption>{{item.amount}} Kus / Kusov po {{ item.altItem.price._text }} EUR / ks</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-btn-group spread>
              <q-btn color="red" icon="clear" @click="deny(index)" />
              <q-btn color="green" icon="check" @click="confirm(index)"/>
            </q-btn-group>
          </q-item-section>
        </q-item>
        <hr>
      </div>
    </q-list>
    <hr>
    <h6>Nezamietnuté alternatívy vám budú automaticky poslané do objednávky</h6>
    <q-btn color="deep-orange" glossy label="Potvrdiť alternatívy" @click="confirmAlts"/>
  </div>
</template>

<script>
export default {
  props: ['toConfirmProp'],
  data () {
    return {
      toConfirm: [],
      confirmed: [],
      styles: []
    }
  },
  created () {
    this.toConfirm = this.toConfirmProp
    this.confirmed = new Array(this.toConfirm.length).fill(1)
    this.styles = new Array(this.toConfirm.length).fill(0)
  },
  methods: {
    confirm(index) {
      this.styles.splice(index, 1, 1)
      this.confirmed[index] = 1
    },
    deny(index) {
      this.styles.splice(index, 1, 2)
      this.confirmed[index] = 0
    },
    confirmAlts() {
      let out = []
      let discard = []
      for (let i = 0; i < this.toConfirm.length; i++) {
        if (this.confirmed[i] === 1) {
          let item = this.toConfirm[i].altItem
          out.push(item)
        } else {
          discard.push(this.toConfirm[i].altItem)
        }
      }
      console.log('orders disc', discard)
      this.$emit('confirmAlts', out, discard)
    }
  }
}
</script>

<style scoped>
  .ready {
    background-color: #bcff9e;
  }
  .unavailable {
    background-color: #ffa99e;
  }
</style>
