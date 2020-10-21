import './HoldingsList.css';
import API, {Holding, Trade} from '../api';
import React, {useEffect, useState} from 'react';
import {calculateHoldingPerformance, getPerfClass} from './utils';
import AddHoldingForm from './AddHoldingForm';
import AddTrade from './AddTradeDialog';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TradesList from './TradesList';
import {User} from '../App';

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
    return <div className="loading">Loading...</div>;
  }
  return (
    <div className="HoldingsList">
      <h2>Holdings</h2>
      {Boolean(holdings.length) && (
        <List>
          {holdings.map((h, i) => {
            const perf = calculateHoldingPerformance(h);
            const perfClass = getPerfClass(perf);
            return (
              <React.Fragment key={i}>
                <ListItem
                  button
                  onClick={() => {
                    handleClick(i);
                  }}
                >
                  <div className="holding">
                    <div>{h.symbol}</div>
                    <div>{h.exchange}</div>
                    <div>
                      {h.currency} {h.price?.toFixed(2) ?? 0}
                    </div>
                    <div className={perfClass}>{perf.toFixed(2)}%</div>
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
            );
          })}
        </List>
      )}
      <AddHoldingForm
        username={props.user.username}
        onHoldingCreated={(h: Holding) => addHolding(h)}
      ></AddHoldingForm>
    </div>
  );
}
