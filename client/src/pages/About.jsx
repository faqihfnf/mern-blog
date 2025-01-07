import React from "react";
import GradientColor from "../components/GradientColor";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <GradientColor />
      <h1 className="bg-gradient-to-l from-sky-600 via-purple-600 to-pink-600 bg-clip-text py-10 text-5xl font-extrabold text-transparent items-center justify-center flex">Tentang Kami</h1>
      <img src="logo.png" alt="logo" className="w-36 h-36 mb-10" />
      <div className="text-xl px-8 md:px-24 lg:px-48  dark:text-white ">
        <p>
          Marifah.id adalah sebuah blog yang menyajikan artikel Islami yang bersumber dari Al-Quran dan As-Sunnah dengan pemahaman salafus shalih. Kami berkomitmen untuk menyajikan konten Islami yang berkualitas dan bermanfaat bagi para
          pembaca.
        </p>
        <p className="mt-3">
          Diantara misi kami adalah memurnikan aqidah dengan menyajikan artikel-artikel yang menguatkan keimanan. Memperbaiki akhlaq dengan menghadirkan contoh kebaikan dari para salafus shalih. Kami berharap dapat menjembatani para pembaca
          dalam memahami Al-Quran dan As-Sunnah dengan pemahaman salafus shalih.
        </p>
        <p className="mt-3">
          Kami berpegang pada prinsip bahwa Islam adalah agama yang sempurna, lengkap, dan mencakup segala aspek kehidupan. Melalui tulisan kami, kami berusaha untuk menjadi bagian dari dakwah Islam, menyeru kepada kebaikan dan mencegah
          dari kemungkaran.
        </p>
        <p className="mt-3 mb-10">
          Jika Anda memiliki saran, pertanyaan, atau kritik, jangan ragu untuk menghubungi kami melalui halaman kontak. Semoga blog ini menjadi sarana kebaikan dan keberkahan bagi kita semua. <br /> <br /> Barakallahu fiikum, <br /> Tim
          marifah.id
        </p>
      </div>
    </div>
  );
}
