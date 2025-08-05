import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BiCategory } from "react-icons/bi";
import { BsCart4, BsCartX } from "react-icons/bs";
import { AiFillDollarCircle } from "react-icons/ai";

import './ProductSummary.scss'
import InfoBox from '../../infoBox/InfoBox';
import {
  CALC_STORE_VALUE,
  CALC_OUT_OF_STOCK,
  selectTotalStoreValue,
  selectOutOfStock,
  selectCategory,
  CALC_CATEGORY
} from '../../../redux/features/product/productSlice';

// Icons
const earningIcon = <AiFillDollarCircle size={40} color="#fff" />
const productIcon = <BsCart4 size={40} color="#fff" />
const categoryIcon = <BiCategory size={40} color="#fff" />
const outOfStockIcon = <BsCartX size={40} color="#fff" />

// Format Amount
export const formatNumbers = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductSummary = ({products}) => {
  const dispatch = useDispatch();

  const category = useSelector(selectCategory);
  const outOfStock = useSelector(selectOutOfStock);
  const totalStoreValue = useSelector(selectTotalStoreValue);

  useEffect(() => {
    dispatch(CALC_STORE_VALUE(products));
    dispatch(CALC_OUT_OF_STOCK(products));
    dispatch(CALC_CATEGORY(products));
  }, [dispatch, products]);

  return (
    <div className='product-summary'>
      <h3 className='--mt'>Inventory Stats</h3>
      <div className='info-summary'>
        <InfoBox
          icon={productIcon}
          title={"Total Products"}
          count={products.length}
          bgColor="card1"
        />
        <InfoBox
          icon={earningIcon}
          title={"Total Store Value"}
          count={`$${formatNumbers(totalStoreValue)}`}
          bgColor="card2"
        />
        <InfoBox
          icon={outOfStockIcon}
          title={"Out of Stock"}
          count={outOfStock}
          bgColor="card3"
        />
        <InfoBox
          icon={categoryIcon}
          title={"All Categories"}
          count={category.length}
          bgColor="card4"
        />
      </div>
    </div>
  )
}

export default ProductSummary