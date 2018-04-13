import 'app/Viewer/scss/conversion_base.scss';
import 'app/Viewer/scss/document.scss';

import { setOptions, Document as PDF } from 'react-pdf';
import Page from '../../PDF/components/Page.js';
import React, { Component } from 'react';

import { APIURL } from '../../config.js';

setOptions({
  workerSrc: '/pdf.worker.js'
});

export class Document extends Component {

  state = {
    numPages: null,
  }

  onDocumentLoadSuccess = ({ numPages }) =>
    this.setState({
      numPages,
    })

  render() {
    if (!this.props.doc) {
      return false;
    }

    if(!this.props.doc.get('_id')) {
      return false;
    }

    const { numPages } = this.state;
    const doc = this.props.doc.toJS();
    const file=`${APIURL}documents/download?_id=${doc._id}`
    const options = {};

    const Header = this.props.header || function () {
      return false;
    };

    return (
      <div>
        <div className={`_${doc._id} document ${this.props.className}`} >
          <Header/>
          <PDF
            file={file}
            onLoadSuccess={this.onDocumentLoadSuccess}
            options={options}
          >
            {
              Array.from(
                new Array(numPages),
                (el, index) => (
                  <Page
                    width={816}
                    height={1056}
                    renderAnnotations={false}
                    pageNumber={index + 1}
                    key={`page_${index + 1}`}
                  />
                ),
              )
            }
          </PDF>
        </div>
      </div>
    );
  }
}

Document.defaultProps = {
};

Document.propTypes = {
};

export default Document;
