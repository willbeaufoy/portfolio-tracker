/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateHolding = /* GraphQL */ `
  subscription OnCreateHolding {
    onCreateHolding {
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
export const onUpdateHolding = /* GraphQL */ `
  subscription OnUpdateHolding {
    onUpdateHolding {
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
export const onDeleteHolding = /* GraphQL */ `
  subscription OnDeleteHolding {
    onDeleteHolding {
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
export const onCreateTrade = /* GraphQL */ `
  subscription OnCreateTrade {
    onCreateTrade {
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
export const onUpdateTrade = /* GraphQL */ `
  subscription OnUpdateTrade {
    onUpdateTrade {
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
export const onDeleteTrade = /* GraphQL */ `
  subscription OnDeleteTrade {
    onDeleteTrade {
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
