class MouseListener {
  constructor() {
    this.x = window.innerWidth / 2
    this.y = window.innerHeight / 2
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
