import React, { useContext } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-products">
        {all_product.map((item, i) => {
          if (props.category === item.category) {
            return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price} sizes={item.sizes} />;
          } else {
            return null;
          }
        })}
      </div>
      {/* <div className="shopcategory-loadmore">
        Explore more
      </div> */}
    </div>
  );
}

export default ShopCategory;
