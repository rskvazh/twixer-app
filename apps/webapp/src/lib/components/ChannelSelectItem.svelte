<script lang="ts">
  import Checkbox from '$lib/components/Checkbox.svelte'

  export let name = ''
  export let value: string | null

  export let channels: string[]

  $: checked = value === null ? channels.length === 0 : !!channels.find((i) => i === value)

  function onChange(ev: Event) {
    if (ev.target instanceof HTMLInputElement) {
      if (value === null) {
        channels = []
        ev.target.checked = true
      } else {
        const i = channels.findIndex((i) => i === value)

        if (ev.target.checked) {
          if (i < 0) {
            channels = [...channels, value]
          }
        } else {
          if (i >= 0) {
            channels.splice(i, 1)
            channels = channels
          }
        }
      }
    }
  }
</script>

<label class="flex items-center justify-between text-[17px] font-normal">
  <span class="select-none" class:text-accent={checked} class:font-medium={checked}>{name}</span>
  <Checkbox {checked} on:change={onChange} />
</label>
