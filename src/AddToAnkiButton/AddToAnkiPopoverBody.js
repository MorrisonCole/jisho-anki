/* global chrome */
import React from "react";
import {InputGroup, InputGroupAddon, PopoverBody} from 'reactstrap';
import PropTypes from "prop-types";
import {JishoConstants} from "../Configuration/JishoConstants";
import {Button, Form, FormGroup, Label, Input} from 'reactstrap';
import {
  ankiConnectAddNote,
  ankiConnectDeckNames,
  ankiConnectModelFieldNames,
  ankiConnectModelNames
} from "../AnkiConnect/AnkiConnect";
// import 'bootstrap/dist/css/bootstrap.min.css'; // TODO: This is too much stuff, need to cut it down.

export default class AddToAnkiPopoverBody extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: true,
      deckNames: [],
      modelNames: [],
      fieldNames: [],
      kanji: this.extractKanji(),
      alternativeReadings: this.extractAlternativeReadings(),
      english: this.extractEnglish(),
      deckPreference: "",
      modelPreference: ""
    };

    this.addNote = this.addNote.bind(this);
    this.bindFields = this.bindFields.bind(this);
    this.handleDeckSelectorChange = this.handleDeckSelectorChange.bind(this);
    this.handleModelSelectorChange = this.handleModelSelectorChange.bind(this);
  }

  componentDidMount() {
    this.setState(prevState => ({
      isProcessing: true,
      isToggleOn: !prevState.isToggleOn
    }));

    Promise.all([ankiConnectDeckNames(), ankiConnectModelNames(), this.getSelectedDeck(), this.getSelectedModel()])
      .then(response => {
        this.setState(previousState => ({
          isProcessing: false,
          isToggleOn: !previousState.isToggleOn,
          deckNames: response[0],
          modelNames: response[1],
          deckPreference: response[2],
          modelPreference: response[3]
        }));

        const indexOfModelPreference = this.state.modelNames.indexOf(this.state.modelPreference);
        if (indexOfModelPreference > -1) {
          this.bindFields(this.state.modelNames[indexOfModelPreference])
        } else {
          this.bindFields(this.state.modelNames[0])
        }
      })
      .catch(reason => {
        console.error(reason);
      })
  }

  extractKanji() {
    const kanjiNode = document.getElementById(this.props.id).querySelector(JishoConstants.kanjiSelector);
    const furiganaNode = document.getElementById(this.props.id).querySelector(JishoConstants.furiganaParentSelector);

    const furigana = [];
    furiganaNode.querySelectorAll(JishoConstants.furiganaChildrenSelector).forEach(furiganaTextNode => furigana.push(furiganaTextNode.textContent.trim()));

    const word = kanjiNode.textContent.trim();
    return word.replace(/./g, character => {
      if (this.isKanji(character)) {
        return ` ${character}[${furigana.shift()}]`
      } else {
        return character
      }
    });
  }

  extractAlternativeReadings() {
    const meaningNodes = document.getElementById(this.props.id).querySelectorAll(JishoConstants.meaningsSelector);

    let alternativeReadings = "";
    meaningNodes.forEach(meaningNode => {
      const section = meaningNode.parentNode.parentNode.previousSibling.textContent.trim();
      if (section === "Other forms") {
        alternativeReadings = meaningNode.textContent.trim()
      }
    });
    return alternativeReadings;
  }

  isKanji(character) {
    return (character >= "\u4e00" && character <= "\u9faf") || (character >= "\u3400" && character <= "\u4dbf");
  }

  extractEnglish() {
    const meaningNodes = document.getElementById(this.props.id).querySelectorAll(JishoConstants.meaningsSelector);

    let relevantMeanings = "";
    meaningNodes.forEach(meaningNode => {

      const section = meaningNode.parentNode.parentNode.previousSibling.textContent.trim();
      if (section !== "Wikipedia definition" && section !== "Other forms") {
        relevantMeanings += `<li>${meaningNode.textContent.trim()}</li>`
      }
    });
    return relevantMeanings;
  }

  addNote(e) {
    e.preventDefault();

    const deckName = e.target.elements.namedItem("deckSelector").value;
    const modelName = e.target.elements.namedItem("modelSelector").value;
    const fieldNames = document.getElementsByName("fieldSelector");

    const mapThing = new Map([
      ["Japanese", this.state.kanji],
      ["Alternative Japanese Reading(s)", this.state.alternativeReadings],
      ["English", this.state.english]
    ]);

    const mapOfDoom = new Map();
    fieldNames.forEach(fieldName => {
        if (fieldName.value !== "-") {
          mapOfDoom.set(fieldName.id, mapThing.get(fieldName.value))
        }
      }
    );

    ankiConnectAddNote({
      "note": {
        "deckName": deckName,
        "modelName": modelName,
        "fields": strMapToObj(mapOfDoom)
      }
    });

    function strMapToObj(strMap) {
      let obj = Object.create(null);
      for (let [k, v] of strMap) {
        obj[k] = v;
      }
      return obj;
    }
  }

  handleDeckSelectorChange(e) {
    this.saveSelectedDeck(e.target.value)
  }

  handleModelSelectorChange(e) {
    this.saveSelectedModel(e.target.value);
    this.bindFields(e.target.value)
  }

  saveSelectedDeck(deck) {
    chrome.storage.sync.set({"selectedDeck": deck});
  }

  saveSelectedModel(deck) {
    chrome.storage.sync.set({"selectedModel": deck});
  }

  getSelectedDeck() {
    return new Promise(resolve => {
      chrome.storage.sync.get(["selectedDeck"], result => {
        resolve(result.selectedDeck)
      });
    })
  }

  getSelectedModel() {
    return new Promise(resolve => {
      chrome.storage.sync.get(["selectedModel"], result => {
        resolve(result.selectedModel)
      });
    })
  }

  bindFields(modelName) {
    ankiConnectModelFieldNames(modelName)
      .then(response => {
        this.setState({
          fieldNames: response
        })
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  generateFieldOptions(index) {
    return <React.Fragment>
      <option>-</option>
      <option selected={index === 0}>Japanese</option>
      <option selected={index === 1}>Alternative Japanese Reading(s)</option>
      <option selected={index === 2}>English</option>
    </React.Fragment>
  }

  render() {
    return (
      <PopoverBody>
        <Form onSubmit={this.addNote}>
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">Deck</InputGroupAddon>
              <Input type="select" name="select" className="custom-select" id="deckSelector" onChange={this.handleDeckSelectorChange}>
                {this.state.deckNames.map((deckName) => {
                  if (deckName === this.state.deckPreference) {
                    return <option selected>{deckName}</option>
                  } else {
                    return <option>{deckName}</option>
                  }
                })}
              </Input>
            </InputGroup>

            <br/>

            <InputGroup>
              <InputGroupAddon addonType="prepend">Model</InputGroupAddon>
              <Input type="select" name="select" className="custom-select" id="modelSelector"
                     onChange={this.handleModelSelectorChange}>
                {this.state.modelNames.map((modelName) => {
                  if (modelName === this.state.modelPreference) {
                    return <option selected>{modelName}</option>
                  } else {
                    return <option>{modelName}</option>
                  }
                })}
              </Input>
            </InputGroup>

            <br/>

            <Label>Field Mappings:</Label>
            {this.state.fieldNames.map((fieldName, i) =>
              <React.Fragment>
                <InputGroup size="sm">
                  <InputGroupAddon addonType="prepend">{fieldName}</InputGroupAddon>
                  <Input type="select" className="custom-select" name="fieldSelector" id={fieldName}>
                    {this.generateFieldOptions(i)}
                  </Input>
                </InputGroup>
                <br/>
              </React.Fragment>
            )}
          </FormGroup>
          <Button>Add word</Button>
        </Form>
      </PopoverBody>
    );
  }
}
