/**
 * Copyright (c) IBM, Corp. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, css, customElement } from 'lit-element';

import { PageElement } from './page-element';

@customElement('page-home')
export class PageHome extends PageElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          padding: 1rem;
        }
      `
    ];
  }

  protected render() {
    return html`
      <section>
        <h1>Home</h1>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi,
          delectus? Unde, sit. Fuga modi ea praesentium. Nemo dicta qui, magnam
          cum dolorum excepturi beatae explicabo quidem fugiat ullam blanditiis
          minima!
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi,
          delectus? Unde, sit. Fuga modi ea praesentium. Nemo dicta qui, magnam
          cum dolorum excepturi beatae explicabo quidem fugiat ullam blanditiis
          minima!
        </p>

        <p>
          You can <a href="/error">click here</a> to go to a page that does not
          exist.
        </p>
      </section>
    `;
  }
}
