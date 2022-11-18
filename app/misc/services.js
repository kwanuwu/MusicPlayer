export const zing = async (props) => {
    const { action, param } = props
    try {
      const response = await fetch(
        `http://192.168.1.9:5000/api/${action}?${
          action === 'search' ? 'keyword' : 'id'
        }=${param}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then((res) => res.json())
      return response
    } catch (error) {
      console.log('Error inside zing: ', error)
    }
  }