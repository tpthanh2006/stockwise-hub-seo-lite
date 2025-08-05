import DOMPurify from "dompurify";
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import './ProductDetail.scss';
import Card from '../../card/Card';
import useRedirectLoggedOutUser from '../../../customHook/useRedirectLoggedOutUser';
import { getProduct } from '../../../redux/features/product/productSlice';
import { selectIsLoggedIn } from '../../../redux/features/auth/authSlice';
import { SpinnerImg } from '../../loader/Loader';


const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',  
};

const formattedDate = (prevDate) => {
  const dateObject = { time: prevDate };

  return new Date(dateObject.time).toLocaleString('en-US', options);
}

const ProductDetail = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const { id } = useParams();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const {product, isLoading, isError, message} = useSelector((state) => state.product);

  const stockStatus = (quantity) => {
    if (quantity > 0) {
      return <span className='--color-success'>In Stock</span>;
    }

    return <span className='--color-danger'>Out of Stock</span>;
  };

  useEffect(() => { // Runs when dependencies change
    if (isLoggedIn === true) {
      dispatch(getProduct(id));
      //console.log(product);
    }

    if (isError) {
      console.log(message);
    }
  }, [id, isLoggedIn, isError, message, dispatch]);

  return (
    <div className='product-detail'>
      <h3 className='--mt'>Product Detail</h3>
      {isLoading && <SpinnerImg />}
      <Card cardClass="card">

        {product && (
          <div className='detail'>
            <div className="detail-header">
              <span className="back-to-dashboard">
                <Link className='--btn --btn-danger' to={`/dashboard`}>
                  Dashboard
                </Link>
              </span>
            
              <span className="edit-product">
                <Link className='--btn --btn-danger' to={`/edit-product/${id}`}>
                  Edit Product
                </Link>
              </span>
            </div>
            <hr/>

            <Card cardClass="group">
              {product?.image ? (
                <img
                  src={product.image.filePath}
                  alt={product.image.fileName}
                />
              ) : (
                <p>No image set for this product</p>
              )}
            </Card>

            <h4>
              Product Availability: {stockStatus(product.quantity)}
            </h4>
            <hr/>
            
            <h4>
              <span className='badge'>Name:</span> &nbsp; {product.name}
            </h4>
            
            <p>
              <b>&rarr; SKU: </b> {product.sku}
            </p>
            <p>
              <b>&rarr; Category: </b> {product.category}
            </p>
            <p>
              <b>&rarr; Price: </b> {'$'}{product.price}
            </p>
            <p>
              <b>&rarr; Quantity: </b> {product.quantity}
            </p>
            <p>
              <b>&rarr; Total Value in Stock: </b> {'$'}{product.price * product.quantity}
            </p>
            <hr/>

            <div
              className="description"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            >
            </div>
            <hr/>

            <code className="--color-dark">
              Created on: {formattedDate(product.createdAt.toLocaleString("en-US"))}
            </code>
            <br/>
            <code className="--color-dark">
              Last Updated: {formattedDate(product.updatedAt.toLocaleString("en-US"))}
            </code>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ProductDetail