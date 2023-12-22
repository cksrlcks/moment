"use client";
import Link from "next/link";
import { useSelectedLayoutSegment } from 'next/navigation'
import style from "./dockbar.module.css";

export default function Dockbar() {
    const segment = useSelectedLayoutSegment();
    console.log(segment)
    return (
        <nav className={style.nav}>
            <Link href="/" className={`${style.navBtn} ${segment == null ? style.active : ''}`}>
                전체
            </Link>
            <Link href="/post" className={`${style.navBtn} ${segment == 'post' ? style.active : ''}`}>
                작성
            </Link>
        </nav>
    );
}
