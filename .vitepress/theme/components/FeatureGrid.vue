<template>
  <div class="feature-section">
    <h2 v-if="title" class="feature-section-title">{{ title }}</h2>
    <p v-if="description" class="feature-section-description">{{ description }}</p>
    <div class="vp-feature-grid">
      <div 
        v-for="feature in features" 
        :key="feature.title"
        class="vp-feature"
      >
        <div class="vp-feature-icon">{{ feature.icon }}</div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.details }}</p>
        <a 
          v-if="feature.link" 
          :href="feature.link" 
          class="vp-feature-link"
        >
          {{ feature.linkText || 'Learn More' }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  icon: string
  title: string
  details: string
  link?: string
  linkText?: string
}

interface Props {
  title?: string
  description?: string
  features: Feature[]
}

defineProps<Props>()
</script>

<style scoped>
.feature-section {
  margin: 3rem 0;
}

.feature-section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.feature-section-description {
  font-size: 1.125rem;
  text-align: center;
  color: var(--vp-c-text-2);
  max-width: 800px;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
}
</style>
