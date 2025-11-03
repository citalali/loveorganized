// FILE: components/PartnerBadge.tsx
// LOCATION: Create NEW file at components/PartnerBadge.tsx

type PartnerBadgeProps = {
  partnerEmail?: string | null
  isShared?: boolean
}

export default function PartnerBadge({ partnerEmail, isShared }: PartnerBadgeProps) {
  if (!isShared || !partnerEmail) return null

  return (
    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded inline-flex items-center gap-1">
      👥 {partnerEmail.split('@')[0]}
    </span>
  )
}
