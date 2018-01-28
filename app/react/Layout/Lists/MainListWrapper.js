import PropTypes from 'prop-types';
import React, {Component} from 'react';

import SearchBar from 'app/Library/components/SearchBar';

import Loader from 'app/components/Elements/Loader';
import Footer from 'app/App/Footer';
import {NeedAuthorization} from 'app/Auth';
import {t} from 'app/I18N';
import Sort from './ListSortSection';

const loadMoreAmmount = 30;

export default class MainListWrapper extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {loading: false};
    this.loadMoreDocuments = this.loadMoreDocuments.bind(this);
  }

  loadMoreDocuments() {
    this.setState({loading: true});
    this.props.loadMoreDocuments(this.props.documents.get('rows').size + loadMoreAmmount, this.props.storeKey);
  }

  componentWillReceiveProps() {
    this.setState({loading: false});
  }

  render() {
    const {documents, GraphView, view} = this.props;
    //let counter = <span><b>{documents.get('totalRows')}</b> {t('System', 'documents')}</span>;
    //if (connections) {
      //counter = <span>
                  //<b>{connections.totalRows}</b> {t('System', 'connections')}, <b>{documents.get('totalRows')}</b> {t('System', 'documents')}
                //</span>;
    //}

    const Search = this.props.SearchBar;
    const SortSection = this.props.Sort;
    const List = this.props.List;
    const ActionButtons = this.props.ActionButtons ? <div className="search-list-actions"><this.props.ActionButtons /></div> : null;

    return (
      <div className="documents-list">
        <div className="main-wrapper">
          <div className="search-list">
            {ActionButtons}
            <Search storeKey={this.props.storeKey}/>
          </div>
          <SortSection storeKey={this.props.storeKey}/>
          {(() => {
            if (view !== 'graph') {
              return <List storeKey={this.props.storeKey}/>;
            }

            if (view === 'graph') {
              return <GraphView />;
            }
          })()}
          <div className="row">
            <p className="col-sm-12 text-center documents-counter">
                <b>{documents.get('rows').size}</b>
                {` ${t('System', 'of')} `}
                <b>{documents.get('totalRows')}</b>
                {` ${t('System', 'documents')}`}
            </p>
            {(() => {
              if (documents.get('rows').size < documents.get('totalRows') && !this.state.loading) {
                return (
                  <div className="col-sm-12 text-center">
                    <button onClick={this.loadMoreDocuments} className="btn btn-default btn-load-more">
                      {loadMoreAmmount + ' ' + t('System', 'x more')}
                    </button>
                  </div>
                );
              }
              if (this.state.loading) {
                return <Loader/>;
              }

              return null;
            })()}
            <NeedAuthorization>
              <div className="col-sm-12 text-center protip">
                <i className="fa fa-lightbulb-o"></i>
                <b>ProTip!</b>
                <span>Use <span className="protip-key">cmd</span> or <span className="protip-key">shift</span>&nbsp;
                + click to select multiple files.</span>
              </div>
            </NeedAuthorization>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}

MainListWrapper.defaultProps = {
  SearchBar,
  Sort
};

MainListWrapper.propTypes = {
  documents: PropTypes.object.isRequired,
  connections: PropTypes.object,
  SearchBar: PropTypes.func,
  List: PropTypes.func.isRequired,
  Sort: PropTypes.func,
  ActionButtons: PropTypes.func,
  GraphView: PropTypes.func,
  loadMoreDocuments: PropTypes.func,
  deleteConnection: PropTypes.func,
  sortButtonsStateProperty: PropTypes.string,
  storeKey: PropTypes.string,
  onSnippetClick: PropTypes.func,
  clickOnDocument: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  view: PropTypes.string
};
