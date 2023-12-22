"use client";

import exifr from "exifr";
import { useEffect, useState } from "react";
import getCroppedImg from "../_utill/cropImage";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";
import style from "./upload.module.css";
import { RiArtboard2Line, RiDeleteBinLine } from "react-icons/ri";
import dayjs from 'dayjs'
import "dayjs/locale/ko";

export default function Upload() {
    const [file, setFile] = useState<File | null>();
    const [imgSrc, setImgSrc] = useState<string | undefined>();
    const [loading, setLoading] = useState(true);
    const [metaData, setMetaData] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [postTitle, setPostTitle] = useState('')

    dayjs.locale("ko");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            setFile(e.target.files[0]);
        }
    };

    async function readFile() {
        const reader = new FileReader();

        reader.onload = () => {
            setImgSrc(reader.result as string);
            setLoading(false);
        };

        if (file) {
            reader.readAsDataURL(file);

            try {
                const metaData = await exifr.parse(file, true);
                console.log(metaData);
                setMetaData(metaData);
            } catch (e) {
                console.log("메타데이터 없음");
            }
        }
    }

    useEffect(() => {
        readFile();
    }, [file]);

    function onCropComplete(croppedArea: Area, croppedAreaPixels: Area) {
        setCroppedAreaPixels(croppedAreaPixels);
    }

    async function handleCrop() {
        if (!imgSrc || !croppedAreaPixels) return;

        try {
            const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels, 0);
            setCroppedImage(croppedImage);
        } catch (e) {
            console.log(e);
        }
    }

    function handleAdjust() {
        setCroppedImage(null);
    }

    function handleDelete() {
        setFile(null);
        setImgSrc(undefined);
        setLoading(true);
        setMetaData("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
        setCroppedImage(null);
        setPostTitle('')
    }

    const date = metaData["CreateDate"] ? dayjs(metaData["CreateDate"]).format('YYYY년 MM월 DD일') : '날짜정보가 없네요'
    const gps = metaData["latitude"] ? `${metaData["latitude"]}, ${metaData["longitude"]}` : '위치정보가 없네요'

    function handleInput(e:React.ChangeEvent<HTMLInputElement>){
        setPostTitle(e.target.value)
    }
    return (
        <>
            <div className={style.imgFrame}>
                <label className={style.uploadBox}>
                    <input type="file" accept="image/*" onChange={handleChange} className="a11y" />
                    {loading && (
                        <div className={style.placehold}>
                            클릭해서 사진을 찍거나,
                            <br />
                            앨범에서사진을 선택해주세요

                            <div className={style.placeholdTip}>
                                카카오톡으로 받은 이미지는 <br/>
                                꼭 '원본'형태로 받아야, 찍은날짜와 위치정보같은 <br/>
                                메타데이터를 추출하실수 잇습니다.
                            </div>
                        </div>
                    )}
                </label>

                {!loading && !croppedImage && (
                    <>
                        <div className={style.imgBox}>
                            <Cropper
                                image={imgSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={55 / 85}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div>
                            <button type="button" className={style.cropBtn} onClick={handleCrop}>
                                자르기
                            </button>
                        </div>
                    </>
                )}

                {croppedImage && (
                    <>
                        <div className={style.final}>
                            <div className={style.momentCard}>
                                <img src={croppedImage} />
                            </div>
                            <div className={style.setting}>
                                <button type="button" className={style.settingBtn} onClick={handleAdjust}>
                                    <RiArtboard2Line />
                                </button>
                                <button type="button" className={style.settingBtn} onClick={handleDelete}>
                                    <RiDeleteBinLine />
                                </button>
                            </div>
                        </div>
                        {
                            <>
                            <div className={style.infoSection}>
                                <div className={style.infoTitle}>남기고싶은말</div>
                                <div className={style.infoInput}>
                                    <input type="text" value={postTitle} placeholder="남기고싶은말을 적어주세요" onChange={handleInput} />
                                </div>
                                <button type="submit" className={style.submitBtn}>카드저장</button>
                            </div>
                            <div className={style.infoSection}>
                                <div className={style.infoTitle}>사진 정보</div>
                                <div className={style.infoData}>찍은날짜 :{date}</div>
                                <div className={style.infoData}>위치정보 : {gps}</div>
                                <div className={style.infoBox}>
                                    <div className={style.infoBoxTitle}>추출된 메타데이터</div>
                                    <div className={style.infoBoxDesc}>{metaData ? JSON.stringify(metaData) : "사진정보를 불러올수 없어요. 직접 입력해주세요"}</div>
                                </div>
                            </div>
                            </>
                        }
                    </>
                )}
            </div>
        </>
    );
}
