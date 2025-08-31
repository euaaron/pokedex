<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePokemon } from '../lib/api/pokeapi';
import { usePokemonColor } from '../lib/hooks/usePokemonColor';
import type { DexPokemon } from '../lib/models/pokedex';

const props = defineProps<{ dexPokemon: DexPokemon; muteCries?: boolean }>();

const { data: pokemon } = usePokemon(props.dexPokemon.entry_number);
const pokemonColor = usePokemonColor(props.dexPokemon.entry_number);

// Cry source (PokeAPI provides cries.latest/legacy)
const crySrc = computed<string | null>(() => {
  const cries: any = pokemon.value?.cries;
  if (!cries) return null;
  return cries.latest ?? cries.legacy ?? null;
});

// Audio element and play handler
const audioEl = ref<HTMLAudioElement | null>(null);
function playCry() {
  const el = audioEl.value;
  if (!el || !crySrc.value || props.muteCries) return;
  try {
    el.pause();
    el.currentTime = 0;
    void el.play();
  } catch {}
}

</script>

<template>
  <button :style="`--pokemon-color: ${pokemonColor};`" @mouseenter="playCry" @focus="playCry">
    <div>
      <header>
        <h2>{{ dexPokemon.pokemon_species.name }}</h2>
      </header>
      <img
        v-if="pokemon && pokemon.sprites && pokemon.sprites.front_default"
        :src="pokemon.sprites.front_default"
        :alt="`Image of ${dexPokemon.pokemon_species.name}`"
      />
      <strong>#{{ dexPokemon.entry_number }}</strong>
      <audio v-if="crySrc" ref="audioEl" :src="crySrc" preload="auto"></audio>
    </div>
  </button>
</template>

<style scoped lang="scss">
button {
  border-radius: .5rem;
  border: .5rem solid var(--pokemon-color);
  background: radial-gradient(circle at 150% 150%, darken(#393939, 10%), #afafaf00);
  background-color: var(--pokemon-color);
  padding: 0;
  cursor: pointer;

  &:hover div::before {
    animation: spin 12s linear infinite;
  }
}

div {
  width: 100%;
  text-align: center;
  position: relative;
  min-width: 12rem;
  min-height: 16rem;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &::before {
    content: "";
    position: absolute;
    left: 2rem;
    top: 6rem;
    width: 12rem;
    height: 12rem;
    background-image: url(../assets/pokeball.svg);
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.2;
    transform-origin: 50% 50%;
  }

  strong {
    padding: .5rem;
    
    background: #f1f1f1;
    color: color-mix(in srgb, var(--pokemon-color) 45%, black);
    border-radius: .25rem;
    position: absolute;

    bottom: 0.5rem;
    left: 0.5rem;
  }
}

header {
  width: 100%;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f2f2f250;
  text-align: center;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    text-transform: capitalize;
    color: color-mix(in srgb, var(--pokemon-color) 45%, black);
  }
}

img {
  flex: 1;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  z-index: 1;
}
</style>
