// components/DatabaseCard.tsx
'use client'

import Link from 'next/link'

type DatabaseCardProps = {
  title: string
  description: string
  count: number
  href: string
  icon: string
  bgColor: string
}

export default function DatabaseCard({
  title,
  description,
  count,
  href,
  icon,
  bgColor,
}: DatabaseCardProps) {
  return (
    <Link href={href}>
      <div
        className={`p-6 rounded-lg border border-gray-100 hover:shadow-md transition cursor-pointer ${bgColor}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-2xl mb-2">{icon}</p>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <span className="text-2xl font-bold text-gray-300">{count}</span>
        </div>
      </div>
    </Link>
  )
}
