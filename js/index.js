;(function () {
  const { profile, sendChat, getHistory, logout, sendGPT } = API
  // 切换GPT
  let isGPT = false
  // 获取需要操作的dom元素
  const doms = {
    nickname: $('#nickname'),
    loginId: $('#loginId'),
    chatContainer: $('.chat-container'),
    msgContainer: $('.msg-container'),
    txtMsg: $('#txtMsg'),
    close: $('.close'),
    mainGPT: $('.main-gpt')
  }
  function init() {
    loadProfile()
    loadHistory()
  }
  // 获取当前用户信息并加载
  async function loadProfile() {
    const resp = await profile()
    if (resp.code !== 0) {
      alert(resp.msg)
      location.href = './login.html'
      return
    }
    // 不能用innerHTML，有安全隐患
    doms.nickname.innerText = resp.data.nickname
    doms.loginId.innerText = resp.data.loginId
  }
  // 获取聊天历史记录并加载
  async function loadHistory() {
    const resp = await getHistory()
    if (resp.code !== 0) {
      alert(resp.msg)
      location.href = './login.html'
      return
    }
    doms.chatContainer.innerHTML = ''
    const html = resp.data
      .map(
        item => `          <div class="chat-item ${item.from === null ? '' : 'me'}">
    <img class="chat-avatar" src="./asset/${item.from === null ? 'robot-avatar.jpg' : 'avatar.png'}" />
    <div class="chat-content">${item.content}</div>
    <div class="chat-date">${new Date(item.createdAt).toLocaleString()}</div>
  </div>`
      )
      .join('')
    doms.chatContainer.innerHTML = html
    doms.chatContainer.scrollTo({ top: doms.chatContainer.scrollHeight, behavior: 'smooth' })
  }
  // 创建并添加聊天消息
  function createItem(content, date, isMe = false) {
    const item = $$$('div')
    item.className = isMe ? 'chat-item me' : 'chat-item'
    item.innerHTML = `<img class="chat-avatar" src="./asset/${isMe ? 'avatar.png' : 'robot-avatar.jpg'}" />
      <div class="chat-content">${content}</div>
      <div class="chat-date">${date.toLocaleString()}</div>`
    doms.chatContainer.append(item)
    doms.chatContainer.scrollTo({ top: doms.chatContainer.scrollHeight, behavior: 'smooth' })
    return item
  }

  function main() {
    init()
    // 交互事件
    // 发送消息
    doms.msgContainer.onsubmit = async e => {
      e.preventDefault()
      // 用户写的content需要经过处理，否则有安全隐患，这里就简单处理了
      const content = doms.txtMsg.value.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      if (!content) {
        return
      }
      createItem(content, new Date(), true)
      doms.txtMsg.value = ''
      if (isGPT) {
        try {
          const resp = await sendGPT(content)
          createItem(resp.choices[0].message.content, new Date(resp.created * 1000))
          return
        } catch (err) {
          isGPT = false
          doms.mainGPT.innerHTML = isGPT ? '切换为聊天机器人' : '切换为GPT'
          createItem(`GPT连接超时，自动切换为聊天机器人`, new Date())
        }
      }
      const resp = await sendChat(content.trim())
      if (resp.code !== 0) {
        alert(resp.msg)
        location.href = './login.html'
        return
      }
      createItem(resp.data.content, new Date(resp.data.createdAt))
    }
    // 退出登录
    doms.close.onclick = () => {
      logout()
      alert('退出登录')
      location.href = './login.html'
    }
    // 切换至gpt
    doms.mainGPT.onclick = () => {
      isGPT = !isGPT
      doms.mainGPT.innerHTML = isGPT ? '切换为聊天机器人' : '切换为GPT'
    }
  }
  main()
})()
