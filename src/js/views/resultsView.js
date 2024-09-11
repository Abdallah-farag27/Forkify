import View from './View';
import perviewView from './perviewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes Found for your query! Please try again';

  _generateMarkup() {
    return this._data
      .map(result => perviewView.render(result, false))
      .join(' ');
  }
}

export default new ResultsView();
