<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import { GitBranch } from '@lucide/svelte';

  let { data, selected } = $props<{
    data: { 
      label: string;
      description?: string;
    };
    selected?: boolean;
  }>();
</script>

<div class="studio-node" class:selected>
  <Handle type="target" position={Position.Left} class="studio-handle" />

  <div class="node-header">
    <div class="node-icon-box">
      <GitBranch class="size-4" style="color:var(--primary-foreground)" />
    </div>
  </div>
  
  <div class="node-body">
    <h3 class="node-title">{data.label}</h3>
    {#if data.description}
      <p class="node-desc">{data.description}</p>
    {/if}
  </div>

  <div class="node-branches">
    <div class="branch-item branch-true">
      <span>true</span>
      <Handle type="source" position={Position.Right} id="true" class="branch-handle" style="top:50%; transform:translateY(-50%); right:-5px;" />
    </div>
    <div class="branch-item branch-false">
      <span>false</span>
      <Handle type="source" position={Position.Right} id="false" class="branch-handle branch-handle-false" style="top:50%; transform:translateY(-50%); right:-5px;" />
    </div>
  </div>
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
    transition: border-color 0.2s, box-shadow 0.2s;
    cursor: grab;
    position: relative;
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
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .node-icon-box {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #9333ea;
    display: flex;
    align-items: center;
    justify-content: center;
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

  .node-branches {
    display: flex;
    gap: 6px;
    margin-top: 4px;
  }

  .branch-item {
    position: relative;
    flex: 1;
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
  }

  .branch-true {
    background: color-mix(in srgb, var(--primary) 15%, transparent);
    color: var(--primary);
    border: 1px solid color-mix(in srgb, var(--primary) 40%, transparent);
  }

  .branch-false {
    background: color-mix(in srgb, var(--muted-foreground) 10%, transparent);
    color: var(--muted-foreground);
    border: 1px solid var(--border);
  }

  :global(.studio-handle) {
    width: 10px;
    height: 10px;
    background: var(--card);
    border: 2px solid var(--primary);
    border-radius: 50%;
  }

  :global(.branch-handle) {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--card);
    border: 2px solid var(--primary);
    border-radius: 50%;
  }

  :global(.branch-handle-false) {
    border-color: var(--muted-foreground);
  }
</style>
