import React, {useEffect, useRef, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import {Menu, MenuItem} from "../../types/menu-types.ts";
import {useOnClickOutside} from "usehooks-ts";
import {ModalMode, PageMode} from "../../App.tsx";

type CartProps = {
  menu?: Menu
  setModal: (mode: ModalMode) => void
  setPageMode: (mode: PageMode) => void
}

export default function Cart(props: CartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [updated, setUpdated] = useState(false);

  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!props.menu) return
    for (let i = 0; i < props.menu.categories.length; i++) {
      for (let j = 0; j < props.menu.categories[i].menu_items.length; j++) {
        const item = props.menu.categories[i].menu_items[j];
        // check if item is in cart
        const index = cartItems.findIndex(cartItem => cartItem.id === item.id)
        if (index === -1) {
          if (!item.quantity || item.quantity === 0) continue;
          setCartItems(prev => [...prev, item])
        } else {
          if (!item.quantity || item.quantity === 0) {
            setCartItems(prev => {
              const newCartItems = [...prev]
              newCartItems.splice(index, 1)
              return newCartItems
            })
            continue;
          }
          setCartItems(prev => {
            const newCartItems = [...prev]
            newCartItems[index].quantity = item.quantity
            return newCartItems
          })
        }

      }
    }
  }, [props.menu])

  useOnClickOutside(cartRef, () => setIsExpanded(false))

  useEffect(() => {
    let total = 0;
    let itemCount = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      total += item.price * (item.quantity ? item.quantity : 0)
      itemCount += item.quantity ? item.quantity : 0
    }
    setTotal(total)
    setItemCount(itemCount)
    setUpdated(true)
  }, [cartItems])

  useEffect(() => {
    if (itemCount === 0) return;
    setUpdated(true)
    const timeout = setTimeout(() => {
      setUpdated(false)
    }, 410)
    return () => clearTimeout(timeout)
  }, [itemCount])

  if (!props.menu) return null

  return (
    <div
      ref={cartRef}
      className={`cart-div ${isExpanded ? 'expand' : ''} ${cartItems.length <= 0 ? 'hidden' : ''}`}
    >
      <div
        className="cart-header"
        onClick={() => setIsExpanded(prev => !prev)}
      >
        <div>
          <h4>Shopping Cart</h4>
          <div
            className="cart-item-count-div"
            style={{
              transform: `scale(${itemCount ? 1 : 0})`,
              animation: `${itemCount > 0 && updated ? 'updated 400ms' : ''}`
            }}
          >
            <p
              style={{
                opacity: `${itemCount ? 1 : 0}`,
              }}
            >{itemCount || ""}</p>
          </div>
        </div>
        <FontAwesomeIcon
          icon={faChevronUp}
           className={`fa-arrow ${isExpanded ? 'expand' : ''}`} />
      </div>

      <div className="cart-body">
        {cartItems.map(item => <CartItem item={item} key={item.id} />)}
      </div>

      <div className="cart-footer">
        <div
          className="order-button-div"
          onClick={() => {
            props.setModal({isOpen: true, content: 'order-success'})
            setCartItems([])
            setItemCount(0)
          }}
        >
          <h5>Place Order</h5>
        </div>
        <div className="cart-total-text-div">
          <p>Total: </p> <h5>${Math.round(total * 100)/100 || 0}</h5>
        </div>
      </div>

    </div>
  )
}

type CartItemCardProps = {
    item: MenuItem
}

function CartItem(props: CartItemCardProps) {
  return (
    <div className="cart-item-card">
      <div className="cart-item-name-div">
        <h6>{props.item.name}</h6>
      </div>
      <div className="cart-quantity-price-div">
        <div className="cart-quantity"><p>x{props.item.quantity}</p></div>
        <p>${Math.round(props.item.price * (props.item.quantity ? props.item.quantity : 0)*100)/100}</p>
      </div>
    </div>
  );
}


