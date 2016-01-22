import React, { Component, PropTypes } from 'react'
import ConfigInputField from './configFields/ConfigInputField.js'
import TemplatesList from './TemplatesList.js'
import InputField from './fields/InputField.js'
import api from '../../utils/api'

class FormCreator extends Component {

  static defaultTemplate = {
    name:'template name',
    fields: [
      {type:'input', label:'Short textsss', required: true},
      {type:'select', label:'Dropdown', required: false}
    ]
  };


  constructor (props, context) {
    super(props, context);
    this.state = {
      templates: props.templates,
      template: this.defaultTemplate()
    }
  };

  defaultTemplate(){
    return {name:'', fields:[]};
  };

  componentWillReceiveProps = (props) => {

    let template = this.defaultTemplate();
    if(props.templateId) {
      template = props.templates.find(template => template.key == props.templateId).value;
    }

    this.setState({
      templates: props.templates,
      template: template
    });
  };

  addInput = () => {
    this.state.template.fields.push({type:'input', label:'Short text', required: false});
    this.setState(this.state);
  };

  save = (e) => {
    e.preventDefault();
    this.state.template.name = this.inputName.value();
    this.props.save(this.state.template);
  };

  remove = (index) => {
    this.state.template.fields.splice(index, 1);
    this.setState(this.state);
  };

  update = (index, field) => {
    this.state.template.fields[index] = field;
    this.setState(this.state);
  };

  render = () => {
    return (
      <div>
        <h1>Form Creator!</h1>
        <div className="row">
          <div className="col-xs-2">
            <a className="btn btn-primary glyphicon glyphicon-plus" onClick={this.addInput}> Add field</a>
            <TemplatesList templates={this.state.templates || []} active={this.state.template}/>
          </div>
          <div className="col-xs-8">
            <InputField label="Template name" value={this.state.template.name} ref={(ref) => this.inputName = ref}/>
            <form className="form-horizontal" onSubmit={this.save}>
              {this.state.template.fields.map((field, index) => {
                return <ConfigInputField remove={this.remove.bind(this,index)} save={this.update.bind(this,index)} field={field} key={index} />
              })}
              <button type="submit" className="btn btn-default">Save !</button>
            </form>
          </div>
        </div>
      </div>
    )
  };

}

export default FormCreator;