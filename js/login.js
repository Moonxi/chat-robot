;(function () {
  const doms = {
    userForm: $('.user-form')
  }
  function init() {
    const loginIdValidator = new FieldValidation('txtLoginId', async val => {
      if (!val) {
        return '请填写账号'
      }

      return ''
    })
    const loginPwdValidator = new FieldValidation('txtLoginPwd', async val => {
      if (!val) {
        return '请填写密码'
      }
      return ''
    })
    return [loginIdValidator, loginPwdValidator]
  }
  function main() {
    const validators = init()
    // 交互事件
    doms.userForm.onsubmit = async e => {
      e.preventDefault()
      const res = await FieldValidation.validate(...validators)
      if (!res) {
        return
      }
      const { login } = API
      const loginInfo = Object.fromEntries(new FormData(doms.userForm).entries())
      const resp = await login(loginInfo)
      if (resp.code === 0) {
        alert('登录成功，点击跳转至首页')
        location.href = './index.html'
      } else {
        validators[0].p.innerHTML = resp.msg
      }
    }
  }
  main()
})()
