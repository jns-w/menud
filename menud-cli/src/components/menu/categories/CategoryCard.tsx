import React from 'react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MenuCategory} from "../../../types/menu-types.ts";

type CategoryCardProps = {
  categoryData: MenuCategory,
  openCategory: (categoryIndex: number) => void
  categoryIndex: number
}

export default function CategoryCard(props: CategoryCardProps) {
  const {categoryData} = props;
  return (
    <div
      className="category-card"
      key={categoryData.name}
      onMouseUp={() => props.openCategory(props.categoryIndex)}
      role="menuitem"
    >
      <img src={categoryData.menu_items[0].image_url} alt="" />
      <div className="category-info">
        <h2>{categoryData.name}</h2>
        <p>{categoryData.menu_items.length} items</p>
      </div>
      <div className="arrow-div">
        <FontAwesomeIcon icon={faChevronRight} className="fa-arrow" />
      </div>
    </div>
  );
}

