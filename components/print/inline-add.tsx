"use client"

import * as React from "react"

/**
 * Inline "＋ New" for a voucher-form master dropdown. Kept in
 * components/print only because the Phase B file boundary allows new
 * files there; it is a form helper, not a print document. It calls the
 * same existing create action as Masters, then hands the new record's
 * id back so the caller can refresh that dropdown's list and select
 * it — the half-filled voucher form is never abandoned.
 */
export interface InlineAddField {
  key: string
  label: string
  required?: boolean
  options?: { value: string; label: string }[]
}

export function InlineAdd({
  label,
  fields,
  createAction,
  onCreated,
}: {
  label: string
  fields: InlineAddField[]
  createAction: (values: Record<string, string>) => Promise<{ success: boolean; data?: unknown; error?: string }>
  onCreated: (id: string) => void | Promise<void>
}) {
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = React.useState<Record<string, string>>({})
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState("")

  async function handleSave(e?: React.SyntheticEvent) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    for (const f of fields) {
      if (f.required && !(values[f.key] ?? f.options?.[0]?.value ?? "").trim()) {
        setError(`${f.label} is required.`)
        return
      }
    }
    setPending(true)
    setError("")
    try {
      const payload = { ...values }
      for (const f of fields) {
        if (!payload[f.key] && f.options?.[0]?.value) {
          payload[f.key] = f.options[0].value
        }
      }
      const res = await createAction(payload)
      if (!res?.success) { setError(res?.error || "Could not create. Check the code is unique and all required fields are filled."); return }
      const id = (res.data as { id?: string } | null)?.id
      if (id) await onCreated(id)
      setValues({})
      setOpen(false)
    } finally { setPending(false) }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="px-2 py-1.5 rounded-md bg-muted hover:bg-muted/70 text-[11px] font-semibold cursor-pointer whitespace-nowrap" title={`Add a new ${label}`}>
        ＋ New
      </button>
    )
  }
  return (
    <div className="mt-2 p-3 rounded-lg border border-border bg-muted/40 space-y-2 text-xs basis-full">
      <p className="font-bold">New {label}</p>
      {error && <p className="text-red-600">{error}</p>}
      <div className="space-y-2" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); void handleSave(e); } }}>
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block font-medium mb-1">{f.label}{f.required ? " *" : ""}</label>
            {f.options ? (
              <select value={values[f.key] ?? f.options[0]?.value ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} className="w-full px-2 py-1.5 rounded-md bg-background border border-border" required={f.required}>
                {f.options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            ) : (
              <input value={values[f.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} className="w-full px-2 py-1.5 rounded-md bg-background border border-border" required={f.required} />
            )}
          </div>
        ))}
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={() => { setOpen(false); setError("") }} className="px-3 py-1.5 rounded-md bg-card border border-border font-semibold cursor-pointer">Cancel</button>
          <button type="button" onClick={handleSave} disabled={pending} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white font-bold cursor-pointer disabled:opacity-60">{pending ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  )
}

/** Shared field sets for the master kinds used by voucher forms. */
export const PARTY_FIELDS: InlineAddField[] = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
  { key: "type", label: "Type", options: [{ value: "customer", label: "Customer" }, { value: "supplier", label: "Supplier" }, { value: "both", label: "Both" }, { value: "source", label: "Source" }] },
]
export const PRODUCT_FIELDS: InlineAddField[] = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
  { key: "category", label: "Category", options: [{ value: "raw_seed", label: "Raw Seed" }, { value: "finished_seed", label: "Finished Seed" }, { value: "intermediate", label: "Intermediate / Grading" }, { value: "by_product", label: "By-Product" }] },
]
export const GODOWN_FIELDS: InlineAddField[] = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
]
export const MACHINE_FIELDS: InlineAddField[] = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
  { key: "processing_type", label: "Processing type", required: true },
]
export const PACKAGING_FIELDS: InlineAddField[] = [
  { key: "code", label: "Code", required: true },
  { key: "name", label: "Name", required: true },
]
