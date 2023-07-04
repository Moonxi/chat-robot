var FieldValidation = (function () {
  class FieldValidation {
    /**
     * 构造器
     * @param {string} inputId 文本框ID
     * @param {Function} rule 验证规则函数
     */
    constructor(inputId, rule) {
      this.input = $('#' + inputId)
      this.p = this.input.nextElementSibling
      this.rule = rule
      this.input.onblur = () => {
        this.validate()
      }
    }
    async validate() {
      const err = await this.rule(this.input.value)
      if (!err) {
        this.p.innerHTML = ''
        return true
      }
      this.p.innerHTML = err
      return false
    }
    static async validate(...validators) {
      const results = validators.map(v => v.validate())
      const res = await Promise.all(results)
      return res.every(r => r)
    }
  }
  return FieldValidation
})()
