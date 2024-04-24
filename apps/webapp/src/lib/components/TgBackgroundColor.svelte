<script lang="ts">
  import { browser } from '$app/environment'
  import { appState } from '$lib/app-service'
  import { onMount } from 'svelte'

  let prevColor = ''
  onMount(() => {
    prevColor = Telegram.WebApp.backgroundColor
  })

  $: if (browser) {
    if ($appState === 'home' || $appState === 'account') {
      Telegram.WebApp.setHeaderColor(Telegram.WebApp.themeParams.button_color ?? '#ffffff')
    } else {
      Telegram.WebApp.setHeaderColor(prevColor)
    }
  }
</script>
