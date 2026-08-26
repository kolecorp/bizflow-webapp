<script lang="ts">
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import { onDestroy, onMount } from "svelte";

  let { 
    content = "",
    onUpdate
  }: {
    content?: string;
    onUpdate?: (html: string) => void;
  } = $props();

  let element: HTMLElement;
  let editor: Editor | undefined;

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [StarterKit],
      content,
      onUpdate: ({ editor }) => {
        if (onUpdate) {
          onUpdate(editor.getHTML());
        }
      },
    });
  });

  $effect(() => {
    if (editor && content !== editor.getHTML()) {
      (editor.commands.setContent as any)(content, false, { preserveWhitespace: 'full' });
    }
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<div bind:this={element} class="tiptap-wrapper focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 rounded transition-shadow min-h-[1.5em] w-full"></div>

<style>
  :global(.tiptap-wrapper .tiptap) {
    outline: none;
    width: 100%;
    font-family: inherit;
  }
</style>
