import React from 'react'
import './Header.css'


function Header() {
  return (
    <div className="header-container">
    <div className="amount">
      <span className="value">63,179.71</span>
      <span className="change-value">+2,161.42 (3.54%)</span>
   
    </div>
    <span className="currency">USD</span>

    <div className="change">
    
    </div>
  </div>

  )
}

export default Header


