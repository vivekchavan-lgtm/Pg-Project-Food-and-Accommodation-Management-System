
import React, { useState } from 'react'

export default function EditableRow({ item, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState({ name: item.name, type: item.type, price: item.price })

  return (
    <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'center', padding:'8px 0', borderBottom:'1px dashed #eee'}}>
      <div style={{flex:1}}>
        <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <div style={{display:'flex', gap:8, marginTop:6}}>
          <input className="input" value={form.type} onChange={e=>setForm({...form, type:e.target.value})} />
          <input type="number" className="input" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} />
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        <button className="btn-primary" onClick={() => onSave(item.id, form)}>Save</button>
        <div style={{display:'flex', gap:8}}>
          <button className="btn-link" onClick={onCancel}>Cancel</button>
          <button className="btn-link" onClick={() => onDelete(item.id)}>Delete</button>
        </div>
      </div>
    </div>
  )
}
