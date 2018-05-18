import React from 'react';
import { Popover, PopoverHeader} from 'reactstrap';
import './BootstrapPopover.css'
import './AddToAnkiButton.css'
import AddToAnkiPopoverBody from "./AddToAnkiPopoverBody";
import PropTypes from 'prop-types';

export default class AddToAnkiButton extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.toggle();
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    const popoverId = "popover" + this.props.id;
    const buttonText = this.state.popoverOpen ? "+/- Anki" : "+/- Anki";


    return (
      <div>
        <a id={popoverId} href="#" onClick={this.handleClick}>
          {buttonText}
        </a>
        <Popover placement="right" isOpen={this.state.popoverOpen} target={popoverId} toggle={this.toggle}>
          <PopoverHeader>Add to Deck:</PopoverHeader>
          <AddToAnkiPopoverBody id={this.props.id}/>
        </Popover>
      </div>
    );
  }
}
