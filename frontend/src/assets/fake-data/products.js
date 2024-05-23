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
    title: "CHEESY MADNESS",
    price: 240.0,
    image01: image30,
    category: "Pizza",

    desc: "Phô Mai Cheddar, Phô Mai Mozzarella, Phô Mai Xanh Viên, Viền Phô Mai, Xốt Phô Mai Và Phục Vụ Cùng Mật Ong.",
  },

  {
    id: "02",
    title: "Meat-lover",
    price: 215.0,
    image01: image31,

    category: "Pizza",

    desc: "Xốt Cà Chua, Phô Mai Mozzarella, Xúc Xích Pepperoni, Thịt Dăm Bông, Xúc Xich Ý, Thịt Bò Viên, Thịt Heo Muối",
  },

  {
    id: "03",
    title: "Beefsteak NewYork",
    price: 210.0,
    image01: image32,

    category: "Pizza",

    desc: "Bò Beefsteak, Xốt Demi-Glace (Xốt Bít Tết), Xốt Kem Chua, Phô Mai Mozzarella, Nấm, Cà Chua, Hành Tây, Bột Rong Biển",
  },

  {
    id: "04",
    title: "Singapore Crab Meat",
    price: 210.0,
    image01: image33,
    category: "Pizza",

    desc: "Xốt tiêu đen, Phô Mai Mozzarella, Phô Mai Cheddar, Thơm, Hành Tây, Tôm, Mực. Tăng 50% lượng topping protein: Tôm, Mực",
  },

  {
    id: "05",
    title: "Pepperoni feast",
    price: 224.0,
    image01: image34,
    category: "Pizza",

    desc: "Xốt Cà Chua, Phô Mai Mozzarella, Xúc Xích Pepperoni",
  },
  {
    id: "06",
    title: "Hawian",
    price: 224.0,
    image01: image35,

    category: "Pizza",

    desc: "Xốt Cà Chua, Phô Mai Mozzarella, Thịt Dăm Bông, Thơm",
  },

  {
    id: "07",
    title: "Cheesy chicken Bacon",
    price: 215.0,
    image01: image36,
    category: "Pizza",

    desc: "ốt Phô Mai, Thịt Gà, Thịt Heo Muối, Phô Mai Mozzarella, Cà Chua",
  },

  {
    id: "08",
    title: "Seafood Delight",
    price: 210.0,
    image01: image37,

    category: "Pizza",

    desc: "Xốt Cà Chua, Phô Mai Mozzarella, Tôm, Mực, Thanh Cua, Hành Tây    ",
  },

  {
    id: "09",
    title: "Extravaganza",
    price: 210.0,
    image01: image38,
    category: "Pizza",

    desc: "Xốt Cà Chua, Phô Mai Mozzarella, Xúc Xích Pepperoni, Thịt Dăm Bông, Xúc Xich Ý, Thịt Bò Viên, Ớt Chuông Xanh, Nấm Mỡ, Hành Tây, Ô-liu    ",
  },






  {
    id: "10",
    title: "Khai vi tong hop",
    price: 24.0,
    image01: image20,
    category: "Side",

    desc: "2 miếng Cánh gà nướng BBQ, 3 miếng Xúc Xích Xông Khói Đút Lò và Khoai tây phô mai đút lò",
  },

  {
    id: "11",
    title: "Beef croisant ",
    price: 35.0,
    image01: image21,
    category: "Side",

    desc: "Bò Beefsteak, Xốt Bít Tết, Xốt Kem Chua, Phô Mai, Rong Biển Khô, Bơ",
  },

  {
    id: "12",
    title: "Popcorn ",
    price: 35.0,
    image01: image22,
    category: "Side",

    desc: "Gà Xiên Nướng Satay (3 Xiên), Xốt Chấm Chua Ngọt Đậm Vị Thái",
  },

  {
    id: "13",
    title: "Pasta",
    price: 35.0,
    image01: image23,
    image02: image29,
    image03: image28,
    category: "Side",

    desc: "My y dam bong nam sot kem,Mỳ Ý, Xốt Bò Bằm, Phô Mai Mozzarella",
  },

  {
    id: "14",
    title: "Bread ",
    price: 35.0,
    image01: image24,
    category: "Side",

    desc: "Bánh Mì, Bơ, Bột Tỏi, Xốt Pizza, phô mai",
  },

  {
    id: "15",
    title: "Potato Wedge ",
    price: 35.0,
    image01: image25,
    category: "Side",

    desc: "Khoai Tây, Thịt Heo Xông Khói, Phô Mai",
  },

  {
    id: "16",
    title: "Sausage",
    price: 35.0,
    image01: image26,
    category: "Side",

    desc: "Xúc Xích Xông Khói, Xốt BBQ, ketchup (4miếng)",
  },

  {
    id: "20",
    title: "Chocolava ",
    price: 35.0,
    image01: image1,
    category: "Desert",
    desc: "Chocolate tan chảy",
  },

  {
    id: "21",
    title: "Choco pizza ",
    price: 35.0,
    image01: image2,
    category: "Desert",
    desc: "Sô-cô-la chip Đen Và Trắng, Xốt Sô-cô-la Đen, Phô Mai Mozarella, Xốt Kem Chua, Đế Mỏng Giòn",
  },

  {
    id: "22",
    title: "Chocolate roll ",
    price: 35.0,
    image01: image2,
    category: "Desert",
    desc: "Bánh Cuộn Mềm Xốp, Sô-cô-la chip Đen Và Trắng, Xốt Sô-cô-la Đen",
  },

  {
    id: "30",
    title: "Chia seed ",
    price: 35.0,
    image01: image17,
    image02: image11,
    category: "Drink",

    desc: "",
  },

  {
    id: "31",
    title: "Sprite ",
    price: 35.0,
    image01: image12,
    image02: image13,
    category: "Drink",

    desc: "",
  },

  {
    id: "32",
    title: "Coke",
    price: 35.0,
    image01: image14,
    image02: image13,
    category: "Drink",

    desc: "",
  },


  {
    id: "33",
    title: "Dasani ",
    price: 35.0,
    image01: image16,
    category: "Drink",

    desc: "",
  },

  {
    id: "34",
    title: "Panta ",
    price: 35.0,
    image01: image18,
    image02: image19,
    category: "Drink",

    desc: "",
  },

];

export default products;
