<template>
  <!-- Install Command Section for Hero Image Slot -->
  <div class="install-hero-section w-full text-center">
    <div class="install-command">
      <code class="text-white"> curl -fsSL <span class="text-blue-500">https://get.base.al</span> | bash</code>
      <button 
        @click="copyCommand" 
        class="copy-button"
        :class="{ 'copied': copied }"
        :title="copied ? 'Copied!' : 'Copy to clipboard'"
      >
        <span v-if="!copied">📋</span>
        <span v-else>✅</span>
      </button>
    </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  installCommand?: string
}

const props = withDefaults(defineProps<Props>(), {
  installCommand: 'curl -fsSL https://get.base.al | bash'
})

const copied = ref(false)

const copyCommand = async () => {
  try {
    await navigator.clipboard.writeText(props.installCommand)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy command:', err)
  }
}
</script>

<style scoped>
.install-hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.install-command {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-family: var(--vp-font-family-mono);
  font-size: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.install-command:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.install-command code {
  flex: 1;
  color: var(--vp-c-text-1);
  background: none;
  padding: 0;
  font-size: inherit;
  font-weight: 500;
}

.copy-button {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  font-weight: 500;
}

.copy-button:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.copy-button.copied {
  background: #10b981;
}

.install-description {
  margin-top: 1rem;
  color: var(--vp-c-text-1);
  font-size: 14px;
  text-align: center;
  font-style: italic;
}

@media (max-width: 640px) {
  .install-hero-section {
    padding: 1rem;
  }
  
  .install-command {
    font-size: 14px;
    padding: 0.75rem 1rem;
  }
  
  .copy-button {
    padding: 0.4rem 0.8rem;
    font-size: 14px;
  }
}
.text-blue-500 {
  color: #22c55e;
}
</style>
