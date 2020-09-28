/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateHoldingInput = {
  id?: string | null,
  username: string,
  symbol: string,
  name: string,
  currency: string,
};

export type ModelHoldingConditionInput = {
  username?: ModelStringInput | null,
  symbol?: ModelStringInput | null,
  name?: ModelStringInput | null,
  currency?: ModelStringInput | null,
  and?: Array< ModelHoldingConditionInput | null > | null,
  or?: Array< ModelHoldingConditionInput | null > | null,
  not?: ModelHoldingConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type UpdateHoldingInput = {
  id: string,
  username?: string | null,
  symbol?: string | null,
  name?: string | null,
  currency?: string | null,
};

export type DeleteHoldingInput = {
  id?: string | null,
};

export type CreateTradeInput = {
  id?: string | null,
  holdingID: string,
  date: number,
  shares: number,
  price: number,
  fee: number,
};

export type ModelTradeConditionInput = {
  holdingID?: ModelIDInput | null,
  date?: ModelIntInput | null,
  shares?: ModelFloatInput | null,
  price?: ModelFloatInput | null,
  fee?: ModelFloatInput | null,
  and?: Array< ModelTradeConditionInput | null > | null,
  or?: Array< ModelTradeConditionInput | null > | null,
  not?: ModelTradeConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateTradeInput = {
  id: string,
  holdingID?: string | null,
  date?: number | null,
  shares?: number | null,
  price?: number | null,
  fee?: number | null,
};

export type DeleteTradeInput = {
  id?: string | null,
};

export type ModelHoldingFilterInput = {
  id?: ModelIDInput | null,
  username?: ModelStringInput | null,
  symbol?: ModelStringInput | null,
  name?: ModelStringInput | null,
  currency?: ModelStringInput | null,
  and?: Array< ModelHoldingFilterInput | null > | null,
  or?: Array< ModelHoldingFilterInput | null > | null,
  not?: ModelHoldingFilterInput | null,
};

export type ModelTradeFilterInput = {
  id?: ModelIDInput | null,
  holdingID?: ModelIDInput | null,
  date?: ModelIntInput | null,
  shares?: ModelFloatInput | null,
  price?: ModelFloatInput | null,
  fee?: ModelFloatInput | null,
  and?: Array< ModelTradeFilterInput | null > | null,
  or?: Array< ModelTradeFilterInput | null > | null,
  not?: ModelTradeFilterInput | null,
};

export type CreateHoldingMutationVariables = {
  input: CreateHoldingInput,
  condition?: ModelHoldingConditionInput | null,
};

export type CreateHoldingMutation = {
  createHolding:  {
    __typename: "Holding",
    id: string,
    username: string,
    symbol: string,
    name: string,
    currency: string,
    trades:  {
      __typename: "ModelTradeConnection",
      items:  Array< {
        __typename: "Trade",
        id: string,
        holdingID: string,
        date: number,
        shares: number,
        price: number,
        fee: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateHoldingMutationVariables = {
  input: UpdateHoldingInput,
  condition?: ModelHoldingConditionInput | null,
};

export type UpdateHoldingMutation = {
  updateHolding:  {
    __typename: "Holding",
    id: string,
    username: string,
    symbol: string,
    name: string,
    currency: string,
    trades:  {
      __typename: "ModelTradeConnection",
      items:  Array< {
        __typename: "Trade",
        id: string,
        holdingID: string,
        date: number,
        shares: number,
        price: number,
        fee: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteHoldingMutationVariables = {
  input: DeleteHoldingInput,
  condition?: ModelHoldingConditionInput | null,
};

export type DeleteHoldingMutation = {
  deleteHolding:  {
    __typename: "Holding",
    id: string,
    username: string,
    symbol: string,
    name: string,
    currency: string,
    trades:  {
      __typename: "ModelTradeConnection",
      items:  Array< {
        __typename: "Trade",
        id: string,
        holdingID: string,
        date: number,
        shares: number,
        price: number,
        fee: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTradeMutationVariables = {
  input: CreateTradeInput,
  condition?: ModelTradeConditionInput | null,
};

export type CreateTradeMutation = {
  createTrade:  {
    __typename: "Trade",
    id: string,
    holdingID: string,
    date: number,
    shares: number,
    price: number,
    fee: number,
    holding:  {
      __typename: "Holding",
      id: string,
      username: string,
      symbol: string,
      name: string,
      currency: string,
      trades:  {
        __typename: "ModelTradeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTradeMutationVariables = {
  input: UpdateTradeInput,
  condition?: ModelTradeConditionInput | null,
};

export type UpdateTradeMutation = {
  updateTrade:  {
    __typename: "Trade",
    id: string,
    holdingID: string,
    date: number,
    shares: number,
    price: number,
    fee: number,
    holding:  {
      __typename: "Holding",
      id: string,
      username: string,
      symbol: string,
      name: string,
      currency: string,
      trades:  {
        __typename: "ModelTradeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTradeMutationVariables = {
  input: DeleteTradeInput,
  condition?: ModelTradeConditionInput | null,
};

export type DeleteTradeMutation = {
  deleteTrade:  {
    __typename: "Trade",
    id: string,
    holdingID: string,
    date: number,
    shares: number,
    price: number,
    fee: number,
    holding:  {
      __typename: "Holding",
      id: string,
      username: string,
      symbol: string,
      name: string,
      currency: string,
      trades:  {
        __typename: "ModelTradeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetHoldingQueryVariables = {
  id: string,
};

export type GetHoldingQuery = {
  getHolding:  {
    __typename: "Holding",
    id: string,
    username: string,
    symbol: string,
    name: string,
    currency: string,
    trades:  {
      __typename: "ModelTradeConnection",
      items:  Array< {
        __typename: "Trade",
        id: string,
        holdingID: string,
        date: number,
        shares: number,
        price: number,
        fee: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListHoldingsQueryVariables = {
  filter?: ModelHoldingFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListHoldingsQuery = {
  listHoldings:  {
    __typename: "ModelHoldingConnection",
    items:  Array< {
      __typename: "Holding",
      id: string,
      username: string,
      symbol: string,
      name: string,
      currency: string,
      trades:  {
        __typename: "ModelTradeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetTradeQueryVariables = {
  id: string,
};

export type GetTradeQuery = {
  getTrade:  {
    __typename: "Trade",
    id: string,
    holdingID: string,
    date: number,
    shares: number,
    price: number,
    fee: number,
    holding:  {
      __typename: "Holding",
      id: string,
      username: string,
      symbol: string,
      name: string,
      currency: string,
      trades:  {
        __typename: "ModelTradeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTradesQueryVariables = {
  filter?: ModelTradeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTradesQuery = {
  listTrades:  {
    __typename: "ModelTradeConnection",
    items:  Array< {
      __typename: "Trade",
      id: string,
      holdingID: string,
      date: number,
      shares: number,
      price: number,
      fee: number,
      holding:  {
        __typename: "Holding",
        id: string,
        username: string,
        symbol: string,
        name: string,
        currency: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateHoldingSubscription = {
  onCreateHolding:  {
    __typename: "Holding",
    id: string,
    username: string,
    symbol: string,
    name: string,
    currency: string,
    trades:  {
      __typename: "ModelTradeConnection",
      items:  Array< {
        __typename: "Trade",
        id: string,
        holdingID: string,
        date: number,
        shares: number,
        price: number,
        fee: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateHoldingSubscription = {
  onUpdateHolding:  {
    __typename: "Holding",
    id: string,
    username: string,
    symbol: string,
    name: string,
    currency: string,
    trades:  {
      __typename: "ModelTradeConnection",
      items:  Array< {
        __typename: "Trade",
        id: string,
        holdingID: string,
        date: number,
        shares: number,
        price: number,
        fee: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteHoldingSubscription = {
  onDeleteHolding:  {
    __typename: "Holding",
    id: string,
    username: string,
    symbol: string,
    name: string,
    currency: string,
    trades:  {
      __typename: "ModelTradeConnection",
      items:  Array< {
        __typename: "Trade",
        id: string,
        holdingID: string,
        date: number,
        shares: number,
        price: number,
        fee: number,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTradeSubscription = {
  onCreateTrade:  {
    __typename: "Trade",
    id: string,
    holdingID: string,
    date: number,
    shares: number,
    price: number,
    fee: number,
    holding:  {
      __typename: "Holding",
      id: string,
      username: string,
      symbol: string,
      name: string,
      currency: string,
      trades:  {
        __typename: "ModelTradeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTradeSubscription = {
  onUpdateTrade:  {
    __typename: "Trade",
    id: string,
    holdingID: string,
    date: number,
    shares: number,
    price: number,
    fee: number,
    holding:  {
      __typename: "Holding",
      id: string,
      username: string,
      symbol: string,
      name: string,
      currency: string,
      trades:  {
        __typename: "ModelTradeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTradeSubscription = {
  onDeleteTrade:  {
    __typename: "Trade",
    id: string,
    holdingID: string,
    date: number,
    shares: number,
    price: number,
    fee: number,
    holding:  {
      __typename: "Holding",
      id: string,
      username: string,
      symbol: string,
      name: string,
      currency: string,
      trades:  {
        __typename: "ModelTradeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
