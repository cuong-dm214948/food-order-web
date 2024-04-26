// all images imported from images directory
import image1 from "../image/desert/MENU-PC_BÁNH-SÔ-CÔ-LA-ĐÚT-LÒ.jpg";
import image2 from "../image/desert/MENU-PC_choco-pizza.jpg";
import image3 from "../image/desert/MENU-PC-Chocolate-Roll-nen-xam_360X240px.jpg";

import image10 from '../image/drink/Fuzetea+-Chanh-Day-350ml-new-new.png'
import image11 from '../image/drink/Sprite-1.5L.jpg'
import image12 from '../image/drink/Sprite-390.jpg'
import image13 from '../image/drink/coke-1.5-new-new.png'
import image14 from '../image/drink/coke-zero.jpg'
import image15 from '../image/drink/coke-390.jpg'
import image16 from '../image/drink/daisani.jpg'
import image17 from '../image/drink/dao-hat-chia.jpg'
import image18 from '../image/drink/fanta-1.5.jpg'
import image19 from '../image/drink/fanta-390.jpg'

import image20 from '../image/side/Khai-Vị-Tổng-Hợp-PC-nen-xam-1_360X240px_1.jpg'
import image21 from '../image/side/MENU-PC-Banh-sung-bo-1.jpg'
import image22 from '../image/side/MENU-PC-Gà-Viên-Phô-Mai-Đút-Lò-1.jpg'
import image23 from '../image/side/MENU-PC-Mỳ-Ý-Dăm-Bông-_-Nấm-Xốt-Kem-1.jpg'
import image24 from '../image/side/MENU-PC_Bánh-Mì-Nướng-Bơ-Tỏi.jpg'
import image25 from '../image/side/MENU-PC_Khoai-Tây-Phô-Mai-Đút-Lò.jpg'
import image26 from '../image/side/MENU-PC_Xúc-Xích-Xông-Khói-Đút-Lò+-+Copy.jpg'
import image27 from '../image/side/MENU-PC_MÌ-Ý-HẢI-SẢN-ĐÚT-LÒ.jpg'
import image28 from '../image/side/MENU-PC_MÌ-Ý-RAU-CỦ-ĐÚT-LÒ.jpg'
import image29 from '../image/side/MENU-PC_Mì-Ý-Bò-Bằm-Đút-Lò.jpg'

import image30 from '../image/pizza/CHEESY+MADNESS+NO+NEW+PC.jpg'
import image31 from '../image/pizza/Meat-lover-Pizza-5-Loai-Thit-Thuong-Hang.jpg'
import image32 from '../image/pizza/Menu+BG+1.jpg'
import image33 from '../image/pizza/PIZZA+CUA+ST+(2).jpg'
import image34 from '../image/pizza/Pepperoni-feast-Pizza-Xuc-Xich-Y.jpg'
import image35 from '../image/pizza/Pizza-Dam-Bong-Dua-Kieu-Hawaii-Hawaiian.jpg'
import image36 from '../image/pizza/Pizza-Ga-Pho-Mai-Thit-Heo-Xong-Khoi-Cheesy-Chicken-Bacon.jpg'
import image37 from '../image/pizza/Pizza-Hai-San-Xot-Ca-Chua-Seafood-Delight.jpg'
import image38 from '../image/pizza/Pizza-Thap-Cam-Thuong-Hang-Extravaganza.jpg'


const products = [
  {
    id: "01",
    title: "Chicken Burger",
    price: 24.0,
    image01: image36,
    image02: image31,
    image03: image32,
    category: "Burger",

    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque. ",
  },

  {
    id: "02",
    title: "Vegetarian Pizza",
    price: 115.0,
    image01: image38,

    category: "Pizza",

    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
  },

  {
    id: "03",
    title: "Double Cheese Margherita",
    price: 110.0,
    image01: image30,

    category: "Pizza",

    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
  },

  {
    id: "04",
    title: "Maxican Green Wave",
    price: 110.0,
    image01: image33,
    image03: image35,
    category: "Pizza",

    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
  },

  // {
  //   id: "05",
  //   title: "Cheese Burger",
  //   price: 24.0,
  //   image01: product_05_image_01,
  //   image02: product_05_image_02,
  //   image03: product_05_image_03,
  //   category: "Burger",

  //   desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
  // },
  // {
  //   id: "06",
  //   title: "Royal Cheese Burger",
  //   price: 24.0,
  //   image01: product_01_image_01,
  //   image02: product_01_image_02,
  //   image03: product_01_image_03,
  //   category: "Burger",

  //   desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
  // },

  {
    id: "07",
    title: "Seafood Pizza",
    price: 115.0,
    image01: image37,
    category: "Pizza",

    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
  },

  {
    id: "08",
    title: "Thin Cheese Pizza",
    price: 110.0,
    image01: image34,

    category: "Pizza",

    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
  },

  // {
  //   id: "09",
  //   title: "Pizza With Mushroom",
  //   price: 110.0,
  //   image01: product_04_image_02,
  //   image02: product_04_image_01,
  //   image03: product_04_image_03,
  //   category: "Pizza",

  //   desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
  // },



  {
    id: "10",
    title: "Classic Hamburger",
    price: 24.0,
    image01: image24,
    image02: image25,
    image03: image26,
    category: "Burger",

    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
  },

  {
    id: "11",
    title: "Crunchy Bread ",
    price: 35.0,
    image01: image20,
    image02: image21,
    image03: image22,
    category: "Bread",

    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ad et est, fugiat repudiandae neque illo delectus commodi magnam explicabo autem voluptates eaque velit vero facere mollitia. Placeat rem, molestiae error obcaecati enim doloribus impedit aliquam, maiores qui minus neque.",
  },

  {
    id: "12",
    title: "Loaf Bread ",
    price: 35.0,
    image01: image27,
    image02: image29,
    image03: image28,
    category: "Bread",

    desc: "",
  },

  {
    id: "13",
    title: "Loaf Bread ",
    price: 35.0,
    image01: image27,
    image02: image29,
    image03: image28,
    category: "Bread",

    desc: "",
  },

  {
    id: "20",
    title: "Loaf Bread ",
    price: 35.0,
    image01: image27,
    image02: image29,
    image03: image28,
    category: "Bread",

    desc: "",
  },

  {
    id: "21",
    title: "Loaf Bread ",
    price: 35.0,
    image01: image10,
    image02: image11,
    image03: image12,
    category: "Bread",

    desc: "",
  },

  {
    id: "22",
    title: "Loaf Bread ",
    price: 35.0,
    image01: image13,
    image02: image14,
    image03: image15,
    category: "Bread",

    desc: "",
  },

  {
    id: "23",
    title: "Loaf Bread ",
    price: 35.0,
    image01: image16,
    image02: image17,
    image03: image18,
    category: "Bread",

    desc: "",
  },

  {
    id: "30",
    title: "Loaf Bread ",
    price: 35.0,
    image01: image27,
    image02: image29,
    image03: image28,
    category: "Bread",

    desc: "",
  },

  {
    id: "31",
    title: "Loaf Bread ",
    price: 35.0,
    image01: image3,

    category: "Bread",

    desc: "",
  },

  {
    id: "32",
    title: "Loaf Bread ",
    price: 35.0,
    image01: image2,

    category: "Bread",

    desc: "",
  },


  {
    id: "33",
    title: "Loaf Bread ",
    price: 35.0,
    image01: image1,
    category: "Bread",

    desc: "",
  },

];

export default products;
