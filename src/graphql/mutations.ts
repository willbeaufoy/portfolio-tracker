/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createHolding = /* GraphQL */ `
  mutation CreateHolding(
    $input: CreateHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    createHolding(input: $input, condition: $condition) {
      id
      username
      symbol
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
export const updateHolding = /* GraphQL */ `
  mutation UpdateHolding(
    $input: UpdateHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    updateHolding(input: $input, condition: $condition) {
      id
      username
      symbol
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
export const deleteHolding = /* GraphQL */ `
  mutation DeleteHolding(
    $input: DeleteHoldingInput!
    $condition: ModelHoldingConditionInput
  ) {
    deleteHolding(input: $input, condition: $condition) {
      id
      username
      symbol
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
export const createTrade = /* GraphQL */ `
  mutation CreateTrade(
    $input: CreateTradeInput!
    $condition: ModelTradeConditionInput
  ) {
    createTrade(input: $input, condition: $condition) {
      id
      holdingID
      holding {
        id
        username
        symbol
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
export const updateTrade = /* GraphQL */ `
  mutation UpdateTrade(
    $input: UpdateTradeInput!
    $condition: ModelTradeConditionInput
  ) {
    updateTrade(input: $input, condition: $condition) {
      id
      holdingID
      holding {
        id
        username
        symbol
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
export const deleteTrade = /* GraphQL */ `
  mutation DeleteTrade(
    $input: DeleteTradeInput!
    $condition: ModelTradeConditionInput
  ) {
    deleteTrade(input: $input, condition: $condition) {
      id
      holdingID
      holding {
        id
        username
        symbol
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
