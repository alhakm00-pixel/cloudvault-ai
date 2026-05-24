// ─── CloudVault API Client ────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

// Token helpers (client-side only)
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('cv_access_token')
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem('cv_access_token', access)
  localStorage.setItem('cv_refresh_token', refresh)
}

function clearTokens() {
  localStorage.removeItem('cv_access_token')
  localStorage.removeItem('cv_refresh_token')
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  retried = false,
): Promise<T> {
  const token = getToken()
  const headers = new Headers(options.headers)

  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // Auto-refresh on 401
  if (res.status === 401 && !retried) {
    const refreshToken = localStorage.getItem('cv_refresh_token')
    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      if (refreshRes.ok) {
        const { data } = await refreshRes.json()
        setTokens(data.accessToken, data.refreshToken)
        return apiFetch<T>(path, options, true)
      }
    }
    clearTokens()
    if (typeof window !== 'undefined') window.location.href = '/auth/login'
    throw new Error('Session expired')
  }

  const json = await res.json()
  if (!res.ok) throw new Error(json.message ?? `HTTP ${res.status}`)
  return json
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  async register(name: string, email: string, password: string) {
    const res = await apiFetch<{ data: { user: any; accessToken: string; refreshToken: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ name, email, password }) },
    )
    setTokens(res.data!.accessToken, res.data!.refreshToken)
    return res.data
  },

  async login(email: string, password: string) {
    const res = await apiFetch<{ data: { user: any; accessToken: string; refreshToken: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
    )
    setTokens(res.data!.accessToken, res.data!.refreshToken)
    return res.data
  },

  async logout() {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {})
    clearTokens()
  },

  async getMe() {
    return apiFetch<{ data: any }>('/auth/me').then((r) => (r as any).data)
  },

  async updateProfile(data: { name?: string; avatar?: string }) {
    return apiFetch<{ data: any }>('/auth/me', { method: 'PATCH', body: JSON.stringify(data) })
      .then((r) => (r as any).data)
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return apiFetch('/auth/me/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  },
}

// ─── Files API ────────────────────────────────────────────────────────────────
export const filesApi = {
  async list(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(params).toString()
    return apiFetch<{ data: any[]; meta: any }>(`/files${qs ? `?${qs}` : ''}`)
      .then((r: any) => ({ files: r.data, meta: r.meta }))
  },

  async get(id: string) {
    return apiFetch<{ data: any }>(`/files/${id}`).then((r: any) => r.data)
  },

  async update(id: string, data: { name?: string; tags?: string[]; folderId?: string }) {
    return apiFetch<{ data: any }>(`/files/${id}`, {
      method: 'PATCH', body: JSON.stringify(data),
    }).then((r: any) => r.data)
  },

  async toggleStar(id: string) {
    return apiFetch<{ data: any }>(`/files/${id}/star`, { method: 'PATCH' })
      .then((r: any) => r.data)
  },

  async softDelete(id: string) {
    return apiFetch(`/files/${id}/soft`, { method: 'DELETE' })
  },

  async permanentDelete(id: string) {
    return apiFetch(`/files/${id}`, { method: 'DELETE' })
  },

  async restore(id: string) {
    return apiFetch(`/files/${id}/restore`, { method: 'PATCH' })
  },

  async bulkDelete(ids: string[], permanent = false) {
    return apiFetch('/files/bulk-delete', {
      method: 'POST', body: JSON.stringify({ ids, permanent }),
    })
  },

  async getPresignedUrl(id: string): Promise<string> {
    const r: any = await apiFetch(`/files/${id}/presign`)
    return r.data.url
  },

  async getStats() {
    return apiFetch<{ data: any }>('/files/stats').then((r: any) => r.data)
  },

  getDownloadUrl(id: string) {
    const token = getToken()
    return `${BASE_URL}/files/${id}/download?token=${token}`
  },

  getStreamUrl(id: string) {
    return `${BASE_URL}/files/${id}/stream`
  },
}

// ─── Upload API ───────────────────────────────────────────────────────────────
export const uploadApi = {
  // ── Chunked upload (large files) ──────────────────────────────────────────
  async uploadFile(
    file: File,
    options: {
      folderId?: string
      onProgress?: (pct: number, speed: number, eta: number) => void
      onComplete?: (fileData: any) => void
      onError?: (err: Error) => void
      signal?: AbortSignal
    } = {},
  ) {
    const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB

    // Use simple upload for small files
    if (file.size <= CHUNK_SIZE) {
      return uploadApi.simpleUpload(file, options)
    }

    // 1. Init session
    const initRes: any = await apiFetch('/uploads/init', {
      method: 'POST',
      body: JSON.stringify({
        fileName:   file.name,
        mimeType:   file.type || 'application/octet-stream',
        totalSize:  file.size,
        chunkSize:  CHUNK_SIZE,
        folderId:   options.folderId,
      }),
    })
    const { sessionId, totalChunks } = initRes.data

    const parts: { ETag: string; PartNumber: number }[] = []
    let   uploadedBytes = 0
    const startTime     = Date.now()

    // 2. Upload chunks
    for (let i = 0; i < totalChunks; i++) {
      if (options.signal?.aborted) throw new Error('Upload cancelled')

      const start  = i * CHUNK_SIZE
      const end    = Math.min(start + CHUNK_SIZE, file.size)
      const chunk  = file.slice(start, end)
      const buffer = await chunk.arrayBuffer()

      const form = new FormData()
      form.append('chunk', new Blob([buffer]), `chunk-${i}`)
      form.append('sessionId', sessionId)
      form.append('chunkIndex', String(i))
      form.append('totalChunks', String(totalChunks))

      const chunkRes: any = await apiFetch('/uploads/chunk', {
        method: 'POST',
        body: form,
        headers: {},  // let browser set multipart boundary
      })

      parts.push({ ETag: chunkRes.data.etag, PartNumber: i + 1 })
      uploadedBytes += (end - start)

      // Progress
      const elapsed = (Date.now() - startTime) / 1000
      const speed   = uploadedBytes / elapsed
      const remaining = file.size - uploadedBytes
      const eta     = remaining / speed

      options.onProgress?.(chunkRes.data.progress, speed, eta)
    }

    // 3. Complete
    const completeRes: any = await apiFetch('/uploads/complete', {
      method: 'POST',
      body: JSON.stringify({ sessionId, parts }),
    })

    options.onComplete?.(completeRes.data.file)
    return completeRes.data
  },

  // ── Simple upload (small files) ───────────────────────────────────────────
  async simpleUpload(
    file: File,
    options: { folderId?: string; onProgress?: (pct: number) => void; onComplete?: (f: any) => void } = {},
  ) {
    return new Promise<any>((resolve, reject) => {
      const form = new FormData()
      form.append('file', file)
      if (options.folderId) form.append('folderId', options.folderId)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', `${BASE_URL}/uploads/simple`)

      const token = getToken()
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          options.onProgress?.(Math.round((e.loaded / e.total) * 100))
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const res = JSON.parse(xhr.responseText)
          options.onComplete?.(res.data.file)
          resolve(res.data)
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('Network error during upload'))
      xhr.send(form)
    })
  },

  async getStatus(sessionId: string) {
    return apiFetch<{ data: any }>(`/uploads/${sessionId}/status`).then((r: any) => r.data)
  },

  async abort(sessionId: string) {
    return apiFetch(`/uploads/${sessionId}`, { method: 'DELETE' })
  },
}

// ─── Share API ────────────────────────────────────────────────────────────────
export const shareApi = {
  async create(fileId: string, options: {
    type?: 'VIEW' | 'DOWNLOAD' | 'EDIT'
    password?: string
    expiresIn?: number
    maxDownloads?: number
  } = {}) {
    return apiFetch<{ data: { share: any; shareUrl: string } }>(
      `/share/files/${fileId}/share`,
      { method: 'POST', body: JSON.stringify(options) },
    ).then((r: any) => r.data)
  },

  async getShared(token: string, password?: string) {
    return apiFetch<{ data: any }>(
      `/share/${token}`,
      password ? { method: 'POST', body: JSON.stringify({ password }) } : {},
    ).then((r: any) => r.data)
  },

  async listMyLinks() {
    return apiFetch<{ data: any[] }>('/share/me/links').then((r: any) => r.data)
  },

  async revoke(shareId: string) {
    return apiFetch(`/share/links/${shareId}`, { method: 'DELETE' })
  },
}

// ─── Folders API ──────────────────────────────────────────────────────────────
export const foldersApi = {
  async list(parentId?: string) {
    const qs = parentId ? `?parentId=${parentId}` : ''
    return apiFetch<{ data: any[] }>(`/folders${qs}`).then((r: any) => r.data)
  },

  async create(name: string, parentId?: string, color?: string, icon?: string) {
    return apiFetch<{ data: any }>('/folders', {
      method: 'POST', body: JSON.stringify({ name, parentId, color, icon }),
    }).then((r: any) => r.data)
  },

  async update(id: string, data: Partial<{ name: string; color: string; icon: string }>) {
    return apiFetch<{ data: any }>(`/folders/${id}`, {
      method: 'PATCH', body: JSON.stringify(data),
    }).then((r: any) => r.data)
  },

  async delete(id: string) {
    return apiFetch(`/folders/${id}`, { method: 'DELETE' })
  },
}

// ─── Notifications API ────────────────────────────────────────────────────────
export const notificationsApi = {
  async list(params: { page?: number; limit?: number; unreadOnly?: boolean } = {}) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    ).toString()
    return apiFetch<{ data: any }>(`/notifications${qs ? `?${qs}` : ''}`).then((r: any) => r.data)
  },

  async markRead(id: string) {
    return apiFetch(`/notifications/${id}`, { method: 'PATCH' })
  },

  async markAllRead() {
    return apiFetch('/notifications/all', { method: 'PATCH' })
  },

  async delete(id: string) {
    return apiFetch(`/notifications/${id}`, { method: 'DELETE' })
  },
}

export { getToken, setTokens, clearTokens }

// ─── AI API ───────────────────────────────────────────────────────────────────
export const aiApi = {
  async generateSubtitles(fileId: string, options: { language?: string; translate?: boolean } = {}) {
    return apiFetch(`/ai/files/${fileId}/subtitles`, {
      method: 'POST', body: JSON.stringify(options),
    })
  },

  async getSubtitles(fileId: string) {
    return apiFetch<{ data: any }>(`/ai/files/${fileId}/subtitles`).then((r: any) => r.data)
  },

  async getSubtitleFile(subtitleId: string): Promise<string> {
    const token = getToken()
    const res   = await fetch(`${BASE_URL}/ai/subtitles/${subtitleId}/file`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return res.text()
  },

  async generateSummary(fileId: string, language = 'ar') {
    return apiFetch(`/ai/files/${fileId}/summary`, {
      method: 'POST', body: JSON.stringify({ language }),
    })
  },

  async searchInFile(fileId: string, query: string) {
    return apiFetch<{ data: any }>(`/ai/files/${fileId}/search?query=${encodeURIComponent(query)}`)
      .then((r: any) => r.data)
  },

  async smartSearch(q: string, limit = 20) {
    return apiFetch<{ data: any }>(`/ai/search?q=${encodeURIComponent(q)}&limit=${limit}`)
      .then((r: any) => r.data)
  },

  async chat(fileId: string, message: string, history: { role: string; content: string }[] = []) {
    return apiFetch<{ data: { reply: string } }>(`/ai/files/${fileId}/chat`, {
      method: 'POST', body: JSON.stringify({ message, history }),
    }).then((r: any) => r.data)
  },

  async getStatus(fileId: string) {
    return apiFetch<{ data: any }>(`/ai/files/${fileId}/status`).then((r: any) => r.data)
  },
}
