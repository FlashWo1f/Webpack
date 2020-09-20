import React from 'react'
import ReactDOM from 'react-dom'
import './search.less'
import logo from './images/logo.png'
class Search extends React.Component {
  render() {
    return <div className='search-text'>
      <img src={logo} />
      Search 内容？？改变一下 让 contenthash改变</div>
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
)
