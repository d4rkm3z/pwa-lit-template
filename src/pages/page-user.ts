/**
 * Copyright (c) IBM and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE.txt
 * file in the root directory of this source tree.
 */

import { html, customElement, query } from 'lit-element';

import config from '../config';
import { PageElement } from './page-element';
import { client, gql } from '../graphql-service';
import { connectApollo, renderPageNotFound } from '../helpers';

const GET_USER = gql`
  query GetUser($where: JSON) {
    users(where: $where) {
      id
      username
      fullName
    }
  }
`;

const UPDATE_USER_USERNAME = gql`
  mutation UpdateUserUsername($id: ID!, $fullName: String!) {
    updateUser(input: { where: { id: $id }, data: { fullName: $fullName } }) {
      user {
        fullName
      }
    }
  }
`;

@customElement('page-user')
export class PageUser extends connectApollo(client)(PageElement) {
  @query('#form')
  private _form?: HTMLFormElement;

  protected render() {
    const user = this.data && this.data.users[0];

    if (user === undefined && !this.loading) {
      return renderPageNotFound();
    }

    // prettier-ignore
    return html`
      <section>
        <h1>User</h1>

        <p>Username: ${user && user.username}</p>
        <p>Full name: ${user && user.fullName}</p>

        ${this.loading ? html`
          <div>Loading user...</div>
        ` : null}

        ${user ? html`
          <form id="form" @submit=${this.updateUser}>
            <label for="fullName">New full name:</label>
            <input id="fullName" name="fullName" type="text" />
            <input type="submit" value="Update" />
          </form>
        ` : null}
      </section>
    `;
  }

  protected onBeforeEnter(location: Router.Location) {
    this.query({
      query: GET_USER,
      variables: {
        where: {
          username: location.params.username
        }
      }
    });
  }

  protected updateUser(event: Event) {
    event.preventDefault();

    const formData = new FormData(this._form);
    const newUsername = formData.get('fullName');
    const user = this.data.users[0];

    this.mutate({
      mutation: UPDATE_USER_USERNAME,
      variables: { id: user.id, fullName: newUsername },
      update: (cache, { data: { updateUser } }) => {
        try {
          const data = cache.readQuery({
            query: GET_USER,
            variables: {
              where: { username: user.username }
            }
          });

          data.users[0].fullName = updateUser.user.fullName;

          cache.writeQuery({
            query: GET_USER,
            variables: {
              where: { username: user.username }
            },
            data
          });
        } catch (error) {
          // TODO: Manage the errors
          console.error(error);
        }

        // TODO: Can we move this inside the mixin?
        this.loading = false;
      }
    });
  }

  protected updateMetadata() {
    const user = this.data && this.data.users[0];

    if (!user) {
      return;
    }

    return {
      title: `${user.fullName} (@${user.username}) | ${config.name}`,
      description: `All the information about ${user.fullName}.`,
      url: window.location.href
    };
  }
}
