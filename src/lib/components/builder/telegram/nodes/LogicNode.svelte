<script lang="ts">
  import { Handle, Position } from "@xyflow/svelte";
  import { Braces } from "@lucide/svelte";

  let {
    data,
    selected,
  }: {
    data: { label?: string; detail?: string };
    selected?: boolean;
  } = $props();
</script>

<div class="studio-node" class:selected>
  <div class="studio-node__icon studio-node__icon--violet">
    <Braces class="size-4" />
  </div>
  <div class="studio-node__body">
    <span class="studio-node__label">TRANSFORM</span>
    <strong class="studio-node__title">{data.label || "Prepare context"}</strong
    >
    <span class="studio-node__meta"
      >{data.detail || "Text, user ID, variables"}</span
    >
  </div>
  <Handle type="target" position={Position.Left} class="studio-handle" />
  <Handle type="source" position={Position.Right} class="studio-handle" />
</div>
