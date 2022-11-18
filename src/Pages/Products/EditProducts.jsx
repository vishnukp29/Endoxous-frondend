import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getProductDetails,
  updateProduct,
  clearErrors,
} from "../../redux/actions/productAction";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import { getAllCategories } from "../../redux/actions/categoryAction";

const EditProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.products);

  const { product, error, success } = useSelector(
    (state) => state.productDetails
  );
  const { categoryList } = useSelector((state) => state.allCategories);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [mrp, setMrp] = useState(0);
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreviw, setImagesPreviw] = useState([]);
  const [inventory, setInventory] = useState(0);
  //   const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");

  //   const categories = [];
  const productId = id;

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setPrice(product.price);
      setCategory(product.mrp);
      setOldImages(product.images);
      setStock(product.stock);
      setTag(product.tag);
    }

    if (error) {
      alert.error(error.message);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError.message);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Product Updated Successfully");
      navigate("/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }

    dispatch(getAllCategories());
  }, [
    dispatch,
    alert,
    error,
    isUpdated,
    productId,
    product,
    updateError,
    navigate,
  ]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name + " " + category);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("price", price);
    myForm.set("mrp", mrp);
    myForm.set("stock", stock);
    myForm.set("inventory", inventory);
    myForm.set("tag", tag);

    images.forEach((image) => {
      myForm.append("images", image);
    });
    dispatch(updateProduct(myForm));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreviw([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreviw((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const createCategoryList = (categories, options = []) => {
    if (categories) {
      for (let category of categories) {
        options.push({ value: category._id, name: category.name });
        if (category && category.children.length > 0) {
          createCategoryList(category.children, options);
        }
      }
      return options;
    }
  };

  return (
    <div className="">
      <nav
        className="s2-navabar navbar navbar-expand-lg"
        style={{ backgroundColor: "white" }}
      >
        <div className="container-fluid px-5">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo03"
            aria-controls="navbarTogglerDemo03"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <NavLink className="fw-bold navbar-brand" to="">
            Edit Products
          </NavLink>
          <button
            className="btn btn-outline-success btnround"
            type="submit"
          ></button>
        </div>
        <hr />
      </nav>

      <div
        className="conatiner-sm d-flex justify-content-center flex-column align-items-center section bg-light h-100"
        style={{ height: "100vh" }}
      >
        <h2 className="mb-5 mt-5"> Product Details</h2>
        <form
          action=""
          className="createproductForm"
          encType="multipart/form-data"
          onSubmit={updateProductSubmitHandler}
        >
          <div class="bg-white p-4 rounded">
            <div class="mb-2">
              <label for="exampleInputNumber" class="form-label">
                Product Name
              </label>
              <input
                type="text"
                class="form-control"
                id="exampleInputNumber"
                aria-describedby="numberHelp"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div class="mb-2">
              <label for="exampleInputNumber" class="form-label">
                Description
              </label>
              <input
                type="text"
                class="form-control"
                id="exampleInputNumber"
                aria-describedby="numberHelp"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div class="mb-2">
              <label for="exampleInputNumber" class="form-label">
                Product Category
              </label>
              <br />
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="">Choose Category</option>

                {categoryList &&
                  createCategoryList(categoryList).map((option) => (
                    <option key={option.value} value={option.name}>
                      {option.name}
                    </option>
                  ))}
              </select>
            </div>

            <div class="d-flex flex-row gap-2">
              <div class="mb-2">
                <label for="exampleInputNumber" class="form-label">
                  Price
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="exampleInputNumber"
                  aria-describedby="numberHelp"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div class="mb-2">
                <label for="exampleInputNumber" class="form-label">
                  Price
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="exampleInputNumber"
                  aria-describedby="numberHelp"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                />
                <label
                  for="exampleInputNumber"
                  class="form-label bg-success mt-1 px-1 text-white rounded"
                >
                  20$ OFF
                </label>
              </div>
            </div>

            <div class="d-flex flex-row gap-2">
              <div class="mb-2">
                <label for="exampleInputNumber" class="form-label">
                  Product Unit
                </label>
                <input
                  type="number"
                  class="form-control"
                  id="exampleInputNumber"
                  aria-describedby="numberHelp"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div class="bg-white p-4 rounded mt-3">
            <div class="mb-2" id="createProductFormFile">
              <label for="exampleInputNumber" class="form-label">
                Product Images
              </label>
              <input
                type="file"
                class="form-control"
                id="exampleInputNumber1"
                aria-describedby="numberHelp"
                name="avatar"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>
            <div id="createProductFormImage">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img key={index} src={image.url} alt="Old Product Preview" />
                ))}
            </div>
            <div id="createProductFormImage">
              {imagesPreviw.map((image, index) => (
                <img key={index} src={image} alt="Avatar Preview" />
              ))}
            </div>
          </div>

          <div class="bg-white p-4 rounded mt-3">
            <div class="mb-2">
              <h6>Inventory</h6>
              <label for="exampleInputNumber" class="form-label">
                Quantity
              </label>
              <input
                type="text"
                class="form-control"
                id="exampleInputNumber1"
                aria-describedby="numberHelp"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
              />
            </div>
          </div>

          <div class="bg-white p-4 rounded mt-3">
            <div class="mb-2">
              <h6>Tags to Products</h6>

              <input
                type="text"
                class="form-control"
                id="exampleInputNumber1"
                aria-describedby="numberHelp"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>
            {/* <div class="gap-2 d-flex">
              <button type="button" class="btn btn-secondary rounded-pill">
                Add
              </button>
              <button type="button" class="btn btn-danger rounded-pill">
                Secondary X
              </button>
              <button type="button" class="btn btn-danger rounded-pill">
                Secondary X
              </button>
            </div> */}
          </div>

          <button type="submit" class="btn btn-success w-100 mt-3 mb-5">
            <Link to="" style={{ color: "white", textDecoration: "none" }}>
              Edit Product
            </Link>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProducts;
