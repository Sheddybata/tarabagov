"use client";

import Image from "next/image";

// Gallery images from public/images/gallery/
const galleryImages = [
  {
    id: 1,
    src: "/images/gallery/IMG-20240528-WA0314.12dc136fb5cd84f6c599.jpg",
    alt: "Taraba State Gallery Image 1",
  },
  {
    id: 2,
    src: "/images/gallery/IMG-20240528-WA0316.75dc7b87ec90e42967f4.jpg",
    alt: "Taraba State Gallery Image 2",
  },
  {
    id: 3,
    src: "/images/gallery/IMG-20240528-WA0397.74ba17bc47ae04447563.jpg",
    alt: "Taraba State Gallery Image 3",
  },
  {
    id: 4,
    src: "/images/gallery/IMG-20240528-WA0400.d1e0f5b0a0f7ca09d819.jpg",
    alt: "Taraba State Gallery Image 4",
  },
  {
    id: 5,
    src: "/images/gallery/IMG-20240530-WA0099.129677d7b8b91b16438b.jpg",
    alt: "Taraba State Gallery Image 5",
  },
  {
    id: 6,
    src: "/images/gallery/IMG-20240530-WA0294.dc78de8c00e83e44aa81.jpg",
    alt: "Taraba State Gallery Image 6",
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-16 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <div
                className="w-full h-full bg-cover bg-center transition-transform group-hover:scale-110"
                style={{ backgroundImage: `url(${image.src})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

