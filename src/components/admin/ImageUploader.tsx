import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getImageKitAuth, deleteImageKitFile } from "@/lib/imagekit.functions";

type ImgItem = { url: string; fileId?: string };

export function ImageUploader({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const [items, setItems] = useState<ImgItem[]>(() => value.map((url) => ({ url })));
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchAuth = useServerFn(getImageKitAuth);
  const delFile = useServerFn(deleteImageKitFile);

  const sync = (next: ImgItem[]) => { setItems(next); onChange(next.map((i) => i.url)); };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const auth = await fetchAuth();
      const uploaded: ImgItem[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("fileName", file.name);
        fd.append("publicKey", auth.publicKey);
        fd.append("signature", auth.signature);
        fd.append("expire", String(auth.expire));
        fd.append("token", auth.token);
        fd.append("folder", "/products");
        const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Upload failed");
        uploaded.push({ url: json.url, fileId: json.fileId });
      }
      sync([...items, ...uploaded]);
      toast.success(`Uploaded ${uploaded.length} image(s)`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async (idx: number) => {
    const it = items[idx];
    const next = items.filter((_, i) => i !== idx);
    sync(next);
    if (it.fileId) {
      try { await delFile({ data: { fileId: it.fileId } }); } catch (e: any) { toast.error(e.message); }
    }
  };

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      <div className="flex flex-wrap gap-3">
        {items.map((it, i) => (
          <div key={it.url} className="group relative size-24 overflow-hidden rounded-lg border border-border/60 bg-secondary">
            <img src={it.url} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => remove(i)} className="absolute right-1 top-1 rounded-full bg-background/90 p-1 opacity-0 transition group-hover:opacity-100" aria-label="Remove">
              <X className="size-3" />
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={busy} className="size-24 flex-col gap-1 rounded-lg border-dashed">
          {busy ? <Loader2 className="size-5 animate-spin" /> : <><Upload className="size-5" /><span className="text-xs">Upload</span></>}
        </Button>
      </div>
    </div>
  );
}
