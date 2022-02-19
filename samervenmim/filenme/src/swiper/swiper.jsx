import React from 'react'
import Framework7 from 'framework7/lite-bundle';

// Import F7-React Plugin
import Framework7React from 'framework7-react';

// Init F7-React Plugin
import { Page, Navbar, BlockTitle, Swiper, SwiperSlide, Block } from 'framework7-react';
Framework7.use(Framework7React);

const swiper = () => {
    return (
        <Page>
        <Navbar title="Swiper" />
        <BlockTitle>Minimal Layout</BlockTitle>
        <Swiper>
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
        </Swiper>
    
        <BlockTitle>With all controls</BlockTitle>
        <Swiper pagination navigation scrollbar>
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
        </Swiper>
    
        <BlockTitle>With additional parameters</BlockTitle>
        <Swiper navigation speed={500} slidesPerView={3} spaceBetween={20}>
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
          <SwiperSlide>Slide 5</SwiperSlide>
          <SwiperSlide>Slide 6</SwiperSlide>
        </Swiper>
        <Block />
      </Page>
    )
}

export default swiper
