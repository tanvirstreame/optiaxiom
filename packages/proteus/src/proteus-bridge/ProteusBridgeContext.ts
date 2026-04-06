"use client";

import { createContext } from "@radix-ui/react-context";

export type BridgeCallbacks = {
  data: Record<string, unknown>;
  onInteraction?: (event: {
    data: Record<string, unknown>;
    toolName: string;
    type: string;
  }) => Promise<unknown>;
  onMessage?: (event: { prompt: string; type: string }) => Promise<void>;
  setWidgetState: React.Dispatch<
    React.SetStateAction<Record<string, unknown>>
  >;
  widgetStateRef: React.RefObject<Record<string, unknown>>;
};

export type ProteusBridgeContextValue = {
  initMcpAppHost: (
    iframe: HTMLIFrameElement,
    callbacks: BridgeCallbacks,
  ) => (() => void) | void;
  initMcpAppHostWithOpenAiShim?: (
    iframe: HTMLIFrameElement,
    callbacks: BridgeCallbacks,
  ) => (() => void) | void;
  onInteraction?: BridgeCallbacks["onInteraction"];
  onMessage?: BridgeCallbacks["onMessage"];
  resolveResource: (resource: string) => { html: string; mimeType: string };
};

export const [ProteusBridgeProvider, useProteusBridgeContext] =
  createContext<ProteusBridgeContextValue>(
    "@optiaxiom/proteus/ProteusBridge",
  );
