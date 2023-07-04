var { $, $$, $$$ } = (function () {
  /**
   *
   * @param {string} selector
   * @returns {Element}
   */
  function $(selector) {
    return document.querySelector(selector)
  }
  /**
   *
   * @param {string} selector
   * @returns {NodeList}
   */
  function $$(selector) {
    return document.querySelectorAll(selector)
  }
  /**
   *
   * @param {string} tagName
   * @returns {HTMLElement}
   */
  function $$$(tagName) {
    return document.createElement(tagName)
  }
  return { $, $$, $$$ }
})()
