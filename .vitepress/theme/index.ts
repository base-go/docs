// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import FeatureGrid from './components/FeatureGrid.vue'
import CustomHero from './components/CustomHero.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(CustomHero),
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('FeatureGrid', FeatureGrid)
    app.component('CustomHero', CustomHero)
  }
} satisfies Theme
