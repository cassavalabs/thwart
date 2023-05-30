import { cookies } from "next/headers";
import Providers from "./providers";

export const metadata = {
  title: "Thwart Protocol",
  description:
    "The one stop platform to manage all your dApp approvals and authorizations on EVMOS blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let cookie = cookies().get("chakra-ui-color-mode") || "";
  cookie = cookie as string;

  return (
    <html lang="en">
      <head />
      <body>
        <Providers cookie={cookie}>{children}</Providers>
      </body>
    </html>
  );
}
