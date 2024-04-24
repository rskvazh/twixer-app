<script lang="ts">
  import { browser } from '$app/environment'
  import { appService, appState } from '$lib/app-service'
  import { onMount } from 'svelte'

  function back() {
    console.log('back clicked')
    appService.stop()
  }

  onMount(() => {
    Telegram.WebApp.BackButton.onClick(back)
    return () => {
      Telegram.WebApp.BackButton.offClick(back)
    }
  })

  $: {
    if (browser) {
      if ($appState === 'match' || $appState === 'account') {
        Telegram.WebApp.BackButton.show()
      } else {
        Telegram.WebApp.BackButton.hide()
      }
    }
  }
</script>
