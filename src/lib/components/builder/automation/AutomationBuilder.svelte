<script lang="ts">
  import {
    SvelteFlow,
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
  } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";

  import TriggerNode from "./nodes/TriggerNode.svelte";
  import ActionNode from "./nodes/ActionNode.svelte";
  import ConditionNode from "./nodes/ConditionNode.svelte";
  import BotProTip from "./BotProTip.svelte";

  let {
    nodes = $bindable([]),
    edges = $bindable([]),
    onNodeClick,
    showMiniMap = true,
  } = $props<{
    nodes: any[];
    edges: any[];
    onNodeClick?: (node: any) => void;
    showMiniMap?: boolean;
  }>();

  const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
    condition: ConditionNode,
  };

  const defaultEdgeOptions = {
    type: "smoothstep",
    animated: true,
    style: "stroke: var(--primary); stroke-width: 2; stroke-opacity: 0.7;",
  };

  const proOptions = { hideAttribution: true };
</script>

<div class="vb-root">
  <SvelteFlow
    minZoom={0.35}
    maxZoom={1.8}
    bind:nodes
    bind:edges
    {nodeTypes}
    {defaultEdgeOptions}
    {proOptions}
    fitView
    fitViewOptions={{ padding: 0.2, maxZoom: 0.85 }}
    onnodeclick={(e) => onNodeClick?.(e.detail.node)}
  >
    <Background
      variant={BackgroundVariant.Dots}
      gap={24}
      size={1.5}
      color="color-mix(in srgb, var(--muted-foreground) 30%, transparent)"
    />
    <Controls position="top-left" showInteractive={false} />
    {#if showMiniMap}
      <MiniMap
        position="bottom-right"
        maskColor="color-mix(in srgb, var(--background) 70%, transparent)"
        nodeColor="var(--primary)"
      />
    {/if}
  </SvelteFlow>

  <!-- Positioned outside SvelteFlow to avoid transform interference -->
  <BotProTip />
</div>

<style>
  .vb-root {
    width: 100%;
    height: 100%;
    background: transparent;
    position: relative;
  }

  /* ─── Override SvelteFlow styles to respect our design tokens ─── */
  :global(.svelte-flow) {
    background: transparent;
  }
  :global(.svelte-flow .svelte-flow__background) {
    background: transparent;
  }

  /* Edges */
  :global(.svelte-flow__edge-path) {
    stroke: color-mix(in srgb, var(--muted-foreground) 50%, transparent);
    stroke-width: 2;
  }
  :global(.svelte-flow__edge.selected .svelte-flow__edge-path),
  :global(.svelte-flow__edge:hover .svelte-flow__edge-path) {
    stroke: var(--primary);
    stroke-opacity: 1;
    stroke-width: 2.5;
  }

  /* Controls - horizontal strip matching design */
  :global(.svelte-flow__controls) {
    top: 20px !important;
    left: 20px !important;
    display: flex !important;
    flex-direction: row !important;
    gap: 0 !important;
    border: 1px solid var(--border) !important;
    border-radius: 8px !important;
    overflow: hidden !important;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--foreground) 8%, transparent) !important;
    background: transparent !important;
  }
  :global(.svelte-flow__controls button) {
    background: var(--card) !important;
    border: none !important;
    border-right: 1px solid var(--border) !important;
    color: var(--foreground) !important;
    width: 32px !important;
    height: 32px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: background 0.15s !important;
  }
  :global(.svelte-flow__controls button:hover) {
    background: var(--muted) !important;
  }
  :global(.svelte-flow__controls button:last-child) {
    border-right: none !important;
  }

  /* Minimap */
  :global(.svelte-flow__minimap) {
    border: 1px solid var(--border) !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    background: var(--card) !important;
    margin: 16px !important;
  }

  /* Handles */
  :global(.svelte-flow__handle) {
    width: 10px !important;
    height: 10px !important;
    background: var(--card) !important;
    border: 2px solid var(--primary) !important;
    border-radius: 50% !important;
  }
  :global(.svelte-flow__handle:hover) {
    background: var(--primary) !important;
    transform: scale(1.3) !important;
  }
</style>
