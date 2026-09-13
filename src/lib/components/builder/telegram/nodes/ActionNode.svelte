<script lang="ts">
  import { Handle, Position } from "@xyflow/svelte";
  import { Globe2 } from "@lucide/svelte";

  let {
    data,
    selected,
  }: {
    data: { label?: string; detail?: string };
    selected?: boolean;
  } = $props();
</script>

<div class="studio-node" class:selected>
  <div class="studio-node__icon studio-node__icon--orange">
    <Globe2 class="size-4" />
  </div>
  <div class="studio-node__body">
    <span class="studio-node__label">ACTION</span>
    <strong class="studio-node__title"
      >{data.label || "External resource"}</strong
    >
    <span class="studio-node__meta">{data.detail || "URL or destination"}</span>
  </div>
  <Handle type="target" position={Position.Left} class="studio-handle" />
  <Handle type="source" position={Position.Right} class="studio-handle" />
</div>
