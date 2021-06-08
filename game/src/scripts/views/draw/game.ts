class GameClient {
  ws:WebSocket = null;

  constructor(url:string) {
    if("WebSocket" in window) {
      this.ws = new WebSocket(url);
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onclose = this.onClose.bind(this);
      this.ws.onerror = this.onError.bind(this);
    } else {
      console.error("您的浏览器不支持WebSocket");
    }
  }

  onOpen() {
    console.log("[WS] 房间已连接")
    this.ws.send("hello world")
  }

  onMessage(e:MessageEvent) {
    console.log(e.data)
  }

  onClose(e:Event) {
    console.log("[WS] 连接断开")
    console.log(this.ws.readyState)
  }

  onError(e:Event) {
    console.error("[WS] 连接出现错误：" + e)
  }

}

export default GameClient;
