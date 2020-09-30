import React from 'react'
import ReactDOM from 'react-dom'
import './search.less'
import logo from './images/logo.png'
import { common } from '../../../common'
import { a } from './tree-sharking'
class Search extends React.Component {

  constructor() {
    super(...arguments)
    this.state = {
      Dynamic: null
    }
  }

  loadComponet = () => {
    // import() 返回的是一个 Promise 对象
    import('./dynamic-import.js').then((res) => {
      console.log("wtah", res)
      this.setState({
        Dynamic: res.default
      })
    })
  }

  render() {
    const { Dynamic } = this.state
    return (
      <div className='search-text'>
        {
          Dynamic ? <Dynamic /> : null
        }
        <img src={logo} onClick={this.loadComponet} />
        Search 内容？？改变一下 让 contenthash改变
        { common() }
        <div>{a()}</div>
      </div>
    )
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
)
