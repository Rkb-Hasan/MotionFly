import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Test from "../../assets/images/products/profile_pic.jpg";
export default function Slider() {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide>
        <img src={Test} alt="Test" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={Test} alt="Test" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={Test} alt="Test" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={Test} alt="Test" />
      </SwiperSlide>
    </Swiper>
  );
}
