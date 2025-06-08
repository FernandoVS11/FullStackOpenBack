const Notification = ({ message }) => {
  if (message === null) return null

  const style = {
    color: message.type === 'error' ? 'red' : 'green',
    background: '#eee',
    fontSize: 20,
    border: `2px solid ${message.type === 'error' ? 'red' : 'green'}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  }

  return <div style={style}>{message.text}</div>
}

export default Notification
