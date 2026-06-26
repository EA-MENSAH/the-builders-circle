import { supabase } from './supabase'

// Normalizes Supabase rows to the shapes the existing screens already expect,
// so components/`memberById` keep working unchanged.

function relTime(ts) {
  if (!ts) return 'now'
  const s = Math.max(1, Math.floor((Date.now() - new Date(ts).getTime()) / 1000))
  if (s < 60) return 'now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return `${Math.floor(d / 7)}w`
}

const initials = (name = '') =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '··'

export function mapProfile(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    profession: row.profession || '',
    location: row.location || '',
    expertise: row.expertise || [],
    building: row.building || '',
    canHelp: row.can_help || '',
    archetype: row.archetype || null,
    initials: row.initials || initials(row.name),
    accent: row.accent || '#CFA646',
    founder: !!row.founder,
    joinedStage: row.joined_stage || 'Participate',
  }
}

const warn = (label, error) => error && console.warn(`[db] ${label}:`, error.message)

// ---- profiles --------------------------------------------------------------
export async function getProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at')
  warn('getProfiles', error)
  return (data || []).map(mapProfile)
}

export async function getMyProfile(uid) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
  warn('getMyProfile', error)
  return mapProfile(data)
}

export async function updateProfile(uid, patch) {
  const row = {
    name: patch.name,
    role: patch.role,
    profession: patch.profession,
    location: patch.location,
    expertise: patch.expertise,
    building: patch.building,
    can_help: patch.canHelp,
    archetype: patch.archetype,
    initials: patch.initials,
  }
  Object.keys(row).forEach((k) => row[k] === undefined && delete row[k])
  const { error } = await supabase.from('profiles').update(row).eq('id', uid)
  warn('updateProfile', error)
}

// ---- feed ------------------------------------------------------------------
export async function getFeed() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, cheers(count), comments(count)')
    .order('created_at', { ascending: false })
  warn('getFeed', error)
  return (data || []).map((r) => ({
    id: r.id,
    authorId: r.author_id,
    type: r.type,
    body: r.body,
    time: relTime(r.created_at),
    cheers: r.cheers?.[0]?.count ?? 0,
    comments: r.comments?.[0]?.count ?? 0,
  }))
}

export async function addPost(uid, type, body) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ author_id: uid, type, body })
    .select()
    .single()
  warn('addPost', error)
  if (!data) return null
  return { id: data.id, authorId: uid, type, body, time: 'now', cheers: 0, comments: 0 }
}

export async function getComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at')
  warn('getComments', error)
  return (data || []).map((r) => ({ id: r.id, authorId: r.author_id, body: r.body, time: relTime(r.created_at) }))
}

export async function addComment(uid, postId, body) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: uid, body })
    .select()
    .single()
  warn('addComment', error)
  return data ? { id: data.id, authorId: uid, body, time: 'now' } : null
}

export async function getCheered(uid) {
  const { data, error } = await supabase.from('cheers').select('post_id').eq('user_id', uid)
  warn('getCheered', error)
  return Object.fromEntries((data || []).map((r) => [r.post_id, true]))
}

export async function setCheer(uid, postId, on) {
  const { error } = on
    ? await supabase.from('cheers').insert({ post_id: postId, user_id: uid })
    : await supabase.from('cheers').delete().match({ post_id: postId, user_id: uid })
  warn('setCheer', error)
}

// ---- events / rsvps --------------------------------------------------------
export async function getEvents() {
  const [{ data: events, error: e1 }, { data: rsvps, error: e2 }] = await Promise.all([
    supabase.from('events').select('*').order('date'),
    supabase.from('rsvps').select('*'),
  ])
  warn('getEvents', e1)
  warn('getEvents.rsvps', e2)
  const byEvent = {}
  ;(rsvps || []).forEach((r) => (byEvent[r.event_id] = byEvent[r.event_id] || []).push(r.user_id))
  return (events || []).map((r) => ({
    id: r.id,
    title: r.title,
    kind: r.kind,
    pillar: r.pillar,
    date: r.date,
    time: r.time,
    duration: r.duration,
    mode: r.mode,
    location: r.location,
    host: r.host_name,
    going: byEvent[r.id] || [],
    description: r.description,
    blurb: r.blurb,
  }))
}

export async function getRsvps(uid) {
  const { data, error } = await supabase.from('rsvps').select('event_id').eq('user_id', uid)
  warn('getRsvps', error)
  return Object.fromEntries((data || []).map((r) => [r.event_id, true]))
}

export async function setRsvp(uid, eventId, on) {
  const { error } = on
    ? await supabase.from('rsvps').insert({ event_id: eventId, user_id: uid })
    : await supabase.from('rsvps').delete().match({ event_id: eventId, user_id: uid })
  warn('setRsvp', error)
}

// ---- assessment ------------------------------------------------------------
export async function getAssessment(uid) {
  const { data, error } = await supabase.from('builder_profiles').select('*').eq('user_id', uid).maybeSingle()
  warn('getAssessment', error)
  if (!data) return null
  return {
    scores: data.scores,
    primary: data.primary_archetype,
    secondary: data.secondary_archetype,
    contributionStyle: data.contribution_style,
    growthAreas: data.growth_areas || [],
    completedAt: data.completed_at,
  }
}

export async function saveAssessment(uid, p) {
  const { error } = await supabase.from('builder_profiles').upsert({
    user_id: uid,
    scores: p.scores,
    primary_archetype: p.primary,
    secondary_archetype: p.secondary,
    contribution_style: p.contributionStyle,
    growth_areas: p.growthAreas,
    completed_at: p.completedAt,
  })
  warn('saveAssessment', error)
}
