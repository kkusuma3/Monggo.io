import PubNub from 'pubnub'

export const pubnub = new PubNub({
  publishKey: 'pub-c-01f8749e-b8a0-41ac-8d7c-fb29016dd8b6',
  subscribeKey: 'sub-c-9237db72-2e69-11ea-894a-b6462cb07a90'
})

export const notifyMe = message => {
  if ('Notification' in window) {
    const ask = Notification.requestPermission()
    ask.then(permission => {
      if (permission === 'granted' && message) {
        const msg = new Notification(message.content.message.title, {
          body: message.content.message.body,
          icon: '/icon.png'
        })
        msg.addEventListener('click', event => {
          window.focus()
          msg.close()
        })
      }
    })
  }
}
