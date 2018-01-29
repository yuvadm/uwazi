import {Form} from 'react-redux-form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import FormGroup from 'app/DocumentForm/components/FormGroup';

import {Button, SidePanel} from '../../Layout';
import {MultiSelect} from '../../ReactReduxForms';
import {resetEvidencesFilters, searchEvidences} from '../actions';
import {t} from '../../I18N';

const EvidencesFilters = (props) => {
  return (
    <SidePanel open className="library-filters">

      <SidePanel.Footer>
        <Button onClick={props.reset} icon="refresh">{t('System', 'Reset')}</Button>
        <Button success icon="search">{t('System', 'Search')}</Button>
      </SidePanel.Footer>

      <SidePanel.Body>
        <p className="sidepanel-title">{t('System', 'Filters configuration')}</p>
        <Form model='evidences.search' onChange={props.onChange}>
          {props.thesauris.filter(thesauri => thesauri.get('values').size).map((thesauri, index) => {
            return (
              <FormGroup key={index}>
                <ul className="search__filter is-active">
                  <li>{thesauri.get('name')}</li>
                  <li className="wide">
                    <MultiSelect
                      model={'.filters.value.values'}
                      prefix={thesauri.name}
                      options={thesauri.get('values').toJS()}
                      optionsValue="id"
                    />
                  </li>
                </ul>
              </FormGroup>
            );
          })}
        </Form>
      </SidePanel.Body>

    </SidePanel>
  );
};

EvidencesFilters.propTypes = {
  thesauris: PropTypes.instanceOf(Immutable.List),
  onChange: PropTypes.func,
  reset: PropTypes.func
};

export function mapStateToProps({thesauris}) {
  return {
    thesauris
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onChange: searchEvidences,
    reset: resetEvidencesFilters
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EvidencesFilters);
