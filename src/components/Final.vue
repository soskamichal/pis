<template>
  <div>
    <h3>Sumarizácia objednávky</h3>
    <hr>
    <h5 v-if="preparedItems.length === 0">Objednávka je prázdna</h5>
    <div v-else >
      <h6>Objednané položky</h6>
      <q-list bordered separator>
        <q-item v-for="(item, index) in preparedItems" :key="index" class="ready">
          <q-item-section>
            <q-item-label>{{ item.name._text }}</q-item-label>
            <q-item-label caption>{{item.amount}} Kus / Kusov po {{ item.price._text }} EUR / ks</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <hr>
    <h5 v-if="discard.length === 0">Všetky položky ostali v objednávke</h5>
    <div v-else >
      <h6>Odstránené položky</h6>
      <q-list bordered separator>
        <q-item v-for="(item, index) in discard" :key="index" class="unavailable">
          <q-item-section>
            <q-item-label>{{ item.altItem.name._text }}</q-item-label>
            <q-item-label caption>{{item.altItem.amount}} Kus / Kusov po {{ item.altItem.price._text }} EUR / ks</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div>
      <h5>Zadajte váhu konečného balíka v kilogramoch</h5>
      <q-input v-model="weight" label="Váha v Kg" />
      <hr>
      <q-btn color="deep-orange" glossy label="Odoslať kuriérskej službe" @click="send"/>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user', 'preparedItems', 'discard'],
  data () {
    return {
      weight: 0
    }
  },
  methods: {
    send() {
      console.log(this.weight)
      let x = Number(this.weight)
      if (typeof x != 'number' || Object.is(x, NaN) || this.weight <= 0) {
        alert('zadajte validnú váhu')
        return
      }
      this.$emit('send', this.weight)
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
