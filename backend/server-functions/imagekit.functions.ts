import { createServerFn } from "@tanstack/react-start";
import crypto from "crypto";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!data?.some((r: any) => r.role === "admin")) throw new Error("Forbidden");
}

export const getImageKitAuth = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
    if (!privateKey || !publicKey || !urlEndpoint) throw new Error("ImageKit not configured");
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 60 * 10;
    const signature = crypto.createHmac("sha1", privateKey).update(token + expire).digest("hex");
    return { token, expire, signature, publicKey, urlEndpoint };
  });

export const deleteImageKitFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { fileId: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) throw new Error("ImageKit not configured");
    const res = await fetch(`https://api.imagekit.io/v1/files/${data.fileId}`, {
      method: "DELETE",
      headers: { Authorization: "Basic " + Buffer.from(privateKey + ":").toString("base64") },
    });
    if (!res.ok && res.status !== 404) throw new Error(`ImageKit delete failed: ${res.status}`);
    return { ok: true };
  });
