import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'

import "./EditProduct.scss";
import Loader from '../../components/loader/Loader';
import ProductForm from '../../components/product/productForm/ProductForm';
import { getProduct, getProducts, selectIsLoading, selectProduct, updateProduct } from '../../redux/features/product/productSlice';
import Card from '../../components/card/Card';

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isLoading = useSelector(selectIsLoading);
  const productEdit = useSelector(selectProduct);

  const [product, setProduct] = useState(productEdit);
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    setProduct(productEdit);
    
    setImagePreview(
      productEdit && productEdit.image ?
      `${productEdit.image.filePath}` :
      null
    );

    setDescription(
      productEdit && productEdit.description ?
      productEdit.description :
      ""
    );
  }, [productEdit]);

  const handleInputChange = async (e) => {
    const {name, value} = e.target;
    setProduct({...product, [name]: value});

    if (name === "description") {
      setDescription(value);
    };
  };

  const handleImageChange = async (e) => {
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const saveProduct = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append("name", product?.name);
      formData.append("category", product?.category);
      formData.append("quantity", product?.quantity);
      formData.append("price", product?.price);

      formData.append("description", description);
      if (productImage) {
        formData.append("image", productImage);
      }
  
      console.log(...formData);

      await dispatch(updateProduct({id, formData}));
      await dispatch(getProducts());

      navigate("/dashboard");
  };

  return (
    <div>
      {isLoading && <Loader/>}
      <h3 className='--mt'>Edit Product</h3>

      <Card cardClass={"card"}>
        <div className="card-header">
          <span className="product-details">
            <Link className='--btn --btn-danger' to={`/product-detail/${id}`}>
              Return
            </Link>
          </span>
            
          <span className="dashboard-again">
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

export default EditProduct