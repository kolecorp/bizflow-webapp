<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import { Sparkles } from '@lucide/svelte';

  let { data, selected } = $props<{
    data: { label?: string; detail?: string };
    selected?: boolean;
  }>();
</script>

<div class="studio-node" class:selected>
  <div class="studio-node__icon studio-node__icon--pink">
    <Sparkles class="size-4" />
  </div>
  <div class="studio-node__body">
    <span class="studio-node__label">AI PROCESSING</span>
    <strong class="studio-node__title">{data.label || 'Smart extraction'}</strong>
    <span class="studio-node__meta">{data.detail || 'AI interprets intent'}</span>
  </div>
  <Handle type="target" position={Position.Left} class="studio-handle" />
  <Handle type="source" position={Position.Right} class="studio-handle" />
</div>
