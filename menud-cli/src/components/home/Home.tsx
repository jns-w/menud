import {PageMode} from "../../App.tsx";
import React, {useState} from "react";
import CategoryCard from "../menu/categories/CategoryCard.tsx";
import {Menu} from "../../types/menu-types.ts";
import MenuItemCard from "../menu/menu-items/MenuItemCard.tsx";


export type HomeProps = {
  mainRef: React.RefObject<HTMLDivElement>
  menu?: Menu
  setItemQuantity: (categoryIndex: number, itemId: string, quantity: number) => void
  pageMode: PageMode
  setPageMode: (mode: PageMode) => void
}

export default function Home(props: HomeProps) {
  const [selectedMenuItemId, setSelectedMenuItemId] = useState('');

  function openCategory(categoryIndex: number) {
    props.setPageMode({is: 'menuitems', categoryIndex});
    if (props.mainRef.current === null) return;
    props.mainRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  if (!props.menu) return (
    <div className="home-page-div">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: "black",
          backgroundColor: 'white',
        }}
      >
        <h4
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: '1.2rem',
          }}
        >
          Something went wrong
        </h4>
      </div>
    </div>
  )


  return (
    <div className="home-page-div">
      <div
        className="category-main-div"
        style={{
          left: props.pageMode.is === 'categories' ? '0' : '-100vw',
        }}
      >
        {props.menu.categories.map((categoryData, index) => (
          <CategoryCard
            categoryIndex={index}
            categoryData={categoryData}
            openCategory={openCategory}
            key={categoryData.name}
          />
        ))}

      </div>
      <div
        className="menuitems-main-div"
        style={{
          left: props.pageMode.is === 'menuitems' ? '0' : '100vw',
          height: props.pageMode.is === 'menuitems' ? 'auto' : '800px',
        }}
      >
        <div
          className="category-header-div"
          style={{
            opacity: props.pageMode.is === 'menuitems' ? '1' : '0',
          }}
        >
          <h3>{props.menu.categories[props.pageMode.categoryIndex || 0].name}</h3>
          <h3>menu</h3>
        </div>
        <div>
          {props.menu.categories[props.pageMode.categoryIndex || 0].menu_items.map(el => (
            <MenuItemCard
              item={el}
              isSelected={el.id === selectedMenuItemId}
              selectedItemId={selectedMenuItemId}
              setSelectedItemId={setSelectedMenuItemId}
              categoryIndex={props.pageMode.categoryIndex || 0}
              setItemQuantity={props.setItemQuantity}
              key={el.id}
            />
          ))}
        </div>
      </div>
    </div>
  )

}
