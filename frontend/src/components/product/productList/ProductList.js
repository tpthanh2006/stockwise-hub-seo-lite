import ReactPaginate from 'react-paginate'
import {AiOutlineEye} from 'react-icons/ai'
import { Link } from 'react-router-dom'
import {FaEdit, FaTrashAlt} from 'react-icons/fa'
import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import './ProductList.scss'
import Search from '../../search/Search'
import { SpinnerImg } from '../../loader/Loader'
import { deleteProduct, getProducts } from '../../../redux/features/product/productSlice'
import { FILTER_PRODUCTS, selectFilteredProducts } from '../../../redux/features/product/filterSlice'

const ProductList = ({products, isLoading}) => {
  // Handle Search State
  const [search, setSearch] = useState("");
  const filteredProducts = useSelector(selectFilteredProducts);
  const dispatch = useDispatch();

  // Shorten String
  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }

    return text;
  };

  // Confirm to Delete a Product
  const delProduct = async (id) => {
    await dispatch(deleteProduct(id));
    await dispatch(getProducts());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure to delete this product?",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  // Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0); // the # of items that've been skipped
  const itemsPerPage = 5;

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };

  // Filter Products
  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  // End Pagination
  useEffect(() => {
    if (filteredProducts) {
      const endOffset = itemOffset + itemsPerPage;

      setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
    };
  }, [itemOffset, itemsPerPage, filteredProducts]);

  return (
    <div className="product-list">
      <hr/>
      <div className='table'>
        <div className='--flex-between --flex-dir-column'>
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"Search Products"}
            />
          </span>
        </div>

        {isLoading && <SpinnerImg/>}
        <div className='table'>
          {!isLoading && products.length === 0 ? (
            <p>-- No product found, please add a product --</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {
                  currentItems.map((product, index) => {
                    const {_id, name, category, price, quantity} = product;
                    
                    return (
                      <tr key={_id}>
                        <td>{itemOffset + index + 1}</td> {/* add itemOffset here to keep track of the right index */}
                        <td>{shortenText(name, 16)}</td>
                        <td>{category}</td>
                        <td>{"$"}{price}</td>
                        <td>{quantity}</td>
                        <td>{"$"}{price * quantity}</td>

                        <td className='icons'>
                          <span>
                            <Link to={`/product-detail/${_id}`}>
                              <AiOutlineEye size={25} color={'purple'} />
                            </Link>
                          </span>

                          <span>
                            <Link to={`/edit-product/${_id}`}>
                              <FaEdit size={25} color={'green'} />
                            </Link>
                          </span>

                          <span>
                            <FaTrashAlt size={25} color={'red'} onClick={() => confirmDelete(_id)}/>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          )}
        </div>

        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>
    </div>
  )
}

export default ProductList