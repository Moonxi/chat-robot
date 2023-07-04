var API = (function () {
  const BASE_URL = 'https://study.duyiedu.com'
  const TOKEN_KEY = 'token'
  const OPENAI_API_KEY = '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'

  function get(path) {
    const headers = {}
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      headers['Authorization'] = 'Bearer' + ' ' + token
    }
    return fetch(BASE_URL + path, { headers })
  }
  function post(path, body) {
    const headers = { 'Content-Type': 'application/json' }
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      headers['Authorization'] = 'Bearer' + ' ' + token
    }
    body = JSON.stringify(body)
    return fetch(BASE_URL + path, { method: 'POST', headers, body })
  }
  // 注册
  async function reg(regInfo) {
    const resp = await post('/api/user/reg', regInfo)
    return resp.json()
  }
  // 登录
  async function login(loginInfo) {
    const resp = await post('/api/user/login', loginInfo)
    const result = await resp.json()
    if (result.code === 0) {
      const token = resp.headers.get('Authorization')
      localStorage.setItem(TOKEN_KEY, token)
    }
    return result
  }
  // 验证账号是否存在
  async function exists(loginId) {
    const resp = await get(`/api/user/exists?loginId=${loginId}`)
    return resp.json()
  }
  // 获取当前登录的用户信息
  async function profile() {
    const resp = await get('/api/user/profile')
    return resp.json()
  }
  // 发送聊天消息
  async function sendChat(content) {
    const body = { content }
    const resp = await post('/api/chat', body)
    return resp.json()
  }
  // 获取聊天历史记录
  async function getHistory() {
    const resp = await get('/api/chat/history')
    return resp.json()
  }
  function logout() {
    localStorage.removeItem(TOKEN_KEY)
  }

  // 向gpt-3.5-turbo发送聊天消息
  async function sendGPT(content) {
    const headers = { 'Content-Type': 'application/json' }
    headers['Authorization'] = 'Bearer' + ' ' + OPENAI_API_KEY
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content }]
      })
    })
    return resp.json()
  }
  return { reg, login, exists, profile, sendChat, getHistory, logout, sendGPT }
})()
