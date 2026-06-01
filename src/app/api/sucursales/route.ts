import { NextRequest, NextResponse } from "next/server";
import { getSession, isSuperAdmin } from "@/lib/auth/helpers";
import { getAllDbs } from "@/lib/db";
import { handleApiError } from "@/lib/crud/helpers";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const results = await Promise.all(
      getAllDbs().map(({ db }) =>
        db.selectFrom("sucursal").selectAll().execute(),
      ),
    );

    return NextResponse.json({ data: results.flatMap((r) => r) });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (!isSuperAdmin(session))
      return NextResponse.json({ error: "Solo superadmin" }, { status: 403 });

    const body = await request.json();
    const db = getAllDbs().find((d) => d.pais === body.pais)?.db;
    if (!db)
      return NextResponse.json({ error: "Pas invlido" }, { status: 400 });

    await db.insertInto("sucursal").values(body).executeTakeFirst();
    return NextResponse.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (!isSuperAdmin(session))
      return NextResponse.json({ error: "Solo superadmin" }, { status: 403 });

    const body = await request.json();
    const db = getAllDbs().find((d) => d.pais === body.pais)?.db;
    if (!db)
      return NextResponse.json({ error: "Pas invlido" }, { status: 400 });

    await db
      .updateTable("sucursal")
      .set(body)
      .where("id_sucursal", "=", body.id_sucursal)
      .execute();
    return NextResponse.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (!isSuperAdmin(session))
      return NextResponse.json({ error: "Solo superadmin" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0");
    const pais = searchParams.get("pais");

    const db = getAllDbs().find((d) => d.pais === pais)?.db;
    if (!db)
      return NextResponse.json({ error: "Pas invlido" }, { status: 400 });

    await db
      .deleteFrom("sucursal")
      .where("id_sucursal", "=", id)
      .executeTakeFirst();
    return NextResponse.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
p;
