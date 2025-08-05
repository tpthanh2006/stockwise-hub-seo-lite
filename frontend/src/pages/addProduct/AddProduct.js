import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import "./AddProduct.scss";
import Loader from '../../components/loader/Loader';
import ProductForm from '../../components/product/productForm/ProductForm';
import { createProduct, selectIsLoading } from '../../redux/features/product/productSlice';
import Card from '../../components/card/Card';

const initialState = {
  name: "",
  category: "",
  quantity: "",
  price: "",
};

const AddProduct = () => {
  const [product, setProduct] = useState(initialState);
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);

  const { name, category, price, quantity } = product;

  const handleInputChange = async (e) => {
    const {name, value} = e.target;
    setProduct({ ...product, [name]: value });

    if (name === "description") {
      setDescription(value);
    };
  };

  const handleImageChange = async (e) => {
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const generateSKU = (category) => {
    const letter = category.slice(0, 3).toUpperCase();
    const number = Date.now();
    
    const sku = letter + "-" + number;
    return sku;
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", generateSKU(category));
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("description", description || "");
    formData.append("image", productImage);

    //console.log(...formData);

    try {
      await dispatch(createProduct(formData));
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {isLoading && <Loader/>}
      <h3 className='--mt'>Add New Product</h3>

      <Card cardClass={"card"}>
        <div className="form-header">
          <span className="back-to-dashboard">
            <Link className='--btn --btn-danger' to={`/dashboard`}>
              Dashboard
            </Link>
          </span>
            
          <span className="view-products">
            <Link className='--btn --btn-danger' to={`/dashboard`}>
              View All Products
            </Link>
          </span>
        </div>
      </Card>

      <ProductForm
        product={product}
        productImage={productImage}
        imagePreview={imagePreview}
        description={description}
        setDescription={setDescription}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        saveProduct={saveProduct}
      />
    </div>
  )
}

export default AddProduct