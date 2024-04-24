<script lang="ts" context="module">
  import { tv, type VariantProps } from 'tailwind-variants'

  const buttonVariants = tv({
    base: 'disabled:bg-grey flex items-center justify-center gap-3 rounded-[20px] px-4 py-0 text-[17px] font-medium',
    variants: {
      variant: {
        white: 'text-accent-dark bg-white active:brightness-90',
        accent: 'bg-accent active:bg-accent-light text-white',
        secondary: 'bg-bg-secondary text-default active:brightness-90',
      },
    },
  })
</script>

<script lang="ts">
  export let height = 52
  export let variant: VariantProps<typeof buttonVariants>['variant'] = 'accent'
  export let disabled = false
  let classes = ''
  export { classes as class }

  $: buttonClass = buttonVariants({ variant: variant, class: classes })
</script>

<button class={buttonClass} style:height={`${height}px`} on:click {disabled}>
  <slot name="icon" />
  <slot />
</button>
