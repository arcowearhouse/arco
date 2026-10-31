import { Skel } from '@/components/erp-ui'

/* Mirrors the flattened single-column chat layout (chat-client.tsx):
   full-bleed, no card wrapper — the conversation list lives in the
   global sidebar. Just a centered message column, a centered
   composer shape, and a disclaimer line. Assistant shapes are plain
   full-width lines (no avatar, no bubble); the user shape is a
   right-aligned bubble. Flat animate-pulse blocks only — no
   gradients, no fake progress. */
export default function ChatLoading() {
  return (
    <div
      className="-m-4 md:-m-6 lg:-m-8 flex h-[calc(100dvh-4rem)] flex-col bg-background animate-pulse"
      aria-label="Loading chat"
      aria-busy="true"
    >
      {/* Centered message column */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <div className="space-y-2">
            <Skel className="h-3 w-full bg-muted rounded" />
            <Skel className="h-3 w-11/12 bg-muted rounded" />
            <Skel className="h-3 w-3/4 bg-muted rounded" />
          </div>
          <div className="flex justify-end">
            <Skel className="h-12 w-2/3 sm:w-1/2 bg-muted rounded-md" />
          </div>
          <div className="space-y-2">
            <Skel className="h-3 w-full bg-muted rounded" />
            <Skel className="h-3 w-2/3 bg-muted rounded" />
          </div>
        </div>
      </div>

      {/* Centered composer shape + disclaimer line */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="mx-auto w-full max-w-3xl">
          <Skel className="h-10 w-full bg-muted rounded-md" />
          <div className="flex justify-center mt-1.5">
            <Skel className="h-2.5 w-80 max-w-full bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
