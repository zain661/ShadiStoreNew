import React from 'react';
import './CategoriesPage.css';
import { Link } from 'react-router-dom';
// Import your images here
import sarees from '../Assets/arek1 .jpeg';
import lehenga from '../Assets/arek1 .jpeg';
import salwar from '../Assets/arek1 .jpeg';
import indoWesternWomen from '../Assets/arek1 .jpeg';
import kurtas from '../Assets/arek1 .jpeg';
import bundiSet from '../Assets/arek1 .jpeg';
import indoWesternMen from '../Assets/arek1 .jpeg';
import bandhgala from '../Assets/arek1 .jpeg';

const categories = [
  { name: 'أعراق تراثية', image: sarees , link:'/arak'},
  { name: 'أثواب تراثية', image: lehenga, link:'/turath' },
  { name: 'جكيتات تطريز', image: salwar, link: '/jacket' },
  { name: 'بناتي', image: indoWesternWomen, link:'/girls' },
  { name: 'عرايسي', image: kurtas, link: '/bride' },
  { name: 'اكسسوارات', image: bundiSet, link:'/accessories' },
  { name: 'أحذية', image: indoWesternMen, link:'/shoes' },
  { name: 'تطريز بأحدث الصيحات', image: bandhgala , link: '/fashion' },
];

const CategoriesPage = () => {
  return (
    <div className="categories-container">
      <h1>الفئات الرائجة</h1>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <Link to={category.link} style={{ textDecoration: 'none' }} key={index}>
            <div className="category-card">
              <img src={category.image} alt={category.name} />
              <div className="category-title">{category.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
