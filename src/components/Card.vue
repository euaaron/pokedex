<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue';
import { usePokemon } from '../lib/api/pokeapi';
import { usePokemonColor } from '../lib/hooks/usePokemonColor';
import type { DexPokemon } from '../lib/models/pokedex';

const props = defineProps<{ dexPokemon: DexPokemon }>();

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
  if (!el || !crySrc.value) return;
  try {
    el.pause();
    el.currentTime = 0;
    void el.play();
  } catch { }
}

// set/clear the global active color used by the page background
function setActive() {
  try {
    const color = (pokemonColor as any).value ?? '';
    if (color) {
      document.documentElement.style.setProperty('--active-pokemon-color', color);
    }
    document.documentElement.style.setProperty('--pokemon-active', '1');
  } catch { }
}

function clearActive() {
  try {
    // hide the page light by toggling the active flag; keep the color value (harmless)
    document.documentElement.style.setProperty('--pokemon-active', '0');
  } catch { }
}

function onFocus() {
  setActive();
  playCry();
}

function onBlur() {
  clearActive();
}

onUnmounted(() => {
  // ensure UI isn't left showing the active light when a card is removed
  try {
    document.documentElement.style.setProperty('--pokemon-active', '0');
  } catch { }
});

</script>

<template>
  <button :style="`--pokemon-color: ${pokemonColor};`" @click="playCry"
    @mouseenter="setActive" @mouseleave="clearActive" @focus="onFocus" @blur="onBlur">
    <div>
      <header>
        <h2>{{ dexPokemon.pokemon_species.name }}</h2>
      </header>
      <img v-if="pokemon && pokemon.sprites && pokemon.sprites.front_default" :src="pokemon.sprites.front_default"
        :alt="`Image of ${dexPokemon.pokemon_species.name}`" />
      <strong>#{{ dexPokemon.entry_number }}</strong>
      <audio v-if="crySrc" ref="audioEl" :src="crySrc" preload="auto"></audio>
    </div>
  </button>
</template>

<style scoped lang="scss">
@use "sass:color";
@use "../variables.scss" as *;

button {
  border-radius: .5rem;
  border: .5rem solid var(--pokemon-color);
  background: radial-gradient(circle at 150% 150%, color.adjust(#393939, $lightness: -10%), #afafaf00);
  background-color: var(--pokemon-color);
  padding: 0;
  cursor: pointer;

  transition: scale 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    scale: 105%;
    box-shadow: 0 0 15px var(--pokemon-color);

    div::before {
      animation: spin 12s linear infinite;
    }
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
  background: var(--background);

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
