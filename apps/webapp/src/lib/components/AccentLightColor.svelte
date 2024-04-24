<script lang="ts">
  import { getAccentShades } from '$lib/colors'
  import { onMount } from 'svelte'

  onMount(() => {
    const tgButtonColor = Telegram.WebApp.themeParams.button_color ?? '#ffffff'

    const colors = getAccentShades(tgButtonColor)

    document.documentElement.style.setProperty('--color-accent-light', colors.light)

    document.documentElement.style.setProperty('--color-accent-dark', colors.dark)
  })
</script>
