import React from 'react'

export default function Modal({ open, title, onClose, children }) {
  if(!open) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.25)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1100 }}>
      <div className="card" style={{ width: 720, maxWidth:'95%' }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3 style={{marginTop:0}}>{title}</h3>
          <button className="btn-link" onClick={onClose}>Close</button>
        </div>
        <div style={{marginTop:8}}>{children}</div>
      </div>
    </div>
  )
}
