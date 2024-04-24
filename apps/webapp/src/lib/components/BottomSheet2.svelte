<script lang="ts" context="module">
  import { tv, type VariantProps } from 'tailwind-variants'

  const variants = tv({
    slots: {
      //  !overflow-visible fixes transition with large top icon
      root: 'fixed bottom-0 left-0 right-0 z-30 !overflow-visible',
      container: 'flex flex-col',
      backdrop:
        'fixed bottom-0 left-0 right-0 top-0 z-30 bg-gradient-to-t from-black/70 to-black/0',
    },
    variants: {
      variant: {
        primary: {
          root: '',
          container: 'bg-bg rounded-t-[20px]',
        },
        blur: {
          root: 'bg-chatbutton/50 rounded-t-[20px] backdrop-blur',
          container: '',
        },
        static: {
          root: 'static',
          container: 'bg-bg rounded-t-[20px]',
        },
      },
    },
  })
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, fly } from 'svelte/transition'

  export let variant: VariantProps<typeof variants>['variant'] = 'primary'
  export let backdrop = true

  let classes = ''
  export { classes as class }

  const dispatch = createEventDispatcher()

  const { root, container, backdrop: backdropClass } = variants({ variant })
</script>

{#if backdrop}
  <div class={backdropClass()} transition:fade|global on:click={() => dispatch('close')}></div>
{/if}

<div class={root()} transition:fly={{ y: '110%', opacity: 1 }}>
  <div class={container({ class: classes })}>
    <slot />
  </div>
</div>
