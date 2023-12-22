import type { Metadata } from "next";
import "./globals.css";
import Dockbar from "./_component/dockbar";

export const metadata: Metadata = {
    title: "At the Moment",
    description: "지금 순간의 느낌을 카드로 남기기",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body>
                <div id="app">
                    <div className="app-inner">{children}</div>
                    <Dockbar />
                </div>
            </body>
        </html>
    );
}
