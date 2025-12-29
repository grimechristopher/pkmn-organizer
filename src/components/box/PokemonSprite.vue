<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PokemonVariant } from '../../types/pokemon'
import { getSpritePathFromVariant } from '../../utils/spriteResolver'

const props = defineProps<{
  variant: PokemonVariant
}>()

const hasError = ref(false)

const spriteSrc = getSpritePathFromVariant(props.variant)

// Generate display name with form and gender info
const displayName = computed(() => {
  let name = props.variant.pokemon.name

  // Form-only Pokemon IDs (always show form name even if default)
  const formOnlyPokemon = [854, 855, 869, 666, 1012, 1013]
  const isFormOnly = formOnlyPokemon.includes(props.variant.pokemon.id)

  // Add form name if not default, OR if form-only Pokemon
  if (!props.variant.form.isDefault || isFormOnly) {
    name += ` (${props.variant.form.name})`
  }

  // Add gender indicator
  if (props.variant.gender === 'female') {
    name += ' (Female)'
  }

  return name
})
</script>

<template>
  <div class="pokemon-sprite-wrapper">
    <img
      v-if="!hasError"
      :src="spriteSrc"
      :alt="displayName"
      :title="displayName"
      class="pokemon-sprite"
      :class="{ unavailable: variant.isUnobtainable, shiny: variant.isShiny }"
      loading="lazy"
      @error="hasError = true"
    />
    <div v-else class="sprite-error">
      ?
    </div>
  </div>
</template>

<style scoped>
.pokemon-sprite-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pokemon-sprite {
  width: 68px;
  height: 56px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  transition: opacity 0.2s, filter 0.2s;
}

.pokemon-sprite:hover {
  opacity: 0.8;
}

.pokemon-sprite.unavailable {
  filter: grayscale(100%) opacity(0.3);
  cursor: not-allowed;
}

.sprite-error {
  width: 68px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #999;
  font-size: 24px;
  font-weight: bold;
  border-radius: 4px;
}
</style>
