import './App.scss'
import Home from "./components/home/Home.tsx";
import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";
import Topbar from "./components/topbar/Topbar.tsx";
import axios from "axios";
import {Menu} from "./types/menu-types.ts";
import Cart from "./components/cart/Cart.tsx";
import OrderSuccessModal from "./components/modal/order-success/OrderSuccessModal.tsx";
import {UAParser} from 'ua-parser-js';
import DeviceMessageModal from "./components/modal/device-message/DeviceMessageModal.tsx";
import ErrorPage from "./components/error/ErrorPage.tsx";

export type PageMode = {
  is: string
  categoryIndex?: number
}

export type ModalMode = {
  isOpen: boolean
  content: string
}

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "https://menud-server.capybara.wldspace.com"


function App() {
  const [pageMode, setPageMode] = useState<PageMode>({is: 'categories'})
  const [modal, setModal] = useState<ModalMode>({isOpen: false, content: ''})
  const [menu, setMenu] = useState<Menu | undefined>(undefined)

  const mainRef: MutableRefObject<null | HTMLDivElement> = useRef(null);

  useEffect(() => {
    const uaParser: UAParser = new UAParser();
    if (uaParser.getResult().device.type !== 'mobile') {
      setModal({isOpen: true, content: 'device-message'})
    }
  }, [])

  let backdrop = <div className="backdrop-solid home"/>;
  switch (pageMode.is) {
    case 'menuitems':
      backdrop = <div className="backdrop-solid menuitems"/>;
      break;
    case 'orders':
      backdrop = <div className="backdrop-solid orders"/>;
      break;
    default:
      backdrop = <div className="backdrop-solid home"/>;
      break;
  }

  const getMenu = useCallback(async () => {
    console.log('getting menu from', API_ENDPOINT)
    const data = await axios.get(`${API_ENDPOINT}/api/menu`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error("Error getting menu")
        }
        return res.data
      })
      .catch(err => {
        console.log(err)
        return null
      })
    setMenu(data[0])
  }, [])

  useEffect(() => {
    getMenu()
  }, [getMenu])

  const setItemQuantity = useCallback((categoryIndex: number, itemId: string, quantity: number) => {
    if (!menu) return;
    setMenu(prev => {
      if (!prev) return undefined;
      const newMenu = {...prev}
      newMenu.categories[categoryIndex].menu_items.forEach(item => {
        if (item.id === itemId) {
          item.quantity = quantity
        }
      })
      return newMenu
    })
  }, [menu])


  if (!menu) return <ErrorPage message="Problem loading data, please try again."/>

  return (
    <div
      className={`main-div ${pageMode.is === 'modal' ? 'hidden' : ''}`}
      ref={mainRef}
    >
      {
        modal.isOpen &&
          modal.content === 'order-success' ?
          <OrderSuccessModal
              buttonFn={() => {
                getMenu()
                setModal({isOpen: false, content: ''})
                setPageMode({is: 'categories'})
                if (mainRef.current) {
                  mainRef.current.scrollTo({top: 0, behavior: 'smooth'})
                }
              }}
          /> :
          modal.content === 'device-message' ?
            <DeviceMessageModal
              buttonFn={() => {
                setModal({isOpen: false, content: ''})
              }}
            /> : null
      }
      <Topbar
        setPageMode={setPageMode}
      />
      {backdrop}
      <Home
        mainRef={mainRef}
        menu={menu}
        setItemQuantity={setItemQuantity}
        pageMode={pageMode}
        setPageMode={setPageMode}
      />
      <Cart
        menu={menu}
        setModal={setModal}
        setPageMode={setPageMode}
      />
    </div>
  )
}

export default App
