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
  </div>
</template>

<script>
export default {
  props: ['user', 'preparedItems', 'discard'],
  created() {

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
