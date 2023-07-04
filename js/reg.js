;(function () {
  const doms = {
    userForm: $('.user-form')
  }
  function init() {
    // 创建验证器
    const loginIdValidator = new FieldValidation('txtLoginId', async val => {
      if (!val) {
        return '请填写账号'
      }
      const { exists } = API
      const { data } = await exists(val)
      return data ? '账号已存在' : ''
    })
    const nickNameValidator = new FieldValidation('txtNickname', async val => {
      if (!val) {
        return '请填写昵称'
      }
      return ''
    })
    const loginPwdValidator = new FieldValidation('txtLoginPwd', async val => {
      if (!val) {
        return '请填写密码'
      }
      return ''
    })
    const loginPwdConfirmValidator = new FieldValidation('txtLoginPwdConfirm', async val => {
      if (!val) {
        return '请填写确认密码'
      }
      if (val !== loginPwdValidator.input.value) {
        return '两次密码不一致'
      }
      return ''
    })
    const validators = [loginIdValidator, nickNameValidator, loginPwdValidator, loginPwdConfirmValidator]
    return validators
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
      const { reg } = API
      const regInfo = Object.fromEntries(new FormData(doms.userForm).entries())
      const resp = await reg(regInfo)
      if (resp.code === 0) {
        alert('注册成功，点击跳转至登录界面')
        location.href = './login.html'
      } else alert('注册失败：' + resp.msg)
    }
  }
  main()
})()
