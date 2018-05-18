import React from 'react';
import ReactDOM from 'react-dom';
import './override.css';
import InlineApp from './InlineApp';
import {JishoConstants} from "./Configuration/JishoConstants";

const results = document.querySelectorAll(JishoConstants.resultsSelector);

results.forEach(function (result, i) {
  const resultId = "result_" + i;
  result.id = resultId;

  const linksBlock = result.querySelector(JishoConstants.linksBlockBelowKanjiSelector);
  const addToAnkiContainer = document.createElement('div');
  linksBlock.prepend(addToAnkiContainer);

  ReactDOM.render(<InlineApp id={resultId}/>, addToAnkiContainer);
});
