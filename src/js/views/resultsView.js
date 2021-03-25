import icons from 'url:../../../src/img/icons.svg'
import View from './View.js'
import previewView from './previewView.js'

class ResultsView extends View{
  errorMessage = 'No recipes found for your query. Please, try again';
  message = '';
  parentElement = document.querySelector('.results');



  generateMarkup() {
    return this.data.map(result => previewView.render(result, false)).join('')
}
}

export default new ResultsView();