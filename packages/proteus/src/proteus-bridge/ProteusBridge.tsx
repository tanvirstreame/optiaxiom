import { type ReactNode, useEffect, useRef, useState } from "react";

import { useProteusDocumentContext } from "../proteus-document/ProteusDocumentContext";
import {
  type BridgeCallbacks,
  useProteusBridgeContext,
} from "./ProteusBridgeContext";

export type ProteusBridgeProps = {
  fallback?: ReactNode;
  height?: number;
  resource: string;
};

export function ProteusBridge({ height = 400, resource }: ProteusBridgeProps) {
  const { data } = useProteusDocumentContext(
    "@optiaxiom/proteus/ProteusBridge",
  );
  const {
    initMcpAppHost,
    initMcpAppHostWithOpenAiShim,
    onInteraction,
    onMessage,
    resolveResource,
  } = useProteusBridgeContext("@optiaxiom/proteus/ProteusBridge");

  const { html, mimeType } = resolveResource(resource);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [widgetState, setWidgetState] = useState<Record<string, unknown>>({});
  const widgetStateRef = useRef(widgetState);
  widgetStateRef.current = widgetState;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const callbacks: BridgeCallbacks = {
      data,
      onInteraction,
      onMessage,
      setWidgetState,
      widgetStateRef,
    };

    // MCP App Bridge is always the underlying transport.
    // For OpenAI-compat widgets, we additionally inject the window.openai shim.
    if (
      mimeType === "text/html;profile=openai-app" &&
      initMcpAppHostWithOpenAiShim
    ) {
      return initMcpAppHostWithOpenAiShim(iframe, callbacks) ?? undefined;
    } else {
      return initMcpAppHost(iframe, callbacks) ?? undefined;
    }
  }, [
    data,
    html,
    initMcpAppHost,
    initMcpAppHostWithOpenAiShim,
    mimeType,
    onInteraction,
    onMessage,
  ]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
      srcDoc={html}
      style={{ border: "none", height, width: "100%" }}
      title={resource}
    />
  );
}

ProteusBridge.displayName = "@optiaxiom/proteus/ProteusBridge";
