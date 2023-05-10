"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useForm } from "react-hook-form";
import axios from "axios";

mapboxgl.accessToken =
  "pk.eyJ1IjoibXlzdGljbGVnZW5kMiIsImEiOiJjbGhoemhka3QwMnhoM2ZwaDF5Nzh5dWRyIn0.CuRqLEJsqPxfIIMu_LGWhw";

export default function Home() {
  const mapContainerRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(1.5);

  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState(0);
  const [isDone, setDone] = useState(false);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current || "",
      style: "mapbox://styles/mysticlegend2/clhi8mdol01gz01qya9hx42i6",
      center: [lng, lat],
      zoom: zoom,
    });

    map.on("move", () => {
      setLng(Number(map.getCenter().lng.toFixed(4)));
      setLat(Number(map.getCenter().lat.toFixed(4)));
      setZoom(Number(map.getZoom().toFixed(2)));
    });
    return () => map.remove();
  }, []);

  async function onSubmit(data: any) {
    setLoading(true);

    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    const res = await axios.post(
      `http://localhost:3000/`,
      {
        latitude: lat,
        longitude: lng,
      },
      axiosConfig
    );

    setResult(res.data);

    setLoading(false);
    setDone(true);
  }

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-between">
      <div className="z-10 w-2 h-2 rounded-full bg-red-500 absolute top-1/2 left-1/2"></div>
      <header className=" z-10 bg-white fixed top-10 w-1/2 rounded-lg flex p-3 justify-center items-center">
        {!isLoading && !isDone && (
          <form className="flex gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full">
              <input
                placeholder="Longitude..."
                {...register("longitude", { required: true })}
                value={lng}
              ></input>
              <label className="text-xs">Longitude</label>
            </div>
            <div className="w-full">
              <input
                placeholder="Latitude..."
                {...register("latitude", { required: true })}
                value={lat}
              ></input>
              <label className="text-xs">Latitude</label>
            </div>
            <button
              type="submit"
              className="flex justify-center items-center w-36 bg-[rgb(185,56,120)] hover:bg-[rgb(78,35,56)] rounded-lg hover:fill-cyan-500 transition-all fill-white"
            >
              <svg
                className=" p-2 w-10"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
              </svg>
            </button>
          </form>
        )}{" "}
        {isLoading && <img src="./Ghost.gif"></img>}
        {isDone && `${result} W/m²`}
      </header>
      <div className="w-full h-full" ref={mapContainerRef} />
    </div>
  );
}
