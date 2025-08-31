<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue';
import { usePokedexById } from '../lib/api/pokeapi';
import Card from './Card.vue'

const { data: pokedex } = usePokedexById(1);

const batchSize = 24;
const itemsToShow = ref(batchSize);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const muteCries = ref(true);

const visibleEntries = computed(() =>
  pokedex.value ? pokedex.value.pokemon_entries.slice(0, itemsToShow.value) : []
);

const hasMore = computed(() =>
  pokedex.value ? itemsToShow.value < pokedex.value.pokemon_entries.length : false
);

function loadMore() {
  if (!pokedex.value) return;
  const total = pokedex.value.pokemon_entries.length;
  if (itemsToShow.value < total) {
    itemsToShow.value = Math.min(itemsToShow.value + batchSize, total);
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        loadMore();
      }
    },
    { root: null, rootMargin: '200px', threshold: 0 }
  );
  if (sentinel.value) observer.observe(sentinel.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

watch(sentinel, (el, oldEl) => {
  if (!observer) return;
  if (oldEl) observer.unobserve(oldEl);
  if (el) observer.observe(el);
});

async function ensureInitialFill() {
  if (!pokedex.value) return;
  // Limit the number of auto-load iterations to avoid long loops
  let safety = 5;
  const tryFill = async () => {
    await nextTick();
    const fullHeight = document.documentElement.scrollHeight;
    const viewport = window.innerHeight;
    if (hasMore.value && fullHeight <= viewport && safety-- > 0) {
      loadMore();
      await tryFill();
    }
  };
  await tryFill();
}

watch(
  () => [pokedex.value, itemsToShow.value],
  () => {
    if (pokedex.value) ensureInitialFill();
  },
  { immediate: true }
);
</script>

<template>
  <header>
    <div class="header-bar">
      <h1 v-if="pokedex"><img src="../assets/pokeball.svg" alt="A pokeball" /> {{ pokedex.name }} Pokedex</h1>
      <h1 v-else><img class="spin" src="../assets/pokeball.svg" alt="A pokeball" /> Loading...</h1>
      <button v-if="pokedex" class="mute-toggle" :aria-pressed="muteCries" @click="muteCries = !muteCries">
        {{ muteCries ? 'Unmute cries' : 'Mute cries' }}
      </button>
    </div>
    <p v-if="pokedex">{{ pokedex.description }}</p>
  </header>
  <section id="pokedex" v-if="pokedex">
    <Card v-for="entry in visibleEntries" :key="entry.entry_number" :dexPokemon="entry" :muteCries="muteCries" />
    <div v-if="hasMore" ref="sentinel" class="sentinel" aria-hidden="true"></div>
  </section>
</template>

<style scoped lang="scss">
header {
  max-width: calc(100% - 4rem);
  padding: 2rem;

  .header-bar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    text-transform: capitalize;
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    grid-column: 2;
    justify-self: center;

    img {
      width: 2rem;
      height: 2rem;
    }
  }

  .mute-toggle {
    grid-column: 3;
    justify-self: end;
    border: 1px solid #f2f2f2;
    background: #1f1f1f;
    color: #f2f2f2;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    cursor: pointer;
  }
}

#pokedex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  min-height: 90vh;
}

.sentinel {
  width: 100%;
  height: 1rem;
}
</style>
