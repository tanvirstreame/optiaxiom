---
"@optiaxiom/proteus": minor
---

added a `requestModal` client-side action variant that cards can fire from any `onClick`. It carries a `resource` (a bare `ui://...` URI of a same-provider named resource) plus an opaque `params` render-context object. `ProteusDocumentShell` / `ProteusDocumentRenderer` accept a matching `onRequestModal({ resource, params })` prop and dispatch the event to it, so hosts can open a canvas-style modal that renders the named UI resource — e.g. a detail view for the current card. Runtime and public schemas updated accordingly.
