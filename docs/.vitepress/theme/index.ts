import type { Theme } from 'vitepress'
import { h } from 'vue'
// 문서 글꼴은 KRDS(Pretendard GOV)라 VitePress 기본 글꼴(Inter)은 받지 않는다
import DefaultTheme from 'vitepress/theme-without-fonts'
import '@krds.ui/react/style'
import ComponentApi from './ComponentApi.vue'
import ComponentList from './ComponentList.vue'
import DemoFrame from './DemoFrame.vue'
import DocTabs from './DocTabs.vue'
import FrameworkSwitch from './FrameworkSwitch.vue'
import NotFound from './NotFound.vue'
import ReactDemo from './ReactDemo.vue'
import './fonts.css'
import './style.css'

export default {
  extends: DefaultTheme,
  // KRDS Vue ↔ React 전환(상단 메뉴가 햄버거로 접히는 모바일에서도 보이게), 없는 페이지 안내
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-content-before': () => h(FrameworkSwitch, { current: 'react', mobile: true }),
      'not-found': () => h(NotFound)
    }),
  enhanceApp({ app }) {
    app.component('ComponentApi', ComponentApi)
    app.component('ComponentList', ComponentList)
    app.component('DemoFrame', DemoFrame)
    app.component('DocTabs', DocTabs)
    app.component('FrameworkSwitch', FrameworkSwitch)
    app.component('ReactDemo', ReactDemo)
  }
} satisfies Theme
