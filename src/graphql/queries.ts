/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getHolding = /* GraphQL */ `
  query GetHolding($id: ID!) {
    getHolding(id: $id) {
      id
      username
      code
      name
      trades {
        items {
          id
          holdingID
          amount
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listHoldings = /* GraphQL */ `
  query ListHoldings(
    $filter: ModelHoldingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHoldings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        code
        name
        trades {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTrade = /* GraphQL */ `
  query GetTrade($id: ID!) {
    getTrade(id: $id) {
      id
      holdingID
      holding {
        id
        username
        code
        name
        trades {
          nextToken
        }
        createdAt
        updatedAt
      }
      amount
      createdAt
      updatedAt
    }
  }
`;
export const listTrades = /* GraphQL */ `
  query ListTrades(
    $filter: ModelTradeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTrades(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        holdingID
        holding {
          id
          username
          code
          name
          createdAt
          updatedAt
        }
        amount
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
