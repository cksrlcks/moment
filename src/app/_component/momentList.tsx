"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import Moment from "./moment";
import "swiper/css";
import style from './momentList.module.css'

export default function MomentList() {
    return (
        <Swiper 
            spaceBetween={8} 
            slidesPerView={1} 
            centeredSlides={true}
            className={style.momentSlide}
            
        >
            <SwiperSlide>
                <Moment />
            </SwiperSlide>
            <SwiperSlide>
                <Moment />
            </SwiperSlide>
            <SwiperSlide>
                <Moment />
            </SwiperSlide>
            <SwiperSlide>
                <Moment />
            </SwiperSlide>
            <SwiperSlide>
                <Moment />
            </SwiperSlide>
            <SwiperSlide>
                <Moment />
            </SwiperSlide>
        </Swiper>
    );
}
