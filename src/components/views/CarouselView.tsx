import { useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import type { InstagramPost } from '../../types/instagram';
import { UI_MESSAGES } from '../../constants/messages';
import { MediaContent } from '../ui/MediaContent';
import ImageDropZone from '../ui/ImageDropZone';

import '../../styles/CarouselGallery.css';
import '../../styles/GridView.css';
import 'swiper/swiper-bundle.css';

interface CarouselViewProps {
  posts: InstagramPost[];
}

// Responsive breakpoints for thumbnails
const THUMB_BREAKPOINTS = {
  640: { slidesPerView: 5 },
  768: { slidesPerView: 6 },
  1024: { slidesPerView: 8 },
};

export default function CarouselView({ posts }: CarouselViewProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  if (posts.length === 0) {
    return <div className="status-message status-message--empty">{UI_MESSAGES.noPosts}</div>;
  }

  return (
    <>
    <div className="carousel">
      {/* Main Swiper */}
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        spaceBetween={10}
        navigation
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="carousel__main"
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <div className="grid-view__item">
              <a 
                href={post.permalink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="grid-view__media-link"
              >
                <MediaContent post={post} className="grid-view__media" />
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbs Swiper */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Thumbs, FreeMode]}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        breakpoints={THUMB_BREAKPOINTS}
        className="carousel__thumbs"
      >
        {posts.map((post) => (
          <SwiperSlide key={`thumb-${post.id}`}>
            <div className="carousel__thumb-item">
              <MediaContent post={post} className="carousel__thumb-media" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    <ImageDropZone />
    </>
  );
}
