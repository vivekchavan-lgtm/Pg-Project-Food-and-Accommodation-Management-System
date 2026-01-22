

import React from 'react'

export default function AdminStatsCard({ title, value, subtitle }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>{value}</div>
      {subtitle && <div className="small" style={{ marginTop: 6 }}>{subtitle}</div>}
    </div>
  )
}
