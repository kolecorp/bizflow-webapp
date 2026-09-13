<script lang="ts">
  import { Handle, Position } from "@xyflow/svelte";
  import { Send, Database } from "@lucide/svelte";

  let { data, selected } = $props<{
    data: {
      label: string;
      description?: string;
      iconType?: string;
      outputs?: number;
    };
    selected?: boolean;
  }>();

  // Determine accent color class from iconType
  let isSet = $derived(data.iconType === "set" || data.iconType === "database");
</script>

<div class="studio-node" class:selected>
  <Handle
    type="target"
    position={Position.Left}
    class="studio-handle studio-handle-in"
  />

  <div class="node-header">
    <div class="node-icon-box" class:icon-pink={isSet} class:icon-blue={!isSet}>
      {#if isSet}
        <Database class="size-4" style="color:var(--primary-foreground)" />
      {:else}
        <Send class="size-4" style="color:var(--primary-foreground)" />
      {/if}
    </div>
    <div class="node-status-dot"></div>
  </div>

  <div class="node-body">
    <h3 class="node-title">{data.label}</h3>
    {#if data.description}
      <p class="node-desc">{data.description}</p>
    {/if}
  </div>

  <div class="node-footer">
    <div class="output-pill">
      <span class="check-icon">✓</span>
      {data.outputs || 1} output
    </div>
  </div>

  <Handle
    type="source"
    position={Position.Right}
    class="studio-handle studio-handle-out"
  />
</div>

<style>
  .studio-node {
    display: flex;
    flex-direction: column;
    width: 220px;
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 4px 12px color-mix(in srgb, var(--foreground) 8%, transparent);
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
    cursor: grab;
  }

  .studio-node.selected,
  .studio-node:hover {
    border-color: var(--primary);
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--primary) 15%, transparent),
      0 8px 24px color-mix(in srgb, var(--foreground) 12%, transparent);
  }

  .node-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .node-icon-box {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-blue {
    background: #3b82f6;
  }
  .icon-pink {
    background: #ec4899;
  }

  .node-status-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--primary);
    border: 3px solid var(--card);
  }

  .node-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--foreground);
    margin: 0 0 3px;
  }

  .node-desc {
    font-size: 11px;
    color: var(--muted-foreground);
    margin: 0 0 10px;
    line-height: 1.4;
  }

  .node-footer {
    display: flex;
    align-items: center;
  }

  .output-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--muted) 60%, transparent);
    border: 1px solid var(--border);
    font-size: 10px;
    font-weight: 500;
    color: var(--foreground);
  }
  .check-icon {
    color: var(--primary);
  }

  :global(.studio-handle) {
    width: 10px;
    height: 10px;
    background: var(--card);
    border: 2px solid var(--primary);
    border-radius: 50%;
  }
</style>
