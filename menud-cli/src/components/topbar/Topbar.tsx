import React from 'react';
import {faHome, faTasks} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {PageMode} from "../../App.tsx";

type TopbarProps = {
  setPageMode: (mode: PageMode) => void
}

function Topbar(props: TopbarProps) {

  function returnHome() {
    // @ts-expect-error partial state update
    props.setPageMode(prev => ({...prev, is: 'categories'}));
  }

  return (
    <div className="topbar">
      <div
        className="topbar-buttons-wrapper"
        onTouchEnd={returnHome}
        onClick={returnHome}
      >
        <FontAwesomeIcon icon={faHome} className="fa-home"/>
      </div>
      <div className="topbar-buttons-wrappero">
        <FontAwesomeIcon icon={faTasks} className="fa-shopping"/>
      </div>
    </div>
  );
}


export default Topbar;
