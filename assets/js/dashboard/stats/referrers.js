import React from 'react';
import { Link } from 'react-router-dom'

import Bar from './bar'
import MoreLink from './more-link'
import numberFormatter from '../number-formatter'
import * as api from '../api'

export default class Referrers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {loading: true}
  }

  componentDidMount() {
    this.fetchReferrers()
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.setState({loading: true, referrers: null})
      this.fetchReferrers()
    }
  }

  fetchReferrers() {
    api.get(`/api/stats/${this.props.site.domain}/referrers`, this.props.query)
      .then((res) => this.setState({loading: false, referrers: res}))
  }

  renderReferrer(referrer) {
    return (
      <React.Fragment key={referrer.name}>
        <div className="flex items-center justify-between text-sm">
          <Link className="hover:underline truncate" style={{maxWidth: '80%'}} to={`/${this.props.site.domain}/referrers/${referrer.name}${window.location.search}`}>{ referrer.name }</Link>
          <span>{numberFormatter(referrer.count)}</span>
        </div>
        <Bar count={referrer.count} all={this.state.referrers} color="blue" />
      </React.Fragment>
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="stats-item bg-white shadow-md rounded p-4" style={{height: '424px'}}>
          <div className="loading my-32 mx-auto"><div></div></div>
        </div>
      )
    } else if (this.state.referrers) {
      return (
        <div className="stats-item bg-white shadow-md rounded p-4" style={{height: '424px'}}>
          <h3>Top Referrers</h3>
          <div className="flex items-center mt-4 mb-3 justify-between text-grey-dark text-xs font-bold tracking-wide">
            <span>REFERRER</span>
            <span>VISITORS</span>
          </div>
          { this.state.referrers.map(this.renderReferrer.bind(this)) }
          <MoreLink site={this.props.site} list={this.state.referrers} endpoint="referrers" />
        </div>
      )
    }
  }
}
