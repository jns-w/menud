import React, {useEffect, useRef, useState} from 'react';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {MenuItem} from "../../../types/menu-types.ts";

type MenuItemCardProps = {
  item: MenuItem
  isSelected: boolean
  selectedItemId: string
  setSelectedItemId: (id: string) => void
  categoryIndex: number
  setItemQuantity: (categoryIndex: number, itemId: string, quantity: number) => void
}

export default function MenuItemCard(props: MenuItemCardProps) {
  const {item, isSelected, selectedItemId, setSelectedItemId} = props;
  const [descriptionHeight, setDescriptionHeight] = useState(0);

  const titleDescriptionDivRef = useRef<HTMLDivElement>(null)

  function toggleSelectedItem(id: string) {
    if (selectedItemId === id) {
      setSelectedItemId('');
    } else {
      setSelectedItemId(id);
    }
  }

  useEffect(() => {
    if (!titleDescriptionDivRef.current) return
    setDescriptionHeight(titleDescriptionDivRef.current.clientHeight)
  }, [titleDescriptionDivRef])


  return (
    <div className="menuitem-wrapper">
      <div
        className="menuitem-card"
        style={isSelected ? {height: `${descriptionHeight + 100}px`} : {}}
        key={item.name}
      >
        <img src={item.image_url} alt=""/>
        <div
          className="menuitem-info"
          role="menuitem"
          onClick={() => {
            if (!item.description) return;
            toggleSelectedItem(item.id)
          }}
        >
          <div
            ref={titleDescriptionDivRef}
            className="menuitem-title-description-div">
            <h4>{item.name}</h4>
            <div
              className="menuitem-description-div">
              <p style={isSelected ? {opacity: `1`} : {}}>
                {item.description}
              </p>
            </div>
          </div>
          <div className="weight-price-div">
            <p>250g</p>
            <h6>
              ${item.price}
              {item.price_suffix}
            </h6>
          </div>
        </div>
        <div className="menuitem-quantity-div">
          <div
            className="fa-icon-div"
            onClick={() => {
              props.setItemQuantity(props.categoryIndex, item.id, item.quantity ?  item.quantity + 1 : 1)
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="fa-icon plus"/>
          </div>
          <div className="quantiy-count">
            <h6>{item.quantity ? item.quantity : 0}</h6>
          </div>

          <div
            className="fa-icon-div"
            onClick={() => {
              props.setItemQuantity(props.categoryIndex, item.id, Math.max(item.quantity ? item.quantity - 1 : 0, 0))
            }}
          >
            <FontAwesomeIcon icon={faMinus} className="fa-icon minus"/>
          </div>
        </div>
      </div>
    </div>
  );
}
