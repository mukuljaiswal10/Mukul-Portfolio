




import { NextResponse } from "next/server";
import { searchItems } from "@/lib/quicknav/getQuickNavItems"; // ✅ search algo same rahe
import { getQuickNavItems } from "@/lib/quicknav/quickNavManifest.server"; // ✅ NEW source

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";
    const limit = Number(searchParams.get("limit") || 20);

    const all = await getQuickNavItems(); // ✅ now returns array (items)

    const { results, allTags } = searchItems(q, all, { limit }); // ✅ ensure searchItems returns allTags (neeche note)

    return NextResponse.json({
        ok: true,
        q,
        tags: allTags || [],
        results,
    });
}