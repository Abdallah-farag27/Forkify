import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // page 1 , and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupNextBtn(curPage);
    }
    // last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupPervBtn(curPage);
    }
    //other page
    if (curPage < numPages) {
      return `
     ${this._generateMarkupPervBtn(curPage)}
     ${this._generateMarkupNextBtn(curPage)}
    `;
    }
    // page 1 , and there are no other pages
    return '';
  }
  _generateMarkupPervBtn(curPage) {
    return ` <button class="btn--inline pagination__btn--prev" data-goto="${
      curPage - 1
    }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>`;
  }
  _generateMarkupNextBtn(curPage) {
    return `
     <button class="btn--inline pagination__btn--next" data-goto="${
       curPage + 1
     }">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }
}
export default new PaginationView();
