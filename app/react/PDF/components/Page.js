import { Page as PDFPage } from 'react-pdf';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const style = { height: 1100 };
class Page extends Component {
  state = {
    shouldRender: false,
  }

  componentDidMount() {
    this.scrollCallback = this.scroll.bind(this);

    if (this.pageContainer && this.pageShouldRender()) {
      this.setState({shouldRender: true})
    }

    document.querySelector('.document-viewer').addEventListener('scroll', this.scrollCallback);
  }

  componentWillUnmount() {
    document.querySelector('.document-viewer').removeEventListener('scroll', this.scrollCallback);
  }

  scroll() {
    this.setState({shouldRender: this.pageShouldRender()})
  }

  pageShouldRender() {
    const el = this.pageContainer;
    const rect = el.getBoundingClientRect();
    const vWidth = window.innerWidth || document.documentElement.clientWidth;
    const vHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.right < 0 || rect.bottom < -500 || rect.left > vWidth || rect.top > vHeight + 500) {
      return false;
    }

    return true;
  }

  render() {
    console.log(`page-${this.props.pageNumber}`);
    return (
      <div id={`page-${this.props.pageNumber}`} className="doc-page" ref={(ref) => { this.pageContainer = ref; }} style={style}>
        {this.state.shouldRender && <PDFPage {...this.props}/>}
      </div>
    );
  }
}

Page.propTypes = {
  pageNumber: PropTypes.number.isRequired
};

export default Page;
