class MouseListener {
  constructor() {
    document.addEventListener('mousemove', (e) => {
      this.x = e.pageX
      this.y = e.pageY
    })
  }

  getMouseX() {
    return this.x
  }

  getMouseY() {
    return this.y
  }
}

export default MouseListener
