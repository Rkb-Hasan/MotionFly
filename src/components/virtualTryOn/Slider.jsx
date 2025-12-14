import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Test3 from "../../assets/images/products/link.jpg";
import Test from "../../assets/images/products/profile_pic.jpg";
import Test2 from "../../assets/images/products/test.png";
import "../../styles/slider.css";
export default function Slider() {
  return (
    <Swiper
      spaceBetween={2}
      slidesPerView={3}
      centeredSlides={true}
      loop={true}
      coverflowEffect={true}
      autoplay={true}
      grabCursor={true}
    >
      <SwiperSlide>
        <img src={Test} alt="Test" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={Test2} alt="Test" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={Test3} alt="Test" />
      </SwiperSlide>
      <SwiperSlide>
        <img src={Test} alt="Test" />
      </SwiperSlide>
    </Swiper>
  );
}
