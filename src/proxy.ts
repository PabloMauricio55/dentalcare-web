import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Preparado para incorporar autenticación real en una fase posterior.
  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/panel/:path*", "/agenda/:path*", "/expediente/:path*", "/tratamientos/:path*", "/caja/:path*", "/inventario/:path*", "/esterilizacion/:path*", "/reportes/:path*", "/configuracion/:path*"],
};
