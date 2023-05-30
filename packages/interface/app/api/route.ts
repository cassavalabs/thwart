import { NextResponse } from "next/server";

const BACKEND_API = String(process.env.BACKEND_API);

const typeMap = ["", "authz", "gauthz", "erc20", "nft"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = parseInt(searchParams.get("type")!);
  const account = searchParams.get("search");

  const res = await fetch(`${BACKEND_API}/${typeMap[type]}/${account}`, {
    headers: {
      "Content-Type": "application/json",
      //   "API-Key": String(process.env.BACKEND_API_KEY),
    },
  });

  const data = await res.json();

  return NextResponse.json({ data });
}
