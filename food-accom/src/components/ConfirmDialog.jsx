import React from 'react'

export default function ConfirmDialog({ open, title='Are you sure?', onCancel, onConfirm, children }) {
  if(!open) return null
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1200
    }}>
      <div className="card" style={{ width:420 }}>
        <h3 style={{marginTop:0}}>{title}</h3>
        <div style={{marginTop:8}}>{children}</div>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:12}}>
          <button className="btn-link" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
