class GameManager {
  private nodes: any[] = []
  public add = (node) => {
    this.nodes.push(node)
  }
  public initialize = () => {
    this.nodes.forEach((node) => {
      if (node.sprite) gpm.loadEntity(node.id, node.name, node.sprite)
    })
  }
}
export const ggm = new GameManager()
