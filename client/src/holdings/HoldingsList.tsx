import './HoldingsList.css';
import React, {useEffect, useState} from 'react';
import AddHoldingForm from './AddHoldingForm';
import AddTrade from './AddTradeDialog';
import API from '../api';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TradesList from './TradesList';
import {User} from '../App';

/**
 * A holding as displayed to the user.
 * Made up of data from multiple APIs.
 */
export interface Holding {
  id: number;
  username: string;
  name: string;
  symbol: string;
  price: number;
  currency: string;
  trades?: Trade[];
}

export type CreateHoldingData = Omit<Holding, 'id' | 'price'>;

/** A trade as returned from the API. */
export interface Trade {
  id: number;
  holding: number;
  date: string;
  broker: string;
  quantity: number;
  unitPrice: number;
  fee: number;
  fxRate: number;
  fxFee: number;
}

export type CreateTradeData = Omit<Trade, 'id'>;

export type HoldingsListProps = {
  user: User;
};

/** Displays of all the user's holdings with the option to add more. */
export default function HoldingsList(props: HoldingsListProps) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    API.listHoldings(props.user.username).then(async (holdings) => {
      if (holdings.length) {
        await API.applyPrices(holdings);
        setHoldings(holdings);
      }
      setIsDataLoaded(true);
    });
  }, [props.user.username]);

  const [open, setOpen] = React.useState(holdings.map(() => false));
  const handleClick = (i: number) => {
    open[i] = !open[i];
    setOpen([...open]);
  };

  const addHolding = (holding: Holding) => {
    holdings.push(holding);
    setHoldings([...holdings]);
  };

  const deleteHolding = async (id: number, holdingIndex: number) => {
    try {
      await API.deleteHolding(id);
      holdings.splice(holdingIndex, 1);
      setHoldings([...holdings]);
    } catch (err) {
      console.error(err);
    }
  };

  const addTrade = (trade: Trade, holdingIndex: number) => {
    if (!holdings[holdingIndex].trades) return;
    holdings[holdingIndex].trades!.push(trade);
    setHoldings([...holdings]);
  };

  const deleteTrade = async (
    id: number,
    holdingIndex: number,
    tradeIndex: number,
  ) => {
    try {
      await API.deleteTrade(id);
      if (!holdings[holdingIndex].trades) return;
      holdings[holdingIndex].trades!.splice(tradeIndex, 1);
      setHoldings([...holdings]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isDataLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div className="HoldingsList">
      <h2>Holdings</h2>
      {Boolean(holdings.length) && (
        <List>
          {holdings.map((h, i) => (
            <React.Fragment key={i}>
              <ListItem
                button
                onClick={() => {
                  handleClick(i);
                }}
              >
                <div className="holding">
                  <div>{h.symbol}</div>
                  <div>
                    {h.currency} {h.price}
                  </div>
                  <IconButton
                    onClick={() => deleteHolding(h.id, i)}
                    aria-label="delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </ListItem>
              <Collapse in={open[i]} timeout="auto" unmountOnExit>
                <TradesList
                  holding={h}
                  onDeleteTradeClicked={(id: number, tradeIndex: number) => {
                    deleteTrade(id, i, tradeIndex);
                  }}
                ></TradesList>
                <div className="AddTrade-button-container">
                  <AddTrade
                    holding={h}
                    onTradeCreated={(trade: Trade) => addTrade(trade, i)}
                  ></AddTrade>
                </div>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      )}
      <AddHoldingForm
        username={props.user.username}
        onHoldingCreated={(h: Holding) => addHolding(h)}
      ></AddHoldingForm>
    </div>
  );
}
