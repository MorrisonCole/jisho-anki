import React, {Component} from 'react';
import './InlineApp.css';
import AddToAnkiButton from "./AddToAnkiButton/AddToAnkiButton.js";
import PropTypes from 'prop-types';

export default class InlineApp extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  render() {
    return (
      <span className="concept_light-tag concept_light-common success label" style={{background: "#4f9bc6"}}>
        <AddToAnkiButton id={this.props.id}/>
      </span>
    );
  }
}
