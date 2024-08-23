import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
  const formatSizes = () => {
    return props.sizes.map(size => {
      if (size.quantity > 0) {
        return `${size.size}`;
      } else {
        return `نفذت كمية المنتج من الحجم ${size.size}`;
      }
    }).join(', ');
  };

  return (
    <div className='item'>
        <Link to={`/product/${props.id}`}>
          <img onClick={() => window.scrollTo(0, 0)} src={props.image} alt={props.name} />
        </Link>
        <p>{props.name}</p>
        <div className="item-prices">
            <div className="item-price-new">
                {props.price}شيكل 
            </div>
            <div className="item-size">
                الأحجام: {formatSizes()}
            </div>
        </div>
    </div>
  );
}

export default Item;
