import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaTimes } from 'react-icons/fa'
import { BsCheck2All } from 'react-icons/bs'

import './ProductForm.scss';
import Card from '../../card/Card';
import { useEffect, useState } from 'react';

const ProductForm = ({
  product,
  productImage,
  imagePreview,
  description,
  setDescription,
  handleInputChange,
  handleImageChange, 
  saveProduct
}) => {
  const [descLength, setDescLength] = useState(true);

  const timesIcon = <FaTimes color="red" size={15} />;
  const checkIcon = <BsCheck2All color="green" size={15} />;
  const switchIcon = (condition) => {
    if (condition) {
      return checkIcon;
    };
  
    return timesIcon;
  };

  useEffect(() => {
    if (description.length > 250) {
      setDescLength(false);
    } else {
      setDescLength(true);
    }
    //console.log(description.length);
  }, [description]);

  return (
    <div className='add-product'>
      <Card cardClass={"card"}>
        <form onSubmit={saveProduct}>
          <Card cardClass={"group"}>
            <label>Product Image</label>
            <code className="--color-dark">Supported Formats: jpg, jpeg, png</code>
            
            <input
              type="file"
              name="image"
              onChange={(e) => handleImageChange(e)}
            />

            {imagePreview != null ? (
              <div className='image-preview'>
                <img src={imagePreview} alt="product" />
              </div>
            ) : (
              <p>No image set for this product</p>
            )}
          </Card>

          <label>Product Name <span style={{ color: "red "}}>*</span></label>
          <input
            required
            type="text"
            placeholder="Product Name"
            name="name"
            value={product?.name}
            onChange={handleInputChange}
          />

          <label>Product Category <span style={{ color: "red "}}>*</span></label>
          <input
            required
            type="text"
            placeholder="Product Category"
            name="category"
            value={product?.category}
            onChange={handleInputChange}
          />

          <label>Product Price <span style={{ color: "red "}}>*</span></label>
          <input
            required
            type="number"
            placeholder="Product Price"
            name="price"
            value={product?.price}
            onChange={handleInputChange}
          />

          <label>Product Quantity <span style={{ color: "red "}}>*</span></label>
          <input
            required
            type="number"
            placeholder="Product Quantity"
            name="quantity"
            value={product?.quantity}
            onChange={handleInputChange}
          />

          <label>Product Description</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={ProductForm.modules}
            formats={ProductForm.formats}
          />
          <Card cardClass={"group"}>
            <ul className="form-list"> 
              <li>
                <span className={"indicator"}>
                  {switchIcon(descLength)}
                  &nbsp; At Most 250 Characters
                </span>
              </li>
            </ul>
          </Card>

          <div className='--my'>
            <button type='submit' className='--btn --btn-primary'>
              Save Product
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

ProductForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
ProductForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default ProductForm