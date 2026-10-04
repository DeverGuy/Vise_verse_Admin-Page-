export type TeamStatus = 'pending' | 'finalized' | 'disqualified'
export type PaymentStatus = 'pending' | 'verified' | 'rejected'
export type QRStatus = 'active' | 'revoked'

export interface Admin {
  id: string
  email: string
  role: string
  created_at: string
}

export interface Team {
  id: string
  name: string
  domain_track: string
  status: TeamStatus
  leader_id: string | null
  created_at: string
  updated_at: string
}

export interface Participant {
  id: string
  name: string
  email: string
  phone: string | null
  team_id: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  team_id: string
  amount: number
  status: PaymentStatus
  proof_url: string
  rejection_reason: string | null
  verified_by: string | null
  created_at: string
  updated_at: string
}

export interface TeamQR {
  id: string
  team_id: string
  token: string
  status: QRStatus
  generated_by: string | null
  created_at: string
}
