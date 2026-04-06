import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  type BridgeCallbacks,
  ProteusBridgeProvider,
  ProteusDocumentRenderer,
} from "@optiaxiom/proteus";
import { Box } from "@optiaxiom/react";
import { action } from "storybook/actions";

const sampleHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; }
    h1 { font-size: 18px; color: #1a1a1a; }
    p { color: #666; }
    button { padding: 8px 16px; background: #0037FF; color: white; border: none; border-radius: 6px; cursor: pointer; }
    button:hover { background: #0029cc; }
  </style>
</head>
<body>
  <h1>MCP App Bridge Widget</h1>
  <p>This is an interactive UI rendered inside a sandboxed iframe via the Bridge component.</p>
  <button onclick="document.getElementById('output').textContent = 'Button clicked at ' + new Date().toLocaleTimeString()">Click me</button>
  <p id="output"></p>
</body>
</html>
`;

const chartHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; }
    .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 200px; padding: 16px 0; }
    .bar { background: #0037FF; border-radius: 4px 4px 0 0; min-width: 40px; display: flex; align-items: flex-end; justify-content: center; color: white; font-size: 12px; padding-bottom: 4px; transition: height 0.3s; }
    .label { text-align: center; font-size: 12px; color: #666; margin-top: 4px; }
    h2 { font-size: 16px; margin: 0 0 8px; }
  </style>
</head>
<body>
  <h2>Revenue by Quarter</h2>
  <div class="bar-chart">
    <div><div class="bar" style="height: 120px">$4K</div><div class="label">Q1</div></div>
    <div><div class="bar" style="height: 90px">$3K</div><div class="label">Q2</div></div>
    <div><div class="bar" style="height: 150px">$5K</div><div class="label">Q3</div></div>
    <div><div class="bar" style="height: 180px">$6K</div><div class="label">Q4</div></div>
  </div>
</body>
</html>
`;

const formHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; }
    label { display: block; margin-bottom: 4px; font-weight: 500; font-size: 14px; }
    input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 12px; box-sizing: border-box; }
    button { padding: 8px 16px; background: #0037FF; color: white; border: none; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <h3 style="margin-top:0">Feedback Form</h3>
  <label>Name</label>
  <input type="text" placeholder="Your name" />
  <label>Rating</label>
  <select>
    <option>Excellent</option>
    <option>Good</option>
    <option>Average</option>
    <option>Poor</option>
  </select>
  <label>Comments</label>
  <input type="text" placeholder="Any additional feedback" />
  <button>Submit</button>
</body>
</html>
`;

const openAiWidgetHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; }
    h2 { font-size: 16px; margin: 0 0 12px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
    .badge-openai { background: #10a37f20; color: #10a37f; }
    .badge-compat { background: #f0f0f0; color: #666; }
    p { color: #666; font-size: 14px; }
    button { padding: 8px 16px; background: #10a37f; color: white; border: none; border-radius: 6px; cursor: pointer; }
    button:hover { background: #0d8c6d; }
  </style>
</head>
<body>
  <h2>OpenAI-Compatible Widget</h2>
  <p>
    <span class="badge badge-openai">OpenAI Apps SDK</span>
    <span class="badge badge-compat">MCP Bridge</span>
  </p>
  <p>This widget uses the <code>window.openai</code> shim, which delegates to MCP App Bridge internally.</p>
  <button onclick="document.getElementById('status').textContent = 'OpenAI shim active - bridge initialized'">Test Shim</button>
  <p id="status"></p>
</body>
</html>
`;

function resolveResource(resource: string) {
  const resources: Record<string, { html: string; mimeType: string }> = {
    "ui://chart-widget": { html: chartHtml, mimeType: "text/html" },
    "ui://feedback-form": { html: formHtml, mimeType: "text/html" },
    "ui://openai-widget": {
      html: openAiWidgetHtml,
      mimeType: "text/html;profile=openai-app",
    },
    "ui://sample-widget": { html: sampleHtml, mimeType: "text/html" },
  };
  return resources[resource] ?? { html: "", mimeType: "text/html" };
}

function initMcpAppHost(
  _iframe: HTMLIFrameElement,
  _callbacks: BridgeCallbacks,
) {
  // No-op stub for storybook demo
  return () => {};
}

function initMcpAppHostWithOpenAiShim(
  _iframe: HTMLIFrameElement,
  _callbacks: BridgeCallbacks,
) {
  // No-op stub for storybook demo — in production this injects window.openai shim
  return () => {};
}

export default {
  args: {
    onInteraction: action("onInteraction"),
    onMessage: action("onMessage"),
    strict: true,
  },
  component: ProteusDocumentRenderer,
  decorators: (Story) => (
    <ProteusBridgeProvider
      initMcpAppHost={initMcpAppHost}
      initMcpAppHostWithOpenAiShim={initMcpAppHostWithOpenAiShim}
      resolveResource={resolveResource}
    >
      <Box style={{ maxWidth: 600 }}>
        <Story />
      </Box>
    </ProteusBridgeProvider>
  ),
  parameters: {
    layout: "centered",
  },
} as Meta<typeof ProteusDocumentRenderer>;

type Story = StoryObj<typeof ProteusDocumentRenderer>;

export const BasicBridge: Story = {
  args: {
    element: {
      $type: "Document",
      appName: "MCP App",
      body: [
        {
          $type: "Bridge",
          height: 200,
          resource: "ui://sample-widget",
        },
      ],
      title: "Bridge Component Demo",
    },
  },
};

export const ChartWidget: Story = {
  args: {
    element: {
      $type: "Document",
      appName: "Analytics",
      body: [
        {
          $type: "Text",
          children: "Revenue data rendered via an embedded MCP app:",
        },
        {
          $type: "Bridge",
          height: 300,
          resource: "ui://chart-widget",
        },
      ],
      title: "Revenue Dashboard",
    },
  },
};

export const FormWidget: Story = {
  args: {
    element: {
      $type: "Document",
      appName: "Opal",
      body: [
        {
          $type: "Bridge",
          height: 320,
          resource: "ui://feedback-form",
        },
      ],
      subtitle: "Embedded custom form via iframe bridge",
      title: "Feedback Collection",
    },
  },
};

export const OpenAiCompatWidget: Story = {
  args: {
    element: {
      $type: "Document",
      appName: "Imported MCP Server",
      body: [
        {
          $type: "Text",
          children:
            "This widget uses the OpenAI Apps SDK compatibility layer (window.openai shim over MCP App Bridge).",
        },
        {
          $type: "Bridge",
          height: 250,
          resource: "ui://openai-widget",
        },
      ],
      title: "OpenAI-Compatible Bridge",
    },
  },
};

export const MixedContent: Story = {
  args: {
    element: {
      $type: "Document",
      appName: "Opal",
      body: [
        {
          $type: "Text",
          children:
            "This document mixes native Proteus elements with an embedded Bridge widget.",
        },
        {
          $type: "Bridge",
          height: 200,
          resource: "ui://sample-widget",
        },
        {
          $type: "Group",
          children: [
            {
              $type: "Badge",
              children: "MCP",
              intent: "information",
            },
            {
              $type: "Badge",
              children: "Bridge",
              intent: "success",
            },
            {
              $type: "Badge",
              children: "Iframe",
            },
          ],
          gap: "8",
        },
      ],
      title: "Mixed Native + Bridge Content",
    },
  },
};
