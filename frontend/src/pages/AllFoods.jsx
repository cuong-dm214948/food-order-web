import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import products from "../assets/fake-data/products";
import ProductCard from "../components/UI/product-card/ProductCard";

import "../styles/all-foods.css";
import "../styles/pagination.css";

const AllFoods = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState("Pizza");
  const [sortOption, setSortOption] = useState("Default");
  const [allProducts, setAllProducts] = useState(products);

  useEffect(() => {
    let filteredProducts = products;

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== "All") {
      filteredProducts = filteredProducts.filter(
        (item) => item.category === category
      );
    }

    if (sortOption === "ascending") {
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "descending") {
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === "high-price") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "low-price") {
      filteredProducts.sort((a, b) => a.price - b.price);
    }

    setAllProducts(filteredProducts);
  }, [searchTerm, category, sortOption]);

  useEffect(() => {
    if (category === "Discount") {
      navigate("/contact");
    }
  }, [category, navigate]);

  return (
    <Helmet title="All-Foods">
      <section>
        <Container>
          <Col lg="12">
            <div className="food__category d-flex align-items-center justify-content-center gap-4">
              <button
                className={`all__btn ${category === "Discount" ? "foodBtnActive" : ""}`}
                onClick={() => setCategory("Discount")}
              >
                Discount
              </button>
              <button
                className={`d-flex align-items-center gap-2 ${category === "Pizza" ? "foodBtnActive" : ""}`}
                onClick={() => setCategory("Pizza")}
              >
                Pizza
              </button>
              <button
                className={`d-flex align-items-center gap-2 ${category === "Side" ? "foodBtnActive" : ""}`}
                onClick={() => setCategory("Side")}
              >
                Side
              </button>
              <button
                className={`d-flex align-items-center gap-2 ${category === "Desert" ? "foodBtnActive" : ""}`}
                onClick={() => setCategory("Desert")}
              >
                Desert
              </button>
              <button
                className={`d-flex align-items-center gap-2 ${category === "Drink" ? "foodBtnActive" : ""}`}
                onClick={() => setCategory("Drink")}
              >
                Drink
              </button>
            </div>
          </Col>
          <Row>
            <Col lg="6" md="6" sm="6" xs="12" className="mb-2">
              <div className="search__widget d-flex justify-content-start ">
                <input
                  type="text"
                  placeholder="I'm looking for...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span >
                  <i className="ri-search-line"></i>
                </span>
               
              </div>
            </Col>
            <Col lg="6" md="6" sm="6" xs="12" className="mb-3 d-flex justify-content-end">
              <div className="sorting__widget">
                <select
                  className="w-50"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="Default">Default</option>
                  <option value="ascending">Alphabet A-Z</option>
                  <option value="descending">Alphabet Z-A</option>
                  <option value="high-price">High Price</option>
                  <option value="low-price">Low Price</option>
                </select>
              </div>
            </Col>
          </Row>
          <Row>
            {allProducts.map((item) => (
              <Col lg="3" md="4" sm="6" xs="6" key={item.id} className="mb-4">
                <ProductCard item={item} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default AllFoods;
